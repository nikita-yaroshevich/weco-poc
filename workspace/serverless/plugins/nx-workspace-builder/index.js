'use strict';

const vm = require('vm');
const {watch} = require('fs');
const fs = require('fs-extra');
const Module = require('module');
const path = require('path');
const {execSync} = require('child_process');
const {exec} = require('child_process');
const {spawn} = require('child_process');
const globby = require('globby');
const util = require('util');
const {debounce} = require('lodash');
// const exec = util.promisify(require('child_process').exec);

const serverlessFolder = '.serverless';

class NxWorkspaceBuilder {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    const nx = (this.serverless.variables.service.custom && this.serverless.variables.service.custom.nx) ? this.serverless.variables.service.custom.nx : {};
    this.config = {
      workspacePath: this.serverless.variables.service.custom.workspacePath || './',
      ...nx,
    };

    this.stdin = process.stdin;
    this.stdout = process.stdout;
    this.stderr = process.stderr;

    this.commands = {
      welcome: {
        usage: 'Helps you start your first Serverless plugin',
        lifecycleEvents: ['hello', 'world'],
        options: {
          message: {
            usage:
              'Specify the message you want to deploy ' +
              '(e.g. "--message \'My Message\'" or "-m \'My Message\'")',
            required: true,
            shortcut: 'm',
          },
        },
      },
    };

