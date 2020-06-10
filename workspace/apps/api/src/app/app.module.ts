import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {environment} from "../environments/environment";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [()=>(environment)],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
