import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction , Request, Response} from "express";
import { updateCsrfToken } from "./csrf.utils";

@Injectable()
export class CsrfMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction){
        req.csrfToken = (overwrite: boolean = false) =>{
            if(!overwrite && req.session.csrfToken){
                return req.session.csrfToken;
            }

            return updateCsrfToken(req);
        };

        next();
    }
}

declare module 'express'{
    export interface Request{
        csrfToken: (overwrite?: boolean)=>string;
    }
}