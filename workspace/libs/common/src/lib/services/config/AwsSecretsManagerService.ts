import { SecretsManager } from 'aws-sdk';
import { Services } from '@idexx/common';

export class AwsSecretsManagerService {
    private static instance:AwsSecretsManagerService;
    secretsManager: SecretsManager;

    static getInstance(config?: Services.ConfigServiceInterface, pathPrefix = 'AWS_CONSTANTS'): AwsSecretsManagerService {
        if (!AwsSecretsManagerService.instance && config) {
            AwsSecretsManagerService.instance = new AwsSecretsManagerService(config, pathPrefix);
        }
        return AwsSecretsManagerService.instance;
    }

    private constructor(private readonly config: Services.ConfigServiceInterface, private readonly pathPrefix = 'AWS_CONSTANTS') {
        this.secretsManager = new SecretsManager({ region: config.get(`${pathPrefix}.SECRETS_REGION`, 'us-east-1') });
    }

    get(path: string): Promise<any> {
        return this.getSecretValue(this.config.get(`${this.pathPrefix}.${path}`, path));
    }

    set(path: string, value: any): Promise<any> {
        const secretId = this.config.get(`${this.pathPrefix}.${path}`, path);
        return this.setSecretValue(secretId, value).catch(() => {
            return this.createSecret(secretId, value);
        });
    }

    remove(path: string): Promise<any> {
        return this.deleteSecret(this.config.get(`${this.pathPrefix}.${path}`, path));
    }

    getSecretValue(secretId: string) {
        return new Promise((resolve, reject) => {
            const params = {
                SecretId: secretId
            };
            this.secretsManager.getSecretValue(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    setSecretValue(secretId: string, value: any) {
        return new Promise((resolve, reject) => {
            const params = {
                SecretId: secretId,
                SecretString: JSON.stringify(value)
            };
            this.secretsManager.putSecretValue(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    createSecret(secretId: string, value: any) {
        return new Promise((resolve, reject) => {
            const params = {
                Name: secretId,
                SecretString: JSON.stringify(value)
            };
            this.secretsManager.createSecret(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    deleteSecret(secretId: string) {
        return new Promise((resolve, reject) => {
            const params = {
                SecretId: secretId
            };
            this.secretsManager.deleteSecret(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}
