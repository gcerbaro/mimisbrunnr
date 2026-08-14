import { Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { LogService } from "./log.service";
import { LogCreateDTO } from "./dtos/log-create.dto";
import { Authorize } from "../auth/auth.decorator";
import { Role } from "../user/model/user.entity";

@Controller('/logs')
//@Authorize(Role.ADMIN)
export class LogController{
    constructor(private readonly logService: LogService){}

    @Get()
    @HttpCode(200)
    async getAll(){
        return this.logService.getAll();
    } 

    @Get(':id')
    @HttpCode(200)
    async getOne(@Param('id', ParseUUIDPipe) id: string){
        return this.logService.getOne(id);
    }

    @Post()
    @HttpCode(201)
    async create(dto: LogCreateDTO){
        return this.logService.create(dto);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id', ParseUUIDPipe) id: string){
        return this.logService.delete(id)
    }

}