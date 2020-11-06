const bcrypt = require('bcryptjs');
const { transformLine } = require('../app/utils/share');
const Sequelize = require('sequelize');
module.exports = () => {
  const { INTEGER, STRING } = Sequelize;
  return transformLine({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    nickName: STRING,
    passWord: {
      type: STRING,
      set(val) {
        const salt = bcrypt.genSaltSync(10);
        const psw = bcrypt.hashSync(val, salt);
        this.setDataValue('passWord', psw);
      },
    },
    account: STRING,
    email: STRING,
    introduce: STRING,
    headImg: STRING,
    sex: {
      type: INTEGER,
      defaultValue: 0, // 0:男 1:女
    },
    hobby: STRING, // 用户爱好
    status: {
      type: INTEGER,
      defaultValue: 0, // 0:正常 1:禁止
    },
    role: {
      type: INTEGER,
      defaultValue: 0, // 999:超管 0:普通
    },
  });
};