    this.hooks = {
      'before:package:createDeploymentArtifacts': () => (this.build()),
      'after:package:createDeploymentArtifacts': () => (this.cleanup()),
      'before:deploy:function:packageFunction': () => (this.build()),
      'after:deploy:function:packageFunction': () => (this.cleanup()),
      'before:offline:start:init': async () => {

        // if (!this.originalServicePath) {
        //   // Save original service path and functions
        //   this.originalServicePath = this.serverless.config.servicePath;
        //   // Fake service path so that serverless will know what to zip
        //   this.serverless.config.servicePath = path.join(this.distFolder, 'api');
        // }
        // this.buildApp(this.options.nxapp || this.serverless.service.service, true);
        this.build(true);
      },
      'before:offline:start:end': async () => {
        this.serverless.config.servicePath = this.originalServicePath;
      }
      // this.buildApp(this.options.nxapp || this.serverless.service.service, true);
    };
  }

  get functions() {
    return this.options.function
      ? {[this.options.function]: this.serverless.service.functions[this.options.function]}
      : this.serverless.service.functions
  }

  get buildTargets() {
    console.log(this.options);
    const optionsApps = (this.options.nxapps || '').split(',').map(s => s.trim()).filter(s => s !== '');
    const apps = [].concat(this.config.apps || []);
    const targets = [].concat(optionsApps, apps.filter(a => optionsApps.indexOf(a) === -1));
    return targets;
  }

  get distFolder() {
    return path.join(this.config.workspacePath, 'dist', 'apps');
  }

  async build(isWatching = false) {
    const tasks = this.buildTargets.map(targetName => (
        () => (this.buildApp(targetName, isWatching).then(r => {
          this.serverless.cli.log(`Target ${targetName} builded successfuly`);
          return r;
        }).catch(e => {
          this.serverless.cli.warn(`Target ${targetName} FAIL`);
          return Promise.reject(e)
        }))
      )
    );
    const isParallel = this.options.nxParalel || this.config.isParallel || false;

    const promise = isParallel ? Promise.all(tasks.map(t => t())) : tasks.reduce((p, fn) => p.then(fn), Promise.resolve());
    if (!isWatching) {
      return promise;
    }
  }

  buildApp(appName, isWatching = false) {
    const buildFolder = path.join(this.distFolder, appName);
    if (!this.originalServicePath) {
      // Save original service path and functions
      this.originalServicePath = this.serverless.config.servicePath;
      // Fake service path so that serverless will know what to zip
      this.serverless.config.servicePath = buildFolder;
    }
    if (isWatching){
      fs.ensureDir(buildFolder);
      // hot reload
      const watcher = watch(buildFolder, (eventType, filename) => {
        if (['.js', '.jsx'].indexOf(path.extname(filename)) !== -1) {
          const module = require.resolve(path.resolve(buildFolder, filename));
          delete require.cache[module];
        }
        // globby.sync(buildFolder).forEach(filename => {
          // if (['.js', '.jsx'].indexOf(path.extname(filename)) !== -1) {
          //   const module = require.resolve(path.resolve(filename));
          //   delete require.cache[module];
          // }
        // })
      });
      process.on('exit', function () {
        watcher.close();
      });
    }
    return this.runCommand('nx', ['build', appName, isWatching ? '--watch' : null])
      .then(() => {
        const files = globby.sync(buildFolder);
        return files;
      });
  }

  runCommand(hookScript, params = []) {
    console.log(`Running command: ${hookScript} ${params.join(' ')}`);
    return new Promise((resolve, reject) => {
      let childProcess = spawn(hookScript, params, {
        cwd: this.config.workspacePath,
        stdio: [this.stdin, this.stdout, this.stderr],
      });
      childProcess.on('exit', () => {
        console.log(`${hookScript} finished`);
        childProcess = null;
        resolve();
      });
      childProcess.on('error', (code) => {
        console.log(`${hookScript} terminated due to error ${code}`);
        childProcess = null;
        reject();
      });

      process.on('exit', function () {
        if (childProcess && childProcess.kill) {
          childProcess.kill();
        }
      });
    });
    // return execSync(hookScript, {stdio: [this.stdin, this.stdout, this.stderr]});
  }

  async copyExtras(appName) {
    const buildFolder = path.join(this.distFolder, appName);
    // include any "extras" from the "include" section
    if (this.serverless.service.package.include && this.serverless.service.package.include.length > 0) {
      const files = await globby(this.serverless.service.package.include);

      for (const filename of files) {
        const destFileName = path.resolve(path.join(buildFolder, filename));
        const dirname = path.dirname(destFileName);

        if (!fs.existsSync(dirname)) {
          fs.mkdirpSync(dirname)
        }

        if (!fs.existsSync(destFileName)) {
          fs.copySync(path.resolve(filename), path.resolve(path.join(buildFolder, filename)))
        }
      }
    }
  }

  async moveArtifacts(appName) {
    const buildFolder = path.join(this.distFolder, appName);
    await fs.copy(
      path.join(buildFolder, serverlessFolder),
      path.join(this.originalServicePath, serverlessFolder)
    );

    if (this.options.function) {
      console.log('!!!!!NOT TESTED!!!!');
      const fn = this.serverless.service.functions[this.options.function];
      const basename = path.basename(fn.package.artifact);
      fn.package.artifact = path.join(
        this.originalServicePath,
        serverlessFolder,
        path.basename(fn.package.artifact)
      );
      return;
    }

    if (this.serverless.service.package.individually) {
      console.log('!!!!!NOT TESTED!!!!');
      const functionNames = this.serverless.service.getAllFunctions();
      functionNames.forEach(name => {
        this.serverless.service.functions[name].package.artifact = path.join(
          this.originalServicePath,
          serverlessFolder,
          path.basename(this.serverless.service.functions[name].package.artifact)
        )
      });
      return;
    }

    this.serverless.service.package.artifact = path.join(
      this.originalServicePath,
      serverlessFolder,
      path.basename(this.serverless.service.package.artifact)
    );
  }

  async cleanup(appName) {
    const apps = this.buildTargets;
    for (let i = 0; i < apps.length; i++) {
      this.serverless.cli.log(`Moving Artifacts for ${apps[i]}`);
      await this.moveArtifacts(apps[i]);
    }
    // Restore service path
    this.serverless.config.servicePath = this.originalServicePath;
    // Remove temp build folder
    // fs.removeSync(path.join(this.originalServicePath, buildFolder))
  }
}

module.exports = NxWorkspaceBuilder;
