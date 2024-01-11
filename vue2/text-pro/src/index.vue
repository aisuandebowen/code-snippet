<script>
/**
 * 支持自动溢出省略的文本组件
 */
import props from './props';
import isNumber from '@path/common/tools/type-utils/isNumber';
export default {
  name: 'TextPro',
  props,
  methods: {
    /**
     * 获取文本样式
     * @param {Boolean} ellipsis 是否省略
     * @param {Number} ellipsisNum 省略行数
     * @param {String} textDecoration 装饰性线条
     */
    getStyle(ellipsis, ellipsisNum, textDecoration) {
      /** 公共样式 */
      const style = {
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
        'text-decoration': textDecoration,
      };
      /** 单行样式 */
      const singleLine = {
        'white-space': 'nowrap',
      };
      /** 多行样式 */
      const multiLine = (line) => {
        return {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': line,
        };
      };

      if (ellipsis) {
        if (isNumber(ellipsisNum) && ellipsisNum > 1) {
          return Object.assign(style, multiLine(ellipsisNum));
        } else {
          return Object.assign(style, singleLine);
        }
      } else {
        return {};
      }
    },
  },
  render() {
    const { tip, tipText, textDecoration, ellipsis, ellipsisNum } = this.$props;
    const text = this.$slots.default;

    /** 默认文本 */
    const defaultCom = (text, style = {}) => {
      const props = {
        class: 'text-pro',
        style,
      };
      return <p {...props}>{text}</p>;
    };
    /** 支持溢出省略、Tooltip的文本 */
    const tooltipText = (text) => {
      const slots = {
        title: () => <p>{tipText || text}</p>,
      };
      const textStyle = this.getStyle(ellipsis, ellipsisNum, textDecoration);
      return (
        <a-tooltip scopedSlots={slots}>{defaultCom(text, textStyle)}</a-tooltip>
      );
    };

    if (tip) {
      return tooltipText(text);
    } else {
      return defaultCom(text);
    }
  },
};
</script>

<style scoped lang="less">
.text-pro {
  display: inline-block;
  width: auto;
  max-width: 100%;
}
</style>
