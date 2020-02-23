/*
 * @Author: MuRong
 * @Date: 2020-02-18 09:14:29
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-19 12:59:40
 * @Description: 
 * @FilePath: \koa-ts-cms\src\app\api\v1\book.ts
 */
import Router from 'koa-router'
import { ParametersException } from '../../../core/exception';

const router: Router = new Router();
router.prefix('/v1/book')
router.get('/', async (ctx) => {
    ctx.body = 'Hello Book';
    });

router.get('/book2', async (ctx) => {
    ctx.body = 'Hello Book2';
});

module.exports = router 