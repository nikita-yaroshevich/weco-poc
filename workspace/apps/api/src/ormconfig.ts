import {appEntities} from './app/app.entities';
import {environment} from "./environments/environment";
import {Helpers} from "@weco/common";

async function loadORMConfig() {
    return await Helpers.typeORMConfigLoader({
        baseConfig: environment.database,
        entities: appEntities,
        isProd: environment.production
    });
}

module.exports = loadORMConfig();

