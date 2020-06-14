import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { OrganizationsController } from './controller/organizations.controller';
import {CoreModule} from "@weco/core-module";

@Module({
    imports: [CoreModule],
    controllers: [UsersController, OrganizationsController]
})
export class CoreAPIModule {}
