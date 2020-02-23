/*
 * @Author: MuRong
 * @Date: 2020-02-21 09:02:40
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-21 21:48:54
 * @Description:
 * @FilePath: \koa-ts-cms\src\app\service\users.ts
 */
import Users from "../models/users";

import { Failed, AuthFailed } from "../../core/exception";
import { registerInterface } from "../lib/interface/UsersInterface";
import bcrypt from "bcryptjs";

class UsersService {
  static async userRegister(params: registerInterface) {
    const { email, nickname, password1 } = params;
    const data = {
      email,
      nickname,
      password: password1
    };
    const isExistEmail = await Users.findOne({
      where: {
        email
      }
    });
    if (isExistEmail) {
      throw new Failed({ msg: "Email已存在" });
    }
    const r = await Users.create(data);
    return r;
  }

  static async verifyEmailPassword(email: string, plainPassword: string) {
    const user = await Users.findOne({
      where: {
        email
      }
    });
    if (!user) {
      throw new AuthFailed({ msg: "用户不存在" });
    }
    const correct = bcrypt.compareSync(plainPassword, user.password);
    if (!correct) {
      throw new AuthFailed({ msg: "密码不正确" });
    }
    return user;
  }
  static async getUserByOpenid(openid: string) {
    const user = await Users.findOne({
      where: {
        openid
      }
    });
    return user
  }
  static async registerByOpenid(openid: string) {
    return Users.create({
      openid
    })
  }
}

export default UsersService;
