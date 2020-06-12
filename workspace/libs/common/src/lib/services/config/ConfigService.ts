import { InternalServerErrorException, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Path from 'path';
import * as ts from 'typescript';
import * as _ from 'lodash';
import { ConfigServiceInterface } from './ConfigServiceInterface';

export class ConfigService implements ConfigServiceInterface {
    private static envConfig: { [key: string]: string };
    private static instance: ConfigService;

    /**
     *
     * @param {{dotenvPath: string; configDir?: string}} options
     */
    static getInstance(options?: { dotenvPath: string; configDir?: string; defaultConfig?: any }): ConfigService {
        if (!ConfigService.instance && options) {
            ConfigService.instance = new ConfigService(options);
        }
        return ConfigService.instance;
    }

    private constructor(options: { dotenvPath: string; configDir?: string; defaultConfig?: any }) {
        const dotEnvPath = options.dotenvPath.toLowerCase();
        const config = {
            ...(options.defaultConfig || {}),
            ...dotenv.parse(fs.readFileSync(dotEnvPath)),
            ...process.env,
            ...{ APP_ENV: process.env._environment || 'local' }
        };
        if (options.configDir && fs.existsSync(options.configDir)) {
            fs.readdirSync(options.configDir)
                .filter(item => {
                    return fs.statSync(Path.join(options.configDir, item)).isFile() && Path.extname(item) === '.ts';
                })
                .sort()
                .forEach(cfgName => {
                    Logger.log(`parsing config file ${cfgName}`, 'ConfigService');
                    const result = {};
                    const content = fs.readFileSync(`${options.configDir}/${cfgName}`).toString();
                    const exec = new Function('env', 'exports', ts.transpile(content, { module: ts.ModuleKind.CommonJS }));
                    try {
                        exec(config, result);
                    } catch (e) {
                        Logger.error(`failed to parse config file: ${e}`, 'ConfigService');
                        throw new InternalServerErrorException(`Unable to parse "${cfgName}" config file`, e.toString());
                    }
                    Object.keys(result)
                        .filter(key => key !== '__esModule')
                        .forEach(key => {
                            config[key] = result[key];
                        });
                });
        }
        ConfigService.envConfig = config;
    }

    /**
     *
     * @param {string} path Can be Path in form "field.items[0].name"
     * @param defaultValue
     * @return {any|null}
     */
    static get(path: string, defaultValue: any = null): any {
        return _.get(this.envConfig, path, defaultValue);
    }

    static has(path: string): boolean {
        return _.has(this.envConfig, path);
    }

    static getAll(): { [key: string]: string } {
        return this.envConfig;
    }

    static set(path: string, value: any, override = false): boolean {
        return override || !this.has(path) ? !!_.set(this.envConfig, path, value) : false;
    }

    /**
     *
     * @param {string} path Can be Path in form "field.items[0].name"
     * @param defaultValue
     * @return {any|null}
     */
    get(path: string, defaultValue: any = null): any {
        return ConfigService.get(path, defaultValue);
    }

    has(path: string): boolean {
        return ConfigService.has(path);
    }

    getAll(): { [key: string]: string } {
        return ConfigService.getAll();
    }

    set(path: string, value: any, override = false): boolean {
        return ConfigService.set(path, value, override);
    }
}
