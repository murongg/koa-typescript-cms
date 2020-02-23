/*
 * @Author: MuRong
 * @Date: 2020-02-20 23:01:47
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-23 16:53:34
 * @Description:
 * @FilePath: \koa-ts-cms\src\app\validators\TokenValidator.ts
 */
import {
  Length,
  Validate,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
  MinLength
} from "class-validator";

import { Validator } from "../../core/validator";
import { LoginType } from "../lib/enum";

/**
 * secret自定义校验装饰器
 *
 * @export
 * @class CheckSecret
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint()
export class CheckSecret implements ValidatorConstraintInterface {
  // undefined , null , ""  , "    ", 皆通过
  validate(val: string): boolean {
    if (val === void 0) {
      return true;
    }
    if (val === null) {
      return true;
    }
    if (typeof val === "string") {
      if (val === "" || val.trim() === "") {
        return true;
      } else if (val.trim().length < 6) {
        return false;
      } else {
        return true
      }
    }
    return false;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property}不符合规范，至少6个字符`;
  }
}
/**
 * type自定义校验装饰器
 *
 * @export
 * @class CheckType
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint()
export class CheckType implements ValidatorConstraintInterface {
  validate(val: string): boolean {
    return val in LoginType;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property}类型不存在`;
  }
}
/**
 * 注册验证类
 *
 * @export
 * @class RegistorValidator
 * @extends {Validator}
 */
export class TokenValidator extends Validator {
  constructor() {
    super();
  }

  /**
   * 登录唯一标识符
   *
   * @type {string}
   * @memberof TokenValidator
   */
  @Length(4, 32, {
    message: "不符合账号规则"
  })
  account?: string;

  /**
   * 密码或其他
   *
   * @type {string}
   * @memberof TokenValidator
   */
  @Validate(CheckSecret)
  secret?: string;

  /**
   * 登录类型
   *
   * @type {LoginType}
   * @memberof TokenValidator
   */
  @Validate(CheckType)
  type?: LoginType;
}

export class VerifyTokenValidator extends Validator {
  @MinLength(1, {
    message: 'token不许为空'
  })
  token?: string
}