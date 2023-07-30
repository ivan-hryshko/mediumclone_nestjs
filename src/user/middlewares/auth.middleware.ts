import { JWT_SECRET } from "@app/config";
import { ExpressRequest } from "@app/types/expressRequest.interface";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserService } from "../user.service";

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    console.log('authMiddleware', req.headers)
    if (!req.headers.authorization) {
      req.user = null
      next()
      return
    }

    const token = req.headers.authorization.split(' ')[1]
    console.log('token :>> ', token);

    try {
      const decode = verify(token, JWT_SECRET)
      const user = await this.userService.findById(decode.id)
      req.user = user
      next()
    } catch (error) {
      req.user = null
      next()
      return
    }
  }
}