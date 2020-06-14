import { Controller } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import {OrganizationEntity, OrganizationService} from "@weco/core-module";
import {OrganizationDTO} from "../DTO/OrganizationDTO";


@Crud({
    model: {
        type: OrganizationDTO,
    },
})
@Controller("organizations")
export class OrganizationsController implements CrudController<OrganizationEntity> {
    constructor(public service: OrganizationService) {}
}
