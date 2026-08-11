import { IsDate, IsEnum, IsIP, IsNotEmpty, IsObject, IsOptional, IsUUID } from "class-validator";
import { LogAction, LogLevel, LogTarget } from "../models/log.entity";
import { Type } from "class-transformer";

export class LogCreateDTO{
    @IsUUID('4')
    actorId: string;

    @IsEnum(LogAction)
    @IsNotEmpty()
    action: LogAction;

    @IsEnum(LogTarget)
    @IsNotEmpty()
    target: LogTarget;

    @IsUUID('4')
    targetId: string;

    @Type(()=>Date)
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
}