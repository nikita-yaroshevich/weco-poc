import { Controller } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import {UserEntity, UserService} from "@weco/core-module";
import {UserDTO} from "../DTO/UserDTO";


@Crud({
    model: {
        type: UserDTO,
    },
})
@Controller("users")
export class UsersController implements CrudController<UserEntity> {
    constructor(public service: UserService) {}
}
