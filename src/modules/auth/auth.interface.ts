import { User } from "../user/model/user.entity";

export interface AuthData {
  user: User;
}

declare module 'express' {
  interface Request {
    auth?: AuthData;
  }
}