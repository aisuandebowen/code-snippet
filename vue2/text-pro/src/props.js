export default {
  // 是否开启toolTip
  tip: {
    default: false,
    type: Boolean,
  },
  // 文本内容
  text: {
    default: '',
    type: String,
  },
  // toolTip文本
  tipText: {
    default: '',
    type: String,
  },
  // 装饰性线条
  textDecoration: {
    default: 'none',
    type: String,
  },
  // 是否省略 true => 1行
  ellipsis: {
    default: false,
    type: Boolean,
  },
  // 省略行数
  ellipsisNum: {
    default: 1,
    type: Number,
  },
};
