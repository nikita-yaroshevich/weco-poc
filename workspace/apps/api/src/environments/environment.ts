import database from '../config/database';
import * as path from "path";

export const environment = {
    ENV: process.env.APP_ENV || 'dev',
    production: ['prod', 'production'].indexOf(process.env.APP_ENV || 'dev') === -1,
    srcDir: path.resolve(__dirname, '..'),
    database
};
