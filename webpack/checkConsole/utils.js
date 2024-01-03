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

module.exports = {
  isArray,
  isString,
  checkFile,
};
