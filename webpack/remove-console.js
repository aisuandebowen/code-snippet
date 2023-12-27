/**
 * AST语法树删除console.log
 */
module.exports = function () {
  return {
    visitor: {
      ExpressionStatement(path) {
        const callee = path.node.expression.callee;
        if (callee) {
          const { object, property } = callee;
          if (
            object &&
            property &&
            object.name === 'console' &&
            property.name === 'log'
          ) {
            path.remove();
          }
        }
      },
    },
  };
};
