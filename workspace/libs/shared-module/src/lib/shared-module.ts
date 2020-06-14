import {DynamicModule, ForwardReference, Module, Provider, Type} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Services} from "@weco/common";

@Module({})
export class SharedModule {
    static register({environment, loadORMConfig}): DynamicModule {
        const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [];
        const providers: Provider[] = [];

        if (loadORMConfig) {
            imports.push(TypeOrmModule.forRootAsync({useFactory: () => loadORMConfig}),);
        }
        return {
            module: SharedModule,
            imports: [
                ...imports,
                ConfigModule.forRoot({
                    load: [() => (environment)],
                })
            ],
            providers: [
                ...providers,
                {
                    provide: 'config',
                    useFactory: config => (config),
                    inject: [ConfigService]
                },
                {
                    provide: 'cache',
                    useValue: new Services.CacheService()
                }
            ],
            exports: ['config', 'cache']
        };
    }
}
