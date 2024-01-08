const { execSync } = require("child_process");
const checkConsole = require("./checkConsole.js");
const { checkFile, checkPath } = require("./utils.js");

async function init(include) {
  const gitCom = "git diff --staged --diff-filter=ACMR --name-only -z ";
  const lines = execSync(gitCom).toString();
  // 已修改的文件列表
  const stagedFiles = lines.replace(/\u0000$/, "").split("\u0000");
  const jsFiles = stagedFiles.filter((file) => checkFile(file, ["js"]));
  const filterJsFiles = jsFiles.filter((item) => checkPath(include, item));

  const { flag, errorFolders } = checkConsole(filterJsFiles);

  if (flag) {
    console.log(`\x1B[37m`, `-----排查console.log结果-----`);
    for (const folder of errorFolders) {
      const { path, sum, locArr } = folder;
      console.log("\x1B[31m", `${path}：${sum}处`);
      for (const loc of locArr) {
        console.log(`行:${loc.line}, 列:${loc.column} 存在console.log`);
      }
      console.log("\n");
    }
    console.log(`\x1B[37m`);
    process.exit(1);
  } else {
    process.exit(0);
  }
}

/**
 * 待办：
 * 1、日志类型
 * 2、diff console数量（难）
 * 3、支持vue文件
 * 4、新一轮提交，询问是留着还是删 (del)
 */
module.exports = init;
