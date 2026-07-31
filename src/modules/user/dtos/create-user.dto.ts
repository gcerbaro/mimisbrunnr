import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength } from "class-validator";

export class UserCreateDTO{
    @ApiProperty({example: "john doe",})
    name: string;

    @ApiProperty({example: "johndoe@email.com"})
    @IsEmail()
    email: string;

    @ApiProperty({example:"abCD34f@"})
    @MaxLength(256)
    password: string;
    
    @ApiProperty({example: "1990-02-23"})
    birthday: Date;
}

