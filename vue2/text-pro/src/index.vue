<script>
/**
 * 支持自动溢出省略的文本组件
 */
import props from './props';
import isNumber from '@path/common/tools/type-utils/isNumber';
import { getLineHeight } from './utils';
export default {
  name: 'TextPro',
  props,
  data() {
    return {
      contentStyle: {}, // 溢出文本样式
      tooltip: undefined, // 是否打开tooltip
    };
  },
  render() {
    const { tip, tipText } = this.$props;
    const text = this.$slots.default;

    /** 默认文本 */
    const defaultCom = (text) => {
      const props = {
        class: 'text-pro',
        style: this.contentStyle,
        ref: 'piter',
      };
      return <span {...props}>{text}</span>;
    };
    /** 支持溢出省略、Tooltip的文本 */
    const tooltipText = (text) => {
      const slots = {
        title: () => <span>{tipText || text}</span>,
      };
      return <a-tooltip scopedSlots={slots}>{defaultCom(text)}</a-tooltip>;
    };

    if (tip && this.tooltip) {
      return tooltipText(text);
    } else {
      return defaultCom(text);
    }
  },
  mounted() {
    this.resetCSS();
  },
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
    /**
     * 更新CSS，处理溢出问题
     */
    resetCSS() {
      const dom = this.$refs.piter;
      const lineHeight = getLineHeight(dom);
      const realHeight = dom.getBoundingClientRect().height;
      if (realHeight > lineHeight * this.ellipsisNum) {
        // 真实情况已换行，加css
        const { textDecoration, ellipsis, ellipsisNum } = this.$props;
        this.contentStyle = this.getStyle(
          ellipsis,
          ellipsisNum,
          textDecoration,
        );
        this.tooltip = true;
      } else {
        // 没有自动换行，就不加css
        this.tooltip = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.text-pro {
  display: inline-block;
  width: auto;
  max-width: 100%;

  p {
    word-break: normal;
    white-space: pre-warp;
    word-wrap: break-word;
  }
}
</style
