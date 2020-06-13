// import { config, awsConfig } from './config';
// import { appEntities } from './app/app.entities';
// // import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
//
// async function loadORMConfig() {
//     const envCfg = {
//         ...config.get('postgres_db'),
//         ...{
//             entities: appEntities
//         }
//     };
//
//     const dbExportKeys = [
//         { envKey: 'host', secretKey: 'rds/postgres/host' },
//         { envKey: 'port', secretKey: 'rds/postgres/port' },
//         { envKey: 'username', secretKey: 'rds/postgres/username' },
//         { envKey: 'password', secretKey: 'rds/postgres/password' },
//         { envKey: 'database', secretKey: 'rds/postgres/dbname' }
//     ];
//
//     await Promise.all(
//         dbExportKeys.map(key => {
//             if (!envCfg[key.envKey]) {
//                 const loadKeyName = `${process.env._environment}/${key.secretKey}`;
//                 console.log(`TypeORMConfig: Loading ${key.envKey} from ${loadKeyName}`);
//                 return awsConfig
//                     .get(loadKeyName)
//                     .then(value => {
//                         envCfg[key.envKey] = value;
//                         return envCfg;
//                     })
//                     .catch(e => {
//                         console.log(`TypeORMConfig: Unable to load ${key.envKey} from ${loadKeyName} with ${e}`);
//                         return Promise.reject(e);
//                     });
//             }
//             return Promise.resolve(envCfg);
//         })
//     );
//
//     console.log(`TypeOrm Configuration: ${JSON.stringify(envCfg)}`);
//     return envCfg;
// }
//
// module.exports = loadORMConfig();

console.log(process.env);
