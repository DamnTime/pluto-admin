'use strict';
const inquirer = require('inquirer');
const childProcess = require('child_process');
// 设置问题
inquirer
  .prompt([
    {
      type: 'input',
      name: 'migrationFunc',
      message: '输入此次更新表的功能',
      default: 'user-addClomn',
    },
  ])
  .then((answers) => {
    const migrationFunc = answers.migrationFunc;
    childProcess.exec(
      `npx sequelize migration:generate --name=${migrationFunc}`,
      (err, stdout) => {
        console.log(stdout);
      }
    );
  });
