const { execSync } = require("child_process");
const checkConsole = require("./checkConsole.js");
const { checkFile } = require("./utils.js");

function init() {
  const gitCom = "git diff --staged --diff-filter=ACMR --name-only -z ";
  const lines = execSync(gitCom).toString();
  // 已修改的文件列表
  const stagedFiles = lines.replace(/\u0000$/, "").split("\u0000");
  const jsFiles = stagedFiles.filter((file) => checkFile(file, ["js"]));

  const { flag, sum } = checkConsole(jsFiles);

  if (flag) {
    console.error(`怎么肥事，又写了${sum}个脏东西 --- console`);
    process.exit(1);
  } else {
    process.exit(0);
  }
}

module.exports = init;
