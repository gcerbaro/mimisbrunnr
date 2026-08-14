import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum LogLevel{
    INFO="INFO", WARNING="WARNING", ERROR="ERROR",
}

export enum LogAction{
    LOGIN="LOGIN", LOGOUT="LOGOUT", LOGIN_FAILED="LOGIN_FAILED",

    PLAY_MEDIA="PLAY_MEDIA", DOWNLOAD_MEDIA="DOWNLOAD_MEDIA",

    CREATE_ENTRY="CREATE_ENTRY", UPDATE_ENTRY="UPDATE_ENTRY",

    CREATE_USER="CREATE_USER", UPDATE_USER="UPDATE_USER",

    DELETE_USER="DELETE_USER", ACTIVATE_USER="ACTIVATE_USER",

    DEACTIVATE_USER="DEACTIVATE_USER", REACTIVATE_USER="REACTIVATE_USER",

    DELETE_ENTRY="DELETE_ENTRY", PERMISSION_DENIED="PERMISSION_DENIED",
    
    STREAM_FAILED="STREAM_FAILED", RATE_LIMIT_HIT="RATE_LIMIT_HIT"
}

export enum LogTarget{
    USER="USER", ENTRY="ENTRY", SESSION="SESSION", FILE="FILE"
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
        type:'varchar',
        length:255,
        nullable: false
    })
    actorName: string;
    
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