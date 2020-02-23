/*
 * @Author: MuRong
 * @Date: 2020-02-18 10:04:04
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-21 20:46:31
 * @Description:
 * @FilePath: \koa-ts-cms\src\core\utils.ts
 */
import fs from "fs";
import jwt from "jsonwebtoken";
import { AuthType } from "../middlewares/auth";
export interface ObjOptions {
  prefix?: string;
  filter?: (key: any) => boolean;
}
/**
 * 获取文件夹下所有文件名
 *
 * @export
 * @param {string} dir
 * @returns
 */
export function getFiles(dir: string): string[] {
  let res: string[] = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = dir + "/" + file;
    if (fs.statSync(name).isDirectory()) {
      const tmp = getFiles(name);
      res = res.concat(tmp);
    } else {
      res.push(name);
    }
  }
  return res;
}

/**
 * 获取一个实例的所有方法
 * @param obj 对象实例
 * @param option 参数
 *
 * ```js
 *     let validateFuncKeys: string[] = getAllMethodNames(this, {
 *     filter: key =>
 *   /validate([A-Z])\w+/g.test(key) && typeof this[key] === "function"
 *  });
 * ```
 */
export function getAllMethodNames(obj, option?: ObjOptions) {
  let methods = new Set();
  // tslint:disable-next-line:no-conditional-assignment
  while ((obj = Reflect.getPrototypeOf(obj))) {
    let keys = Reflect.ownKeys(obj);
    keys.forEach(k => methods.add(k));
  }
  let keys = Array.from(methods.values());
  return prefixAndFilter(keys, option);
}
/**
 * 获得实例的所有字段名
 * @param obj 实例
 * @param option 参数项
 *
 * ```js
 *     let keys = getAllFieldNames(this, {
 *      filter: key => {
 *    const value = this[key];
 *    if (isArray(value)) {
 *      if (value.length === 0) {
 *      return false;
 *    }
 *    for (const it of value) {
 *       if (!(it instanceof Rule)) {
 *         throw new Error("every item must be a instance of Rule");
 *      }
 *    }
 *    return true;
 *   } else {
 *    return value instanceof Rule;
 *    }
 *   }
 *  });
 * ```
 */
export function getAllFieldNames(obj, option?: ObjOptions) {
  let keys = Reflect.ownKeys(obj);
  return prefixAndFilter(keys, option);
}

function prefixAndFilter(keys: any[], option?: ObjOptions) {
  option &&
    option.prefix &&
    (keys = keys.filter(key => key.toString().startsWith(option.prefix)));
  option && option.filter && (keys = keys.filter(option.filter));
  return keys;
}

/**
 * 生成token
 *
 * @export
 * @param {*} uid
 * @param {*} scope
 * @returns
 */
export function generateToken(uid: string | number, scope: AuthType): string {
  const secretKey: string = global.config?.security.secretKey
    ? global.config?.security.secretKey
    : "assgfgahdfghfhfhfg";
  const expiresIn: number = global.config?.security.expiresIn
    ? global.config?.security.expiresIn
    : 60 * 60;
  const token = jwt.sign(
    {
      uid,
      scope
    },
    secretKey,
    {
      expiresIn
    }
  );
  return token;
}
