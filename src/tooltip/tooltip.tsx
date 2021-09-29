import Vue from 'vue';
import { prefix } from '../config';
import props from './props';
import popupProps from '../popup/props';
import Popup, { PopupProps } from '../popup';
import { ClassName } from '../common';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';

const name = `${prefix}-tooltip`;

export default Vue.extend({
  name,
  components: { Popup },
  props: {
    ...popupProps,
    ...props,
  },
  data() {
    return {
      timer: null,
      tooltipVisible: false,
    };
  },
  computed: {
    tooltipOverlayClassName(): ClassName {
      return [
        `${prefix}-tooltip`,
        { [`${prefix}-tooltip-${this.theme}`]: this.theme },
        this.overlayClassName,
      ];
    },
  },
  created() {
    if (this.duration) {
      this.timer = setTimeout(() => {
        this.tooltipVisible = false;
        clearTimeout(this.timer);
        this.timer = null;
      }, this.duration);
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.tooltipVisible = val;
      },
      immediate: true,
    },
  },
  methods: {
    onTipVisibleChange(val: boolean) {
      this.tooltipVisible = val;
      // 因 props={this.getPopupProps()} 已经透传 onVisibleChange props，此处不再需要使用 emitEvent
      this.$emit('visible-change', this.tooltipVisible);
    },

    getPopupProps(): PopupProps {
      const r: PopupProps = {
        showArrow: true,
        ...this.$props,
        content: () => renderTNodeJSX(this, 'content'),
        default: () => renderContent(this, 'default', 'triggerElement'),
        overlayClassName: this.tooltipOverlayClassName,
      };
      delete r.visible;
      return r;
    },
  },
  render() {
    return (
      <Popup
        visible={this.tooltipVisible}
        showArrow={this.showArrow}
        props={this.getPopupProps()}
        on={{
          'visible-change': this.onTipVisibleChange,
        }}
      ></Popup>
    );
  },
});
