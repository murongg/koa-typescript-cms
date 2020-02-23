/*
 * @Author: MuRong
 * @Date: 2020-02-21 21:02:50
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-23 10:56:10
 * @Description: 微信小程序功能类
 * @FilePath: \koa-ts-cms\src\app\service\wx.ts
 */
import util from "util";
import axios from "axios";
import { AuthFailed } from "../../core/exception";
import UsersService from "./users";
import { generateToken } from "../../core/utils";
import { AuthType } from "../../middlewares/auth";
export class WXService {
  static async codeToToken(code: string) {
    const AppID = global.config?.wx.AppID;
    const AppSecret = global.config?.wx.AppSecret;
    const url = util.format(global.config?.wx.LoginUrl, AppID, AppSecret, code);
    const result = await axios.get(url);
    if (result.status !== 200) {
      throw new AuthFailed({ msg: "openid获取失败" });
    }
    const data = result.data;
    if (data.errcode) {
      throw new AuthFailed({ msg: result.data.errmsg });
    }
    const openid = data.openid;
    let user = await UsersService.getUserByOpenid(openid);
    if (!user) {
      user = await UsersService.registerByOpenid(openid);
    }

    return generateToken(user.id, AuthType.USER);
  }
}
