// 分页参数配置
const pagenation = {
  page: 1,
  pageSize: 10,
};

// 系统权限
const systemLevel = {
  general: 0, // 普通权限
  admin: 999, // 最高权限
};

// 七牛配置
const qiniu = {
  AK: 'FPZn50jfaVSbgMXLEU3CUIWKIqQaYUp6tOqXQ2l1',
  SK: 'RDhwROl7ZNKUFuNb6DrZdae_zZZaNTo-GIVNO5ql',
  bucket: 'pluto1811',
  origin: 'http://cdn.pluto1811.com/',
};

// 用户默认密码
const defaultPwd = '123456';

module.exports = {
  pagenation,
  systemLevel,
  qiniu,
  defaultPwd,
};
