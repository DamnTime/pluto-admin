// 上传到七牛
const qiniu = require('qiniu'); // 需要加载qiniu模块的
// 引入key文件
const appConfig = require('@core/config');
const upToQiniu = (filePath, key) => {
  const accessKey = appConfig.qiniu.AK;
  const secretKey = appConfig.qiniu.SK;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  // bucket是存储空间名称
  const options = {
    scope: appConfig.qiniu.bucket,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  // 生成token 作为个人七牛云账号的识别标识
  const uploadToken = putPolicy.uploadToken(mac);
  const config = new qiniu.conf.Config();
  // 空间对应的机房 一定要按自己属区Zone对象
  // ————http上传,指定zone的具体区域——
  // Zone.zone0:华东
  // Zone.zone1:华北
  // Zone.zone2:华南
  // Zone.zoneNa0:北美
  // ———http上传，自动识别上传区域——
  // Zone.httpAutoZone
  // ———https上传，自动识别上传区域——
  // Zone.httpsAutoZone
  config.zone = qiniu.zone.Zone_z2;
  const localFile = filePath;
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  // 文件上传
  return new Promise((resolve, reject) => {
    // 以文件流的形式进行上传
    // uploadToken是token， key是上传到七牛后保存的文件名, localFile是流文件
    // putExtra是上传的文件参数，采用源码中的默认参数
    formUploader.putStream(uploadToken, key, localFile, putExtra, function (respErr, respBody) {
      if (respErr) {
        reject(respErr);
      } else {
        resolve(respBody);
      }
    });
  });
};

module.exports = {
  upToQiniu,
};
