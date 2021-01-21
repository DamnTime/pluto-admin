require('module-alias/register');
const fs = require('fs');
const uuid = require('uuid');
const QINIU = require('qiniu');
const axios = require('axios');
const Controller = require('egg').Controller;
const { qiniu } = require('@core/config');
const { upToQiniu } = require('@utils/upload');

class LoginController extends Controller {
  // 前端直传七牛
  async uploadToken() {
    const { ctx } = this;
    const accessKey = qiniu.AK;
    const secretKey = qiniu.SK;

    const mac = new QINIU.auth.digest.Mac(accessKey, secretKey);
    // bucket是存储空间名称
    const options = {
      scope: qiniu.bucket,
      expires: 60 * 60 * 2,
      returnBody: '{"key":"$(key)","hash":"$(etag)"}',
    };
    try {
      const putPolicy = new QINIU.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);
      ctx.helper.successRes('获取token成功', uploadToken);
    } catch (error) {
      ctx.helper.generalExceptionRes('获取token失败');
    }
  }
  // 后端上传
  async uploadFile() {
    const { ctx } = this;
    try {
      // 前端必须以formData格式进行文件的传递
      const file = ctx.request.files[0]; // 获取上传文件
      if (file) {
        // 命名文件
        const fileName = uuid.v1();
        // 创建文件可读流
        const reader = fs.createReadStream(file.filepath);
        // 获取上传文件扩展名
        const ext = file.filename.split('.').pop();
        // 命名文件以及拓展名
        const fileUrl = `${fileName}.${ext}`;
        // 调用方法(封装在utils文件夹内)
        const result = await upToQiniu(reader, fileUrl);
        if (result) {
          const { key } = result;
          const imgUrl = qiniu.origin + key;
          ctx.helper.successRes('获取token成功', imgUrl);
        } else {
          ctx.helper.generalExceptionRes(result);
        }
      } else {
        ctx.helper.paramsExceptionRes('没有上传图片');
      }
    } catch (err) {
      ctx.helper.notFoundExceptionRes('上传失败');
    }
  }
  async getWeather() {
    const { ctx } = this;
    const { data } = await axios.get(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=f30997b1b030ccb9e428c779a0d12caa&city=${encodeURI(
        '成都'
      )}&output=json&extensions=base`
    );
    if (data.info !== 'OK') {
      return ctx.helper.generalExceptionRes('获取天气数据失败');
    }
    ctx.helper.successRes('获取天气数据成功', data);
  }
}

module.exports = LoginController;
