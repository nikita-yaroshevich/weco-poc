import {ConnectionManager, getConnectionManager} from "typeorm";
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export async function typeORMConfigLoader({baseConfig, entities, isProd}): Promise<TypeOrmModuleOptions> {
    const connectionManager: ConnectionManager = getConnectionManager();
    let options: any;
    if (connectionManager.has('default')) {
        options = connectionManager.get('default').options;
        await connectionManager.get('default').close();
    } else {
        // todo: Here is a good place to add loading DB connection params from AWS SSM ParamStore
        options = {
            ...baseConfig,
            entities: entities,
            cache: isProd,
            // Allow both start:prod and start:dev to use migrations
            // __dirname is either dist or src folder, meaning either
            // the compiled js in prod or the ts in dev.
            migrations: [`./migrations/**/*{.ts,.js}`],
            cli: {
                // Location of migration should be inside src folder
                // to be compiled into dist/ folder.
                migrationsDir: `./migrations`
            }
        };
    }
    return options;
}
