import { Module } from '@nestjs/common';
import {OrganizationService, UserService,} from "./services";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrganizationEntity, UserEntity} from "./entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, OrganizationEntity])],
    providers: [UserService, OrganizationService],
    exports: [UserService, OrganizationService]
})
export class CoreModule {}
