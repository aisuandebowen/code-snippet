/**
 * 压缩文件
 */

const { default: merge } = require("webpack-merge");
const base = require("./webpack.base");
const prodConfig = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};

module.exports = merge(base, prodConfig);
