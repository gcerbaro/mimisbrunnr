import { Column, Entity } from "typeorm";
import { CoreEntity } from "../../core.entity";

export enum Theme{
    DARK="dark",
    LIGHT="light",
}

export enum Language{
    EN="en-US",
    PT="pt-BR",
    //ES="es",
    //FR="fr",
    //IT="it",
    //DE="de",
    //VEC="vec"
}

@Entity()
export class UserPreferences extends CoreEntity{
    @Column({
        type:'simple-enum',
        enum: Theme,
        default: Theme.LIGHT 
    })
    theme: Theme;

    @Column({
        type:'simple-enum',
        enum:Language,
        default: Language.EN
    })
    language: Language;

    @Column({
        type:'integer',
    })
    default_volume: number;

    @Column({
        type: 'text',
    })
    userId: string;
}