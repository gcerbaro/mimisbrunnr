import { Config } from '../../constants/config';
import { COOKIE_SECRET, IS_PROD } from '../../constants/env';
import {NextFunction, Request, RequestHandler, Response} from 'express';
import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {Session} from './model/session.entity';
import type { Repository } from "typeorm";
import session from 'express-session';
import ms from 'ms';
import { TypeOrmStore } from '../../utils/typeormstore/typeormstore';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly session: RequestHandler;
  constructor(
    @InjectRepository(Session) sessionRepository: Repository<Session>,
  ) {
    this.session = session({
      secret: COOKIE_SECRET,
      name: Config.cookies.session.name,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: ms('1d'),
        httpOnly: true,
        sameSite: 'lax',
        secure: IS_PROD,
        signed: true,
      },
      store: new TypeOrmStore({ repository: sessionRepository }),
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    return this.session(req, res, next);
  }
}