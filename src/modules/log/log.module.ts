import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Log } from "./models/log.entity";
import { LogTasksService } from "./log-tasks.service";
import { LogService } from "./log.service";

@Module({
    imports:[TypeOrmModule.forFeature([Log])],
    providers:[LogService, LogTasksService],
})

export class LogModule{}