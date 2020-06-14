import {Exclude, Expose, Transform, Type} from "class-transformer";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from "class-validator";
import {Transformers} from "@weco/common";
import {OrganizationDTO} from "./OrganizationDTO";

@Exclude()
export class UserDTO {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    username: string;

    @ApiPropertyOptional()
    @Expose()
    @Transform(value => (typeof value === 'string' ? value : new Transformers.ToTypeTransformer(OrganizationDTO).transform(value)))
    organization?: string | OrganizationDTO;

    @ApiProperty()
    @Expose()
    roles: string[] = [];

    @ApiProperty()
    @Expose()
    isActive: boolean;
}
