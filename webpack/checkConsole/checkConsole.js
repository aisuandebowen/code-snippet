const fs = require("fs");
const core = require("@babel/core");
const { isArray, isString } = require("./utils.js");
/**
 * 收集文件夹里console.log日志数量
 * @param {String} folder
 * @returns
 */
function collectLogNum(folder) {
  const code = fs.readFileSync(folder, "utf-8");

  const transformCode = core.parse(code, {
    sourceType: "unambiguous",
  });
  const consolePaths = [];
  core.traverse(transformCode, {
    ExpressionStatement(path) {
      const { object, property } = path.node.expression.callee || {};
      if (object?.name === "console" && property?.name === "log") {
        consolePaths.push(path);
      }
    },
  });
  return consolePaths.length;
}

/**
 * 检查文件是否有console.log
 * @param {Array | String} folders 文件夹数组/字符文件夹
 * @returns {Object}
 */
function checkConsole(folders) {
  let sum = 0;
  if (isArray(folders)) {
    folders.forEach((folder) => {
      sum += collectLogNum(folder);
    });
  } else if (isString(folders)) {
    sum = collectLogNum(folders);
  }

  return {
    flag: sum > 0,
    sum,
  };
}

module.exports = checkConsole;
