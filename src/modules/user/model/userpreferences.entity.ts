import { Entity } from "typeorm";
import { CoreEntity } from "../../core.entity";

export enum Theme{
    DARK="dark",
    LIGHT="light",
}

@Entity()
export class UserPreferences extends CoreEntity{
    theme: Theme;
    //language: string;
    dafault_volume: number;
    userId: string;
}