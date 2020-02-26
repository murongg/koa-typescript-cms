/*
 * @Author: MuRong
 * @Date: 2020-02-19 11:10:17
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-26 19:21:15
 * @Description: 校验器
 * @FilePath: \koa-typescript-cms\src\app\validators\UsersValidator.ts
 */
import {
  Length,
  IsEmail,
  Matches,
  Validate,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments
} from "class-validator";

import { Validator } from "../../core/validator";

/**
 * 验证密码自定义装饰器
 *
 * @class CheckPassword
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint()
class CheckPassword implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments): boolean {
    const obj: any = args.object;
    return obj.password1 === obj.password2;
  }
  defaultMessage() {
    return "两次输入密码不一致";
  }
}

/**
 * 注册验证类
 *
 * @export
 * @class RegistorValidator
 * @extends {Validator}
 */
export class RegistorValidator extends Validator {
  constructor() {
    super();
  }
  @Length(3, 10, {
    message: "用户名长度为3~10个字符"
  })
  nickname?: string;
  @IsEmail({},{ message: "电子邮箱格式错误" })
  email?: string;
  @Validate(CheckPassword)
  // 至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符：
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/, {
    message: "密码至少8-16个字符，至少1个大写字母，1个小写字母和1个数字"
  })
  password1?: string;
  password2?: string;
}
