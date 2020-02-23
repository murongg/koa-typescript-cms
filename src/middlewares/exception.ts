/*
 * @Author: MuRong
 * @Date: 2020-02-18 14:57:57
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-20 13:22:11
 * @Description: 全局异常处理
 * @FilePath: \koa-ts-cms\src\middlewares\exception.ts
 */
import { BaseContext, Next } from "koa";
import { HttpException, Exception } from "../core/exception";
interface CatchError extends Exception {
  request?: string;
}
const catchError = async (ctx: BaseContext, next: Next) => {
  try {
    await next();
  } catch (error) {
    const isHttpException = error instanceof HttpException
    const isDev = global.config?.environment === "dev"
    if (isDev && !isHttpException) {
      throw error;  
    }
    if (isHttpException) {
      const errorObj: CatchError = {
        msg: error.msg,
        errorCode: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      };
      ctx.body = errorObj;
      ctx.status = error.code;
    } else {
      const errorOjb: CatchError = {
        msg: "出现异常",
        errorCode: 999,
        request: `${ctx.method} ${ctx.path}`
      };
      ctx.body = errorOjb;
      ctx.status = 500;
    }
  }
};

export default catchError;
