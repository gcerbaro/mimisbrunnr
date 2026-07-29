import { BaseEntity, CreateDateColumn, DeleteDateColumn,
        PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { Exclude } from "class-transformer";

export abstract class CoreEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn()
    deletedAt: Date | null;
}