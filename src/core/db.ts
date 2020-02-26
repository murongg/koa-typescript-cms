/*
 * @Author: MuRong
 * @Date: 2020-02-19 13:20:01
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-26 18:44:34
 * @Description: 数据库
 * @FilePath: \koa-typescript-cms\src\core\db.ts
 */
import { Sequelize, Model } from "sequelize-typescript";
import { config, databaseInterface } from "../config/config";
import { unset,clone, isArray } from "lodash";
// 数据库配置信息
const {
  dbName,
  user,
  password,
  host,
  port
}: databaseInterface = config.database;
// 初始化Sequelize
const sequelize: Sequelize = new Sequelize(
  dbName, // 数据库名称
  user, // 数据库用户名
  password, // 数据库密码
  {
    dialect: "mysql", // 数据库引擎
    host, // 数据库地址
    port, // 数据库端口
    logging: true, // 是否打印日志
    timezone: "+08:00", // 设置数据库市区，建议设置，mysql默认的时区比东八区少了八个小时
    define: {
      timestamps: true, // 为模型添加 createdAt 和 updatedAt 两个时间戳字段
      paranoid: true, // 使用逻辑删除。设置为true后，调用 destroy 方法时将不会删队模型，而是设置一个 deletedAt 列。此设置需要 timestamps=true
      underscored: true, // 转换列名的驼峰命名规则为下划线命令规则
      freezeTableName: true // 转换模型名的驼峰命名规则为表名的下划线命令规则
    }
  }
);

sequelize.sync({
  // 是否自动建表
  force: false
});
Model.prototype.toJSON = function(): object {
  // 浅拷贝从数据库获取到的数据
  let data = clone(this['dataValues'])
  // 删除指定字段
  unset(data, 'updatedAt')
  unset(data, 'deletedAt')
  // 这个是自己再Model原型上定义的变量
  // 用于控制我们再某次查询数据时想要排除的其他字段
  // 类型为数组，数组的值便是想要排除的字段
  // 例如user.exclude['a', 'b']，此次查询将会增加排除a,b字段
  if(isArray(this['exclude'])) {
    this['exclude'].forEach(value => {
      unset(data, value)
    })
  }
  return data;
};
export { sequelize };
