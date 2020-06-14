import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import {OrganizationEntity} from "../entity";
import {Repository} from "typeorm";


@Injectable()
export class OrganizationService extends TypeOrmCrudService<OrganizationEntity> {
    constructor(@InjectRepository(OrganizationEntity) repo:Repository<OrganizationEntity>) {
        super(repo);
    }
}
