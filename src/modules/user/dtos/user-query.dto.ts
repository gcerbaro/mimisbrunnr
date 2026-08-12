import { IsEnum, IsOptional, MaxLength } from "class-validator";
import { Role } from "../model/user.entity";
import { PaginatedQueryDto } from "../../../utils/pagination/paginated-query.dto";

export class UserQueryDTO extends PaginatedQueryDto{
    @MaxLength(100)
    @IsOptional()
    name?:string;

    @IsEnum(Role)
    @IsOptional()
    role: Role;
}