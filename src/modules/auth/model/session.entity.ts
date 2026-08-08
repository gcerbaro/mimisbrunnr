import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
export class Session {
    @PrimaryColumn('varchar', { length: 255 })
    id = ''
    @Index()
    @Column({type: 'date'})
    expiresAt: Date;
    @DeleteDateColumn()
    revokedAt: Date;
    @Column('text')
    json: string;
}