import TextPro from './src/index.vue';

TextPro.install = function (Vue) {
  Vue.component(TextPro.name, TextPro);
};
/** 支持自动溢出省略的文本组件 */
export default TextPro;
