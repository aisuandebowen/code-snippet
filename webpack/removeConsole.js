/**
 * AST语法树删除console.log
 */
module.exports = {
  visitor: {
    ExpressionStatement(path) {
      try {
        const { object, property } = path.node.expression.callee;
        if (object.name === "console" || property.name === "log") {
          path.remove();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
