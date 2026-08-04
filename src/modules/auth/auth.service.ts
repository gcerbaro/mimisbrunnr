import { Injectable } from "@nestjs/common";
import { UserLoginDto } from "./dtos/user-login.dto";
import { UserService } from "../user/user.service";
import { EventEmitter } from "stream";
import { User } from "../user/model/user.entity";
import { Config } from "../../constants/config";
import { Request, Response } from 'express';
import { IS_PROD } from "../../constants/env";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
        private readonly eventEmitter: EventEmitter
    ) { }

    async login(
        req: Request,
        res: Response,
        { email, password }: UserLoginDto,
    ): Promise<User> {
        const { session } = req;
        const { cookie } = session;

        const user = await this.userService.login(email, password);
        session.userId = user.id;
        session.loginDate = new Date();

        res.cookie(Config.cookies.userId.name, user.id, {
            path: cookie.path,
            domain: cookie.domain,
            expires: cookie.expires ?? undefined,
            signed: cookie.signed,
            sameSite: cookie.sameSite,
            maxAge: cookie.maxAge,
            secure: IS_PROD,
            //must be accessible to the client-side for frontend authentication
            httpOnly: false,
        });

        return user;
    }

    async logout(req: Request, res: Response) {
        return;
    }
}