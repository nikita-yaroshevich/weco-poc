import {Controller, Get, Inject} from '@nestjs/common';

import { AppService } from './app.service';
import {ConfigService} from "@nestjs/config";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject('config') private config:ConfigService) {}

  @Get('test')
  getData() {
    return {...this.appService.getData(), env: this.config, e2: process.env};
  }
}
