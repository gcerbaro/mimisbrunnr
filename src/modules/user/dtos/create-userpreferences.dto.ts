import { IsEnum, IsNotEmpty, Max, Min } from "class-validator";
import { Theme } from "../model/userpreferences.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserPreferencesDTO {
    @IsEnum(Theme)
    @IsNotEmpty()
    @ApiProperty({
        default: Theme.LIGHT
    })
    theme: Theme = Theme.LIGHT;

    @Min(0)
    @Max(100)
    @ApiProperty({
        example: 50,
        default: 50
    })
    default_volume: number = 50;
}