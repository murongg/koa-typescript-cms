/*
 * @Author: MuRong
 * @Date: 2020-02-19 13:57:10
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-26 18:46:58
 * @Description: User Model
 * @FilePath: \koa-typescript-cms\src\app\models\users.ts
 */
import bcrypt from "bcryptjs";
import { sequelize } from "../../core/db";
import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  Comment,
} from "sequelize-typescript";
@Table
class Users extends Model<Users> {
  @PrimaryKey
  @AutoIncrement
  @Comment("ID")
  @Column(DataType.INTEGER)
  id?: number;

  @Comment("用户昵称")
  @Column(DataType.STRING(128))
  nickname?: string;

  @Unique
  @Comment("用户邮箱")
  @Column(DataType.STRING(128))
  email?: string;

  @Comment("用户密码")
  @Column(DataType.STRING(64))
  // set(that: Users, value: string)  {
  //   const salt = bcrypt.genSaltSync(10);
  //   const psw = bcrypt.hashSync(value, salt);
  //   this.setDataValue(psw)
  //   // console.log(psw)
  // }
  public get password(): string {
    return this.getDataValue("password");
  }
  public set password(val) {
    const salt = bcrypt.genSaltSync(10);
    const psw = bcrypt.hashSync(val, salt);
    this.setDataValue("password", psw);
  }
  // password: string;

  @Unique
  @Comment("微信小程序openid")
  @Column(DataType.STRING(128))
  openid?: string;
}

sequelize.addModels([Users]);

export default Users;
