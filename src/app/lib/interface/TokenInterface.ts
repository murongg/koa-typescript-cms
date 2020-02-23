import { LoginType } from '../enum';

/*
 * @Author: MuRong
 * @Date: 2020-02-21 09:16:17
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-21 09:37:33
 * @Description:
 * @FilePath: \koa-ts-cms\src\app\interface\TokenInterface.ts
 */

export interface tokenLoginInterface {
  account: string;
  secret: string;
  type: LoginType;
}
