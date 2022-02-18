import Vue from 'vue';
import { prefix } from '../config';
import props from './props';
import popupProps from '../popup/props';
import Popup from '../popup/popup';
import { PopupProps, PopupVisibleChangeContext } from '../popup';
import { ClassName } from '../common';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';

type PopupInstanceType = InstanceType<typeof Popup>;

export default Vue.extend({
  name: 'TTooltip',
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
      return [`${prefix}-tooltip`, { [`${prefix}-tooltip--${this.theme}`]: this.theme }, this.overlayClassName];
    },
  },
  watch: {
    visible(visible) {
      // clear timer when tooltip is hidden before duration ends
      if (this.timer && !visible) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
  },
  created() {
    if (this.duration && this.visible) {
      this.timer = setTimeout(() => {
        this.$emit('visible-change', false);
        clearTimeout(this.timer);
        this.timer = null;
      }, this.duration);
    }
  },
  methods: {
    onTipVisibleChange(val: boolean, ctx?: PopupVisibleChangeContext) {
      // 因 props={this.getPopupProps()} 已经透传 onVisibleChange props，此处不再需要使用 emitEvent
      if (this.timer && ctx?.trigger !== 'document') return;
      this.$emit('visible-change', val);
    },

    getPopupProps(): PopupProps {
      const r: PopupProps = {
        showArrow: true,
        ...this.$props,
        content: () => renderTNodeJSX(this, 'content'),
        default: () => renderContent(this, 'default', 'triggerElement'),
        overlayClassName: this.tooltipOverlayClassName,
      };
      // delete r.visible;
      return r;
    },
    updatedTooltip() {
      this.$refs.popup && (this.$refs.popup as PopupInstanceType).updatePopper();
    },
  },
  render() {
    return (
      <Popup
        ref="popup"
        visible={this.visible}
        props={this.getPopupProps()}
        on={{
          'visible-change': this.onTipVisibleChange,
        }}
      ></Popup>
    );
  },
});
