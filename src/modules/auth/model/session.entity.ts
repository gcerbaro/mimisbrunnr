import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm";
import { IsIP } from "class-validator";

@Entity()
export class Session {
    @PrimaryColumn('varchar', { length: 255 })
    id = ''
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