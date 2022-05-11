import Vue from 'vue';
import isFunction from 'lodash/isFunction';
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
      x: 0,
      offsetX: 0,
      tooltipVisible: false,
    };
  },
  computed: {
    tooltipOverlayClassName(): ClassName {
      return [`${prefix}-tooltip`, { [`${prefix}-tooltip--${this.theme}`]: this.theme }, this.overlayClassName];
    },
    tooltipOverlayStyle(): PopupProps['overlayStyle'] {
      if (this.placement !== 'mouse' || this.offsetX === 0) {
        return this.overlayStyle;
      }
      const offsetStyle = (triggerEl: HTMLElement) => ({
        transform: `translateX(${this.offsetX - triggerEl.getBoundingClientRect().left}px)`,
      });
      if (this.overlayStyle) {
        return (triggerEl: HTMLElement, popupEl: HTMLElement) => ({
          ...offsetStyle(triggerEl),
          ...(isFunction(this.overlayStyle) ? this.overlayStyle(triggerEl, popupEl) : this.overlayStyle),
        });
      }
      return offsetStyle;
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
  mounted() {
    window?.addEventListener('mousemove', this.onMouseMove, { passive: true });
  },
  destroyed() {
    window?.removeEventListener('mousemove', this.onMouseMove);
  },
  methods: {
    onMouseMove(e: MouseEvent) {
      this.x = e.clientX;
    },

    onTipVisibleChange(val: boolean, ctx?: PopupVisibleChangeContext) {
      // 因 props={this.getPopupProps()} 已经透传 onVisibleChange props，此处不再需要使用 emitEvent
      if (this.timer && ctx?.trigger !== 'document') return;
      if (val) this.offsetX = this.x;
      this.$emit('visible-change', val);
    },

    getPopupProps(): PopupProps {
      const r: PopupProps = {
        ...this.$props,
        showArrow: this.placement === 'mouse' ? false : this.showArrow,
        placement: this.placement === 'mouse' ? 'bottom-left' : this.placement,
        content: () => renderTNodeJSX(this, 'content'),
        default: () => renderContent(this, 'default', 'triggerElement'),
        overlayClassName: this.tooltipOverlayClassName,
        overlayStyle: this.tooltipOverlayStyle,
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
