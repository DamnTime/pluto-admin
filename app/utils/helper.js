// 精准判断数据类型
const dataType = (tgt, type) => {
  const dataType = Object.prototype.toString
    .call(tgt)
    .replace(/\[object (\w+)\]/, '$1')
    .toLowerCase();
  return type ? dataType === type : dataType;
};

const resBaseModel = (code, msg, content = null) => {
  return {
    code,
    msg,
    content,
  };
};

module.exports = {
  dataType,
  resBaseModel,
};
