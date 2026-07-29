import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import { Request } from '@nestjs/common';
import { Role, User } from '../user/model/user.entity';
import { isArray } from 'class-validator';

/**
 * Enable/disable authentication for a specific route.
 */
export const Authenticate = Reflector.createDecorator<boolean>({
  key: 'auth:enabled',
  transform(value) {
    if (value === undefined) {
      return true;
    }
    return Boolean(value);
  },
});

export const Public = () => Authenticate(false);

export const Private = () => Authenticate(true);

export const Authorize = Reflector.createDecorator<
Role | Role[],
Role[]
>({
    key: 'auth:role',
    transform: (value) => (value? (Array.isArray(value)? value: [value]): []),
});


/* export const LoggedUser = createParamDecorator(
  (prop: keyof User | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.auth?.user ?? null;

    if (!user) {
      return null;
    }

    return prop ? user[prop] : user;
  },
); */