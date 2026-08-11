import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, tap } from "rxjs";
import { Config } from "../../constants/config";
import {CsrfUpdate} from './csrf.decorator';
import { Request, Response } from "express";

@Injectable()
export class CsrfInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<unknown> {
        return next.handle().pipe(
            tap(() => {
                const http = context.switchToHttp();
                const req = http.getRequest<Request>();
                const res = http.getResponse<Response>();
                const shouldUpdate = this.reflector.getAllAndOverride(CsrfUpdate,[
                    context.getHandler(),
                    context.getClass()
                ]);

                if(shouldUpdate){
                    const csrfToken = req.csrfToken(true);
                    res.header(Config.csrf.headerName, csrfToken);
                }
            }),
        );
    }
}