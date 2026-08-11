import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { CsrfController } from "./csrf.controller";
import { CsrfGuard } from "./csrf.guard";
import { CsrfInterceptor } from "./csrf.interceptor";
import { CsrfMiddleware } from "./csrf.middleware";

@Module({
    controllers:[CsrfController],
    providers:[
        {
            provide:APP_GUARD,
            useClass: CsrfGuard,
        }, 
        {
            provide: APP_INTERCEPTOR,
            useClass: CsrfInterceptor
        },
    ],
})

export class CstfModule implements NestModule{
    configure(consumer: MiddlewareConsumer){
        consumer.apply(CsrfMiddleware).forRoutes("*");
    }
}

declare module 'express-session'{
    interface SessionData{
        csrfToken?:string;
    }
}