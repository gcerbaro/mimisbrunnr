import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

/**
 * Generates a CSRF Token
 */
export const CsrfToken = createParamDecorator(
    (overwrite: boolean, ctx: ExecutionContext) => {
        const req= ctx.switchToHttp().getRequest<Request>();
        return req.csrfToken(overwrite);
    },
);

/**
 * Ignores CSRF Token validation
 */
export const CsrfIgnore = Reflector.createDecorator<boolean>({
    key: 'csrf:token',
    transform(value){
        if(value === undefined){
            return true;
        }
        return Boolean(value);
    },
});

/**
 * Updates the CSRF Token after a succesfull request
 */
export const CsrfUpdate = Reflector.createDecorator({
    key: 'csrf:update',
    transform(value){
        if(value === undefined){
            return true;
        }
        return Boolean(value);
    }
})