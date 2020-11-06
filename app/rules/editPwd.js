'use strict';

const rule = {
  oldPassWord: [{ required: true, message: '原密码 oldPassWord 不能为空' }],
  passWord: [{ required: true, message: '新密码 passWord 不能为空' }],
  comfirmPassWord: [
    { required: true, message: '确认新密码 comfirmPassWord 不能为空' },
  ],
};

module.exports = rule;
