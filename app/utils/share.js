const Sequelize = require('sequelize');
// const dayjs = require('dayjs');
const { dataType } = require('./helper');

const { DATE } = Sequelize;

const toLine = (name) => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
};

// 包装model 驼峰转下划线
function transformLine(fields = {}, isAddTime = true) {
  const reg = /[A-Z]/;
  const fieldArr = Object.keys(fields);
  for (const field of fieldArr) {
    if (reg.test(field)) {
      const current = fields[field];
      if (dataType(current, 'object')) {
        fields[field] = Object.assign({}, current, {
          field: toLine(field),
        });
      } else {
        fields[field] = {
          type: current,
          field: toLine(field),
        };
      }
    }
  }

  if (isAddTime) {
    return Object.assign(fields, {
      createdAt: {
        type: DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at',
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at',
      },
    });
  }
  return fields;
}

// int转换
const toInt = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
};

module.exports = {
  transformLine,
  toInt,
};
