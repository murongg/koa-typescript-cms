/*
 * @Author: MuRong
 * @Date: 2020-02-18 09:21:34
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-23 19:35:56
 * @Description: 初始化各类配置
 * @FilePath: \koa-typescript-cms\src\core\init.ts
 */
import Koa from "koa";
import Router from "koa-router";
import consola from "consola";
import { get } from "lodash";

import { getFiles } from "./utils";
import { config, configInterface } from "../config/config";
declare global {
  namespace NodeJS {
    interface Global {
      config?: configInterface;
    }
  }
}
class InitManager {
  static app: Koa<Koa.DefaultState, Koa.DefaultContext>;

  /**
   * 入口方法
   *
   * @static
   * @param {Koa} app
   * @memberof InitManager
   */
  static initCore(app: Koa) {
    InitManager.app = app;
    InitManager.initLoadRouters();
    InitManager.loadConfig();
  }

  /**
   * 路由自动加载
   *
   * @static
   * @memberof InitManager
   */
  static initLoadRouters() {
    const mainRouter = new Router();
    const path: string = `${process.cwd()}/src/app/api`;
    const files: string[] = getFiles(path);
    for (let file of files) {
      // 获取文件后缀名
      const extention: string = file.substring(
        file.lastIndexOf("."),
        file.length
      );
      if (extention === ".ts") {
        // 加载api文件夹下所有文件
        // 并检测文件是否是koa的路由
        // 如果是路由便将路由加载
        const mod: Router = require(file);
        if (mod instanceof Router) {
          // consola.info(`loading a router instance from file: ${file}`);
          get(mod, "stack", []).forEach((ly: Router.Layer) => {
            consola.info(`loading a route: ${get(ly, "path")}`);
          });
          mainRouter.use(mod.routes()).use(mod.allowedMethods());
        }
      }
    }
  }

  /**
   * 载入配置文件
   *
   * @static
   * @memberof InitManager
   */
  static loadConfig() {
    global.config = config;
  }
}
export default InitManager;
