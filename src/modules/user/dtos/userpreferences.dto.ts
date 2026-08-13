import { IsEnum, IsNotEmpty, IsUUID, Max, Min } from "class-validator";
import { Theme } from "../model/userpreferences.entity";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../model/user.entity";

export class UserPreferencesDTO{
    @IsEnum(Theme)
    @IsNotEmpty()
    @ApiProperty({
        enum: Theme,
        default: Theme.LIGHT
    })
    theme: Theme;

    //language: string;

    @Min(0)
    @Max(100)
    @ApiProperty({
        example: 50,
        default: 50
    })
    default_volume: number;

    @IsNotEmpty()
    @IsUUID()
    userId: User['id'];
}