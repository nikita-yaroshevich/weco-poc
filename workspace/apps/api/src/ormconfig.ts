import {appEntities} from './app/app.entities';
import {typeORMConfigLoader} from "../../../libs/common/src/lib/helpers";
import {environment} from "./environments/environment";

async function loadORMConfig() {
    const envCfg = await typeORMConfigLoader({
        baseConfig: environment.database,
        entities: appEntities,
        isProd: environment.production,
        srcDir: environment.srcDir || __dirname
    });
    console.log(`TypeOrm Configuration: ${JSON.stringify(envCfg)}`);
    return envCfg;
}

module.exports = loadORMConfig();

