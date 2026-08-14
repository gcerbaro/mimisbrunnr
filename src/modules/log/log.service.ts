import { Injectable } from "@nestjs/common";
import { Log } from "./models/log.entity";
import { LogCreateDTO } from "./dtos/log-create.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class LogService{
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>
    ){}

    async getAll(): Promise<Log[]>{
        return this.logRepository.find();
    }

    async getOne(logId: Log['id']): Promise<Log>{
        return this.logRepository.findOneOrFail({
            where: {id: logId},
        });
    }

    async create(dto: LogCreateDTO,manager?: EntityManager): Promise<Log>{
        const log = this.logRepository.create(dto);
        if(manager){
            manager.save(log);
        }
        return this.logRepository.save(log);
    }

    async delete(logId: Log['id']): Promise<void>{
        const log = await this.logRepository.findOne({
            where: {id: logId},
        });
        
        await this.logRepository.delete({
            id: log?.id
        });
    }

}