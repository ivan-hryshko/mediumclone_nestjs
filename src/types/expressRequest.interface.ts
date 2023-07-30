import { UserEntity } from "@app/user/user.entity";
import { Request } from "express";

export class ExpressRequest extends Request {
  user?: UserEntity
  headers: HeadersWithToken;
}

export class HeadersWithToken extends Headers {
  authorization?: string
}
