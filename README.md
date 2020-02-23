## 前言
最近学习了慕课网七月老师的《从0到1手把手教你用Node.js+KOA2打造超好用的Web框架》，自己使用**TypeScript**重构了一个简单的**cms框架**，具有**路由自动注册、全局异常处理、参数校验、JWT鉴权、权限管理**等cms基础功能。

**本人是一名大四狗，本科网络工程专业，求大佬给内推机会。**
## 目录
- [从0到1koa+ts实现简易CMS框架（一）：项目搭建以及配置](https://juejin.im/post/5e523e30518825491a37faa3)
## 主要工具库
- **koa**   web框架
- **koa-bodyparser** 处理koa post请求
- **koa-router** koa路由
- **sequelize、sequelize-typescript、mysql2** ORM框架与Mysql
- **validator、class-validator** 参数校验
- **jsonwebtoken** jwt
- **bcryptjs** 加密工具
- **reflect-metadata** 给装饰器添加各种信息
- **nodemon** 监听文件改变自动重启服务
## 项目目录
```
├── dist                                        // ts编译后的文件
├── src                                         // 源码目录
│   ├── components                              // 组件
│   │   ├── app                                 // 项目业务代码
│   │   │   ├── api                             // api层
│   │   │   ├── service                         // service层
│   │   │   ├── model                           // model层
│   │   │   ├── validators                      // 参数校验类
│   │   │   ├── lib                             // interface与enum
│   │   ├── core                                // 项目核心代码
│   │   ├── middlewares                         // 中间件
│   │   ├── config                              // 全局配置文件
│   │   ├── app.ts                              // 项目入口文件
├── tests                                       // 单元测试
├── package.json                                // package.json                                
├── tsconfig.json                               // ts配置文件
```
## 项目初始化
### 初始化package.json
创建项目文件夹，再控制台中打开此文件夹，输入`npm init -y`初始化`package.json`文件。
### 初始化TypeScript配置文件
根目录运行`tsc --init`后，自动创建`tsconfig.json`文件，完成后，执行`npm install typescript ts-node @types/node`命令  

**`tsconfig.json`文件源码：**
```JAVASCRIPT
{
  "compilerOptions": {
    "target": "ES2015",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    "sourceMap": true,                     /* Generates corresponding '.map' file. */
    "outDir": "./dist",                        /* Redirect output structure to the directory. */
    "rootDir": "./src",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    "strict": true,                           /* Enable all strict type-checking options. */
    "noImplicitAny": false,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    "typeRoots": ["./node_modules/@types"],                       /* List of folders to include type definitions from. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  },
  "exclude": ["node_modules"],
  "include": ["src"]
}
```
## 初始化koa服务
执行`npm install koa @types/koa`命令
在根目录创建`src`文件夹，并在文件夹下创建`app.ts`文件  

**`app.ts`文件代码：**

```javascript
import Koa from 'koa';
const app = new Koa()

app.listen(3000);

console.log('Server running on port 3000');
```
## 使用nodemon自动监听文件改变并重启服务
执行`npm install nodemon`命令  
修改`package.json`文件中的`scripts`字段  
添加`"start": "nodemon -e ts,tsx --exec ts-node ./src/app.ts"`  
添加此命令后，`nodemon`会监听`src`目录下文件改变，自动重启

**修改后：**
```javascript
"scripts": {
    "start": "nodemon -e ts,tsx --exec ts-node ./src/app.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```
## 创建配置文件
再`src`目录创建`config`文件夹，并创建`config.ts`文件
### 定义各类Interface
#### config interface
```javascript
export interface configInterface {
  environment?: string; // 环境变量
  database: databaseInterface; // 数据库配置
  security: securityInterface; // token生成配置
  wx: wxInterface; // 微信小程序参数配置
}
```
#### security interface
```javascript
export interface securityInterface {
  secretKey?: string; // jwt的secretKey
  expiresIn?: number; // jwt的失效时间
}
```
#### datebase interface
```javascript
export interface databaseInterface {
  dbName: string; // 数据库名称
  host: string; // 数据库地址
  port: number; // 数据库端口
  user: string; // 数据库用户名
  password?: string; // 数据库密码
}
```
#### wx interface
```javascript
export interface wxInterface {
  AppID?: string; // AppID
  AppSecret?: string; // AppSecret
  LoginUrl?: string // 小程序登录请求地址
}
```
**全部配置代码**
```
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
    AppID: "你的AppID",
    AppSecret: "你的AppSecret",
    LoginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  }
};
```
## 更新中......