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
  let sum = 0;
  const locArr = [];
  core.traverse(transformCode, {
    ExpressionStatement(path) {
      const { object, property } = path.node.expression.callee || {};
      if (object?.name === "console" && property?.name === "log") {
        locArr.push(object.loc.start);
        sum += 1;
      }
    },
  });

  if (sum > 0) {
    return {
      sum,
      path: folder,
      locArr,
    };
  } else {
    return null;
  }
}

/**
 * 检查文件是否有console.log
 * @param {Array | String} folders 文件夹数组/字符文件夹
 * @returns {Object}
 */
function checkConsole(folders) {
  const errorFolders = [];
  if (isArray(folders)) {
    folders.forEach((folder) => {
      const obj = collectLogNum(folder);
      obj && errorFolders.push(obj);
    });
  } else if (isString(folders)) {
    const obj = collectLogNum(folder);
    obj && errorFolders.push(obj);
  }

  return {
    flag: errorFolders.length > 0,
    errorFolders,
  };
}

module.exports = checkConsole;
