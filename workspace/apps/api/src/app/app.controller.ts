import {Controller, Get, Inject, Req} from '@nestjs/common';

import { AppService } from './app.service';
import {ConfigService} from "@nestjs/config";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject('config') private config:ConfigService) {}

  @Get('test')
  getData(@Req() request) {
    return {...this.appService.getData(), env: this.config, e2: process.env, request: request.apiGateway};
  }
}
