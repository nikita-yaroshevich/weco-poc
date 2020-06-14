import {Exclude, Expose} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

@Exclude()
export class OrganizationDTO {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()

    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @Expose()
    type?: string;
}
