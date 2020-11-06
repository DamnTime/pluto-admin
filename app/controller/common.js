require('module-alias/register');
const QINIU = require('qiniu');
const axios = require('axios');
const Controller = require('egg').Controller;
const { qiniu } = require('@core/config');

class LoginController extends Controller {
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
