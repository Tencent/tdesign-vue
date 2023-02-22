import isFunction from 'lodash/isFunction';
import props from './props';
import popupProps from '../popup/props';
import Popup from '../popup/popup';
import { PopupProps, PopupVisibleChangeContext } from '../popup';
import { ClassName } from '../common';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('tooltip');

type PopupInstanceType = InstanceType<typeof Popup>;

export default mixins(classPrefixMixins).extend({
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
      return [this.componentName, { [`${this.componentName}--${this.theme}`]: this.theme }, this.overlayClassName];
    },
    tooltipOverlayInnerStyle(): PopupProps['overlayInnerStyle'] {
      if (this.placement !== 'mouse' || this.offsetX === 0) {
        return this.overlayInnerStyle;
      }
      const offsetStyle = (triggerEl: HTMLElement) => ({
        transform: `translateX(${this.offsetX - triggerEl.getBoundingClientRect().left}px)`,
      });
      if (this.overlayInnerStyle) {
        return (triggerEl: HTMLElement, popupEl: HTMLElement) => ({
          ...offsetStyle(triggerEl),
          ...(isFunction(this.overlayInnerStyle) ? this.overlayInnerStyle(triggerEl, popupEl) : this.overlayInnerStyle),
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
        overlayInnerStyle: this.tooltipOverlayInnerStyle,
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
