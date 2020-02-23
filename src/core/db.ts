/*
 * @Author: MuRong
 * @Date: 2020-02-19 13:20:01
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-23 10:35:00
 * @Description: 数据库
 * @FilePath: \koa-ts-cms\src\core\db.ts
 */
import { Sequelize, Model } from "sequelize-typescript";
import { config, databaseInterface } from "../config/config";
import { unset,clone, isArray } from "lodash";
const {
  dbName,
  user,
  password,
  host,
  port
}: databaseInterface = config.database;
const sequelize: Sequelize = new Sequelize(dbName, user, password, {
  dialect: "mysql",
  host,
  port,
  logging: true,
  timezone: "+08:00",
  define: {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
});

sequelize.sync({
  force: false
});
Model.prototype.toJSON = function(): object {
  let data = clone(this['dataValues'])
  unset(data, 'updatedAt')
  unset(data, 'deletedAt')
  if(isArray(this['exclude'])) {
    this['exclude'].forEach(value => {
      unset(data, value)
    })
  }
  return data;
};
export { sequelize };
