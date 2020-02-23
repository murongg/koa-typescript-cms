/*
 * @Author: MuRong
 * @Date: 2020-02-20 22:58:24
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-22 10:12:45
 * @Description:
 * @FilePath: \koa-ts-cms\src\app\api\v1\token.ts
 */
import Router from "koa-router";
import { TokenValidator, VerifyTokenValidator } from '../../validators/TokenValidator';
import { LoginType } from "../../lib/enum";
import UsersService from "../../service/users";
import { tokenLoginInterface } from "../../lib/interface/TokenInterface";
import { generateToken } from '../../../core/utils';
import { AuthType, Auth } from '../../../middlewares/auth';
import { request } from 'http';
import { WXService } from '../../service/wx';

const router: Router = new Router();
router.prefix("/v1/token");

router.post("/", async ctx => {
  const v: tokenLoginInterface = await new TokenValidator().validate(ctx);
  let token:string = ''
  switch (v.type) {
    case LoginType.USER_EMAIL:
      token = await emailLogin(v.account, v.secret)
      break;
    case LoginType.USER_MINI_PROGRAM:
      token = await WXService.codeToToken(v.account)
      break;
    case LoginType.USER_MOBILE:
      break;
    default:
      break;
  }
  ctx.body = {
    token
  };
});

router.post('/verify', async (ctx) => {
  const v = await new VerifyTokenValidator().validate(ctx)
  const result = await Auth.verifyToken(v.token)
  ctx.body = {
    result
  }
})

async function emailLogin(account: string, secret: string) {
  const user = await UsersService.verifyEmailPassword(account, secret);
  return generateToken(user.id, AuthType.USER)
}
module.exports = router;
