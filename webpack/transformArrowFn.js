const types = require("@babel/types");
/**
 * 寻找上级路径中第一个是函数的或为根的路径
 * @param {*} path
 * @returns
 */
function findThis(path) {
  const parent = path.findParent(
    (path) => types.isFunctionDeclaration(path) || types.isProgram(path)
  );
  return parent;
}

/**
 * 基于babel将箭头函数转为普通函数
 */
module.exports = {
  visitor: {
    ArrowFunctionExpression(path) {
      path.node.type = "FunctionDeclaration";
      const body = path.node.body;
      if (!types.isBlockStatement(body)) {
        path.node.body = types.blockStatement([types.returnStatement(body)]);
      }
      // 从下至上寻找第一个非箭头函数/根函数的path
      const parentPath = findThis(path);

      // 查找子路径是否存在箭头函数
      const paths = [];
      parentPath.traverse({
        ThisExpression(thisPath) {
          paths.push(thisPath);
        },
      });

      // 存在的话：根this 添加参数var _this = this
      if (paths.length > 0) {
        if (!parentPath.scope.hasBinding("_this")) {
          parentPath.scope.push({
            id: types.identifier("_this"),
            init: types.thisExpression(),
          });
        }
      }

      // 为子路径下的箭头函数的this替换为_this
      paths.forEach((item) => {
        item.replaceWith(types.identifier("_this"));
      });
    },
  },
};
