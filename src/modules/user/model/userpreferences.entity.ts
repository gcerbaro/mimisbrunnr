import { Column, Entity } from "typeorm";
import { CoreEntity } from "../../core.entity";

export enum Theme{
    DARK="dark",
    LIGHT="light",
}

@Entity()
export class UserPreferences extends CoreEntity{
    @Column({
        type:'simple-enum',
        enum: Theme,
        default: Theme.LIGHT 
    })
    theme: Theme;
    //language: string;

    @Column({
        type:'integer',
    })
    default_volume: number;

    @Column({
        type: 'text',
    })
    userId: string;
}