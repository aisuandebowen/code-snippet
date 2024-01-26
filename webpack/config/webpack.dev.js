/**
 * 实现目标:
 * 1、不压缩文件
 * 2、不进行babel
 * 3、dev-server
 */
const { default: merge } = require("webpack-merge");
const base = require("./webpack.base");
const devConfig = {
  optimization: {
    minimize: false,
    mangleExports: false,
    mangleWasmImports: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    runtimeChunk: false,
  },
};
module.exports = merge(base, devConfig);
