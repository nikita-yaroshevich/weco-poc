import database from '../config/database';
import * as path from "path";

export const environment = {
    ENV: process.env.APP_ENV || 'dev',
    isLocal: !!process.env.IS_LOCAL,
    production: ['prod', 'production', 'stage'].indexOf(process.env.APP_ENV || 'dev') >= 0,
    srcDir: path.resolve(__dirname, '..'),
    database
};
