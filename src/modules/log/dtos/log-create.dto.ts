import { IsDate, IsEnum, IsIP, IsNotEmpty, IsObject, IsOptional, IsUUID } from "class-validator";
import { LogAction, LogLevel, LogTarget } from "../models/log.entity";
import { Type } from "class-transformer";

export class LogCreateDTO {
    @IsUUID('4')
    @IsOptional()
    actorId?: string;

    @IsNotEmpty()
    actorName: string;

    @IsEnum(LogAction)
    @IsNotEmpty()
    action: LogAction;

    @IsEnum(LogTarget)
    @IsNotEmpty()
    target: LogTarget;

    @IsUUID('4')
    targetId?: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    timestamp: Date;

    @IsEnum(LogLevel)
    @IsNotEmpty()
    level: LogLevel;

    @IsIP()
    @IsOptional()
    ip?: string;

    @IsObject()
    @IsOptional()
    metadata?: Record<string, unknown>;

    constructor(data: {
        actorName: string;
        action: LogAction;
        targetType: LogTarget;
        level: LogLevel;
        targetId?: string;
        actorId?: string;
        ipAddress?: string;
        metadata?: Record<string, unknown>;
    }) {
        Object.assign(this, data);
        this.timestamp = new Date();
    }

}