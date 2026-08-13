import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Log } from "./models/log.entity";
import { LogTasksService } from "./log-tasks.service";
import { LogService } from "./log.service";
import { LogController } from "./log.controller";

@Module({
    imports:[TypeOrmModule.forFeature([Log])],
    controllers:[LogController],
    providers:[LogService, LogTasksService],
    exports:[LogService]
})

export class LogModule{}