'use strict';
exports.yargs = () => {
  const args = process.argv;
  const argv = {};
  for (let index = 0; index < args.length; index++) {
    const element = args[index];
    if (/^(--)/.test(element)) {
      argv[element.slice(2)] = args[++index];
    }
  }
  return argv;
};
