function isArray(target) {
  return Array.isArray(target);
}

function isString(target) {
  return typeof target === "string";
}

/**
 * 校验文件
 * @param {String} file
 * @param {Array} typeArr
 * @returns
 */
function checkFile(file, typeArr) {
  const reg = new RegExp(`\\.(${typeArr.join("|")})$`, "gi");
  return reg.test(file);
}

/**
 * 检验路径在某规则下是否通过
 * @param {String} rule 规则 例如：src/*,*.js
 * @param {String} file 路径
 * @returns
 */
function checkPath(rule, file) {
  const formatStr = rule.replace("*", ".*").replace("/", "/");
  return new RegExp(formatStr).test(file);
}

module.exports = {
  isArray,
  isString,
  checkFile,
  checkPath,
};
