import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Log } from "./models/log.entity";
import { LessThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LogTasksService{
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>
    ){}

    RETENTION_DAYS = 180; //deletes logs older than six months
    private logger = new Logger(LogTasksService.name);

    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    async deleteOldLogs(){
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - this.RETENTION_DAYS);

        this.logger.log('Deleting old logs...');
        const result = await this.logRepository.delete({
                timestamp: LessThan(cutoff),
        })
        
        this.logger.log(`Deleted ${result.affected ?? 0} old log(s).`)
    }
}