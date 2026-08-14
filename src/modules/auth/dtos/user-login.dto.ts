import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UserLoginDTO {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: "johndoe@email.com"
    })
    email: string;

    @IsNotEmpty()
    @MaxLength(256)
    @IsString()
    @ApiProperty({
        example: "abCD34f@"
    })
    password: string;
}