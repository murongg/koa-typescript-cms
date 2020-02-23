/*
 * @Author: MuRong
 * @Date: 2020-02-19 12:38:02
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-23 17:50:50
 * @Description: 配置文件
 * @FilePath: \koa-ts-cms\src\config\config.ts
 */
export interface databaseInterface {
  dbName: string; // 数据库名称
  host: string; // 数据库地址
  port: number; // 数据库端口
  user: string; // 数据库用户名
  password?: string; // 数据库密码
}

export interface securityInterface {
  secretKey?: string; // jwt的secretKey
  expiresIn?: number; // jwt的失效时间
}
export interface wxInterface {
  AppID?: string; // AppID
  AppSecret?: string; // AppSecret
  LoginUrl?: string // 小程序登录请求地址
}
export interface configInterface {
  environment?: string; // 环境变量
  database: databaseInterface; // 数据库配置
  security: securityInterface; // token生成配置
  wx: wxInterface; // 微信小程序参数配置
}
export const config: configInterface = {
  environment: "dev",
  database: {
    dbName: "koacms",
    host: "localhost",
    port: 3306,
    user: "root",
    password: ""
  },
  security: {
    secretKey: "5465asd6as5d4as65d46sd",
    expiresIn: 60 * 60 * 24 * 30
  },
  wx: {
    AppID: "wx0d3c77b944788b7b",
    AppSecret: "7b694a665c42a85ded032c5d333aea73",
    LoginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  }
};
