import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Config } from "../../constants/config";
import { Observable } from "rxjs";
import { CsrfIgnore } from "./csrf.decorator";
import { CsrfError } from "./errors/csrf.error";

const IGNORED_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

@Injectable()
export class CsrfGuard implements CanActivate {
    private readonly logger = new Logger(CsrfGuard.name);

    constructor(private readonly reflector: Reflector) { }

    isRequestValid(req: Request, ignore: boolean): boolean {
        if (ignore === true ||
            (IGNORED_METHODS.has(req.method) ?? ignore !== false)
        ) {
            return true;
        }

        const headerToken = req.headers[Config.csrf.headerName];
        const sessionToken = req.session.csrfToken;

        if (typeof headerToken === 'string' && headerToken === sessionToken) {
            return true;
        }
        return false;
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const ignore = this.reflector.getAllAndOverride(CsrfIgnore, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (this.isRequestValid(req, ignore)) {
            return true;
        }

        this.logger.warn(`CSRF validation failed for ${req.method} ${req.url} of user session ${req.session?.id}`);
        throw new CsrfError;
    }
}