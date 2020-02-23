/*
 * @Author: MuRong
 * @Date: 2020-02-21 10:35:30
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-22 09:58:00
 * @Description: 权限中间件
 * @FilePath: \koa-ts-cms\src\middlewares\auth.ts
 */
import { Context, Next } from "koa";
import { Forbidden } from "../core/exception";
import jwt from "jsonwebtoken";
export enum AuthType {
  USER = 8,
  ADMIN = 16,
  SUPER_ADMIN = 32
}
export class Auth {
  static authType: AuthType;
  level: number;
  constructor(level?: number) {
    this.level = level || 1;
  }
  get m() {
    return async (ctx: Context, next: Next) => {
      const authorization = ctx.request.headers["authorization"];
      const userToken = authorization ? authorization.split(" ")[1] : undefined;
      // let decode: any = undefined;
      if (!userToken) {
        throw new Forbidden({ msg: "Token不合法" });
      }
      const secretKey = global.config?.security.secretKey
      try {
        var decode: any = await jwt.verify(userToken, (secretKey as string));
      } catch (error) {
        if (error.name == "TokenExpiredError") {
          throw new Forbidden({ msg: "Token已过期" });
        } else {
          throw new Forbidden({ msg: error.message });
        }
      }

      if (decode.scope < this.level) {
        throw new Forbidden({ msg: "权限不足" });
      }

      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      };
      await next();
    };
  }
  
  static async verifyToken(token) {
    const secretKey = global.config?.security.secretKey
    try {
      await jwt.verify(token, (secretKey as string));
      return true
    } catch (error) {
      return false
    }
  }
}
