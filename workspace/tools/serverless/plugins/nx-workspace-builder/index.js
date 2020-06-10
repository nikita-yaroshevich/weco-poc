'use strict';

const vm = require('vm');
const fs = require('fs-extra');
const Module = require('module');
const path = require('path');
const { execSync } = require('child_process');
const globby = require('globby');

const serverlessFolder = '.serverless'

class NxWorkspaceBuilder {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    const nx = (this.serverless.variables.service.custom && this.serverless.variables.service.custom.nx) ? this.serverless.variables.service.custom.nx : {};
    this.config =  {
      workspacePath: './',
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
      'before:package:createDeploymentArtifacts': () => {
        console.log(this.serverless);
        return this.buildApp(this.serverless.service.service);
      },
      'after:package:createDeploymentArtifacts': () => (this.cleanup(this.serverless.service.service)),
      'before:welcome:hello': this.beforeWelcome.bind(this),
      'welcome:hello': this.welcomeUser.bind(this),
      'welcome:world': this.displayHelloMessage.bind(this),
      'after:welcome:world': this.afterHelloWorld.bind(this),
    };
  }

  get functions() {
    return this.options.function
      ? { [this.options.function] : this.serverless.service.functions[this.options.function] }
      : this.serverless.service.functions
  }

  get distFolder() {
    return path.join(this.config.workspacePath, 'dist', 'apps');
  }

  runCommand(hookScript) {
    console.log(`Running command: ${hookScript}`);
    return execSync(hookScript, { stdio: [this.stdin, this.stdout, this.stderr] });
  }

  buildApp(appName) {
    if (!this.originalServicePath) {
      // Save original service path and functions
      this.originalServicePath = this.serverless.config.servicePath
      // Fake service path so that serverless will know what to zip
      this.serverless.config.servicePath = path.join(this.distFolder, appName);
    }
    console.log(this.distFolder);
    this.runCommand(` (cd ${this.config.workspacePath} && nx build ${appName})`);
    const files = globby.sync(path.join(this.distFolder, appName));
    console.log(files);
    return files;
  }

  async copyExtras(appName) {
    const buildFolder = path.join(this.distFolder, appName);
    // include any "extras" from the "include" section
    if (this.serverless.service.package.include && this.serverless.service.package.include.length > 0) {
      const files = await globby(this.serverless.service.package.include)

      for (const filename of files) {
        const destFileName = path.resolve(path.join(buildFolder, filename))
        const dirname = path.dirname(destFileName)

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

    // if (this.options.function) {
    //   const fn = this.serverless.service.functions[this.options.function]
    //   const basename = path.basename(fn.package.artifact)
    //   fn.package.artifact =  path.join(
    //     this.originalServicePath,
    //     serverlessFolder,
    //     path.basename(fn.package.artifact)
    //   );
    //   return;
    // }

    // if (this.serverless.service.package.individually) {
    //   const functionNames = this.serverless.service.getAllFunctions()
    //   functionNames.forEach(name => {
    //     this.serverless.service.functions[name].package.artifact = path.join(
    //       this.originalServicePath,
    //       serverlessFolder,
    //       path.basename(this.serverless.service.functions[name].package.artifact)
    //     )
    //   });
    //   return;
    // }

    this.serverless.service.package.artifact = path.join(
      this.originalServicePath,
      serverlessFolder,
      path.basename(this.serverless.service.package.artifact)
    );
    console.log(this.serverless.service.package.artifact);
  }

  beforeWelcome() {
    this.serverless.cli.log('Hello from Serverless!');
  }

  welcomeUser() {
    this.serverless.cli.log('Your message:');
  }

  displayHelloMessage() {
    this.serverless.cli.log(`${this.options.message}`);
  }

  afterHelloWorld() {
    this.serverless.cli.log('Please come again!');
  }

  async cleanup(appName) {
    await this.moveArtifacts(appName)
    // Restore service path
    this.serverless.config.servicePath = this.originalServicePath
    // Remove temp build folder
    // fs.removeSync(path.join(this.originalServicePath, buildFolder))
  }
}

module.exports = NxWorkspaceBuilder;
