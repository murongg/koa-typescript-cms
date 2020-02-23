/*
 * @Author: MuRong
 * @Date: 2020-02-19 21:14:29
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-21 09:47:12
 * @Description: 校验器
 * @FilePath: \koa-ts-cms\src\core\validator.ts
 */
import {
  validateOrReject,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator";
import { Context } from "koa";
import { cloneDeep } from "lodash";
import { ParametersException } from "./exception";

@ValidatorConstraint()
export class isOptional implements ValidatorConstraintInterface {
  validate(val: string, args: ValidationArguments): boolean {
    if (val === void 0) {
      return true;
    }
    if (val === null) {
      return true;
    }
    if (typeof val === "string") {
      return val === "" || val.trim() === "";
    }
    return false;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property}不符合规范`;
  }
}

export class Validator {
  async validate(ctx: Context) {
    const params = {
      ...ctx.request.body,
      ...ctx.request.query,
      ...ctx.params
    };
    const data = cloneDeep(params);
    for (let key in params) {
      this[key] = params[key];
    }
    try {
      await validateOrReject(this);
      return data;
    } catch (errors) {
      console.log(errors);
      let errorResult: string[] = [];
      errors.forEach(error => {
        let messages: string[] = [];
        for (let msg in error.constraints) {
          messages.push(error.constraints[msg]);
        }
        errorResult = errorResult.concat(messages)
        // errorResult[error.property] = messages;
      });
      throw new ParametersException({ msg: errorResult });
    }
  }
}
