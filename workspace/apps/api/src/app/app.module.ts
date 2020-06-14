import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {environment} from "../environments/environment";
import * as loadORMConfig from '../ormconfig';
import {SharedModule} from "@weco/shared-module";
import {CoreAPIModule} from "./http/core/core-api.module";

@Module({
    imports: [
        SharedModule.register({environment, loadORMConfig}),
        CoreAPIModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
