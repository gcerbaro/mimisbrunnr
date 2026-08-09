import { Injectable } from "@nestjs/common";
import { UserLoginDto } from "./dtos/user-login.dto";
import { UserService } from "../user/user.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { User } from "../user/model/user.entity";
import { Config } from "../../constants/config";
import { Request, Response } from 'express';
import { IS_PROD } from "../../constants/env";
import { ISessionEvent, SessionEvents } from "../../events/session";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    async login(
        req: Request,
        res: Response,
        { email, password }: UserLoginDto,
    ): Promise<User> {
        const user = await this.userService.login(email, password);

        req.session.userId = user.id;
        req.session.loginDate = new Date();

        return user;
    }

    logout(req: Request, res: Response): Promise<void> {
        const { session } = req;
        const {
            cookie: { ...cookieOpts },
        } = session;

        return new Promise<void>((resolve, reject) => {
            session.regenerate((err: Error) => {
                if (err) {
                    return reject(err);
                }
                res.clearCookie(Config.cookies.userId.name, { path: cookieOpts.path });
                resolve();
            });
        }).finally(() => {
            this.eventEmitter.emit(SessionEvents.LOGOUT, {
                sessionId: session.id,
            } satisfies ISessionEvent<SessionEvents.LOGOUT>);
        });
    }
}