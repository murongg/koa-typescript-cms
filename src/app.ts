/*
 * @Author: MuRong
 * @Date: 2020-02-18 08:14:58
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-23 15:29:21
 * @Description: 入口文件
 * @FilePath: \koa-ts-cms\src\app.ts
 */
import Koa from 'koa';
import bodyParser from 'koa-bodyparser'
import InitManager from './core/init'
import catchError from './middlewares/exception';

const app = new Koa()
app.use(bodyParser())
app.use(catchError)
InitManager.initCore(app)

app.listen(3001);

console.log('Server running on port 3001');