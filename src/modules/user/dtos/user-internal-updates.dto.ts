import { IsEnum } from "class-validator";
import { Role } from "../model/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserInternalUpdateDto {
  @IsEnum(Role)
  @ApiProperty({
    enum: Role,
  })
  role: Role;
}