import { Module, Session } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionMiddleware } from "./session.middleware";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";

@Module({
    imports:[TypeOrmModule.forFeature([Session]), UserModule],
    controllers:[AuthController],
    providers:[
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        AuthService,
        SessionMiddleware,
    ],
    exports: [AuthService, SessionMiddleware],
})

export class AuthModule{}