import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum LogLevel{
    INFO, WARNING, ERROR,
}

export enum LogAction{
    LOGIN, LOGOUT, LOGIN_FAILED, PLAY_MEDIA,
    DOWNLOAD_MEDIA, CREATE_ENTRY, UPDATE_ENTRY,
    CREATE_USER, UPDATE_USER, DELETE_USER,
    ACTIVATE_USER, DEACTIVATE_USER, REACTIVATE_USER,
    DELETE_ENTRY, PERMISSION_DENIED, STREAM_FAILED,
}

export enum LogTarget{
    USER, ENTRY, SESSION, FILE, 
}

@Entity()
export class Log{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    actorId?: string;
    
    @Column({
        type:'simple-enum',
        enum: LogAction,
    })
    action: LogAction;

    @Column({
        type: 'simple-enum',
        enum: LogTarget
    })
    targetType: LogTarget;

    @Column()
    targetId: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({
        type: 'simple-enum',
        enum: LogLevel
    })
    level: LogLevel;

    @Column({type: 'varchar', length: 45, nullable: true})
    ipAddress?: string;

    @Column({
        type: 'simple-json',
        nullable: true
    })
    metadata?: Record<string, unknown>;
}