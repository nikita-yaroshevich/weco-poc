import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {environment} from "../environments/environment";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as loadORMConfig from '../ormconfig';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [() => (environment)],
        }),
        TypeOrmModule.forRootAsync({ useFactory: () => loadORMConfig }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
