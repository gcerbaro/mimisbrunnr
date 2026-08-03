import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm";
//import { User } from "../../user/model/user.entity";
import { IsIP } from "class-validator";

@Entity()
export class Session {
    @PrimaryColumn('varchar', { length: 255 })
    id = ''
    //user: User;
    @Index()
    @Column('bigint')
    expiresAt: Date;
    @DeleteDateColumn()
    revokedAt: Date;
    @IsIP()
    ip: string;
    @Column('text')
    json: '';
}