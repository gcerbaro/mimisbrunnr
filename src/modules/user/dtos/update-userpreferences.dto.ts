import { PartialType } from "@nestjs/swagger";
import { Theme } from "../model/userpreferences.entity";
import { IsOptional } from "class-validator";

export class UpdateUserPreferencesDTO{
    @IsOptional()
    theme: Theme;
    //language: string;
    @IsOptional()
    default_volume: number;
}