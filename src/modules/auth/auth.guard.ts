import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service";
import { User } from "../user/model/user.entity";
import { Authenticate, Authorize } from "./auth.decorator";
import { Request, Response } from "express";
import { isAuthorized } from "../../utils/authorization";

@Injectable()
export class AuthGuard implements CanActivate{
    private logger = new Logger(AuthGuard.name);

    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService
    ){}

    async authenticate(context: ExecutionContext, req: Request, res: Response){
        const isEnabled = this.reflector.getAllAndOverride(Authenticate,[
            context.getHandler(),
            context.getClass(),
        ]);

        if(isEnabled === false){
            return true;
        }

        //Session is authenticated
        if(req.session?.userId){
            let user = req.auth?.user ?? null;

            //Fetch logged user data and attach it to the request
            if(!user){
                user = await User.findOne({
                    where:{
                        id: req.session.userId,
                    },
                });

                if(user){
                    req.auth = {
                        user,
                    };
                    return true;
                }

                // Logged user doesn't exist, so the session is invalid
                this.logger.warn(`Invalid session for user ${req.session.userId}`);
                await this.authService.logout(req, res);
            }
        }

        return false;
    }

    authorize(context: ExecutionContext, req: Request){
        const roles = 
            this.reflector.getAllAndMerge(Authorize,[
                context.getHandler(),
                context.getClass(),
            ]) ?? [];

        if(!roles.length){ 
            return true;
        }

        if(!req.auth?.user){
            return false;
        }

        return isAuthorized(req.auth.user, roles);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp();
        const req =http.getRequest<Request>();
        const res = http.getResponse<Response>();

        if(await this.authenticate(context, req, res)){
            if(this.authorize(context, req)){
                return true;
            }
            this.logger.warn(
                `Blocked access to ${req.method} ${req.path} due to insufficient permissions`,
                {
                    session:{
                        id: req.session.id,
                        userId: req.session.userId,
                    },
                },
            );
        }

        throw new UnauthorizedException();
    }
}