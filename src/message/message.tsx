import {
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
  HelpCircleFilledIcon as TdHelpCircleFilledIcon,
  CloseIcon as TdCloseIcon,
} from 'tdesign-icons-vue';
import Loading from '../loading';
import { THEME_LIST } from './const';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import props from './props';
import { ClassName } from '../common';
import { fadeIn, fadeOut } from './animation';
import { getClassPrefixMixins, getGlobalIconMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('message');

export default mixins(classPrefixMixins, getGlobalIconMixins()).extend({
  name: 'TMessage',

  props: {
    ...props,
    placement: String, // just for animation
  },

  data() {
    return {
      timer: null,
    };
  },

  computed: {
    classes(): ClassName {
      const status = {};
      THEME_LIST.forEach((t) => {
        status[`${this.classPrefix}-is-${t}`] = this.theme === t;
      });
      return [
        this.componentName,
        status,
        {
          [`${this.classPrefix}-is-closable`]: this.closeBtn || this.$scopedSlots.closeBtn,
        },
      ];
    },
  },

  created() {
    this.duration && this.setTimer();
  },

  mounted() {
    const msgDom = this.$refs.msg as HTMLElement;
    fadeIn(msgDom, this.$props.placement);
  },

  methods: {
    setTimer() {
      if (!this.duration) {
        return;
      }
      this.timer = Number(
        setTimeout(() => {
          this.clearTimer();
          const msgDom = this.$refs.msg as HTMLElement;
          fadeOut(msgDom, this.$props.placement, () => {
            this.$emit('duration-end');
            this.$emit('close');
          });
          this.onDurationEnd?.();
          this.onClose?.({ trigger: 'duration-end' });
        }, this.duration),
      );
    },
    clearTimer() {
      this.duration && clearTimeout(this.timer);
    },
    close(e?: MouseEvent) {
      this.$emit('close-btn-click', { e });
      this.$emit('close');
      this.onCloseBtnClick?.({ e });
      this.onClose?.({ trigger: 'close-click', e });
    },
    renderClose() {
      const { CloseIcon } = this.useGlobalIcon({
        CloseIcon: TdCloseIcon,
      });
      const defaultClose = <CloseIcon />;
      return (
        <span class={`${this.componentName}__close`} onClick={this.close}>
          {renderTNodeJSX(this, 'closeBtn', defaultClose)}
        </span>
      );
    },
    renderIcon() {
      if (this.icon === false) return;
      if (typeof this.icon === 'function') return this.icon(this.$createElement);
      if (this.$scopedSlots.icon) {
        return this.$scopedSlots.icon(null);
      }
      const {
        InfoCircleFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon, HelpCircleFilledIcon,
      } = this.useGlobalIcon({
        InfoCircleFilledIcon: TdInfoCircleFilledIcon,
        CheckCircleFilledIcon: TdCheckCircleFilledIcon,
        ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
        HelpCircleFilledIcon: TdHelpCircleFilledIcon,
      });
      const component = {
        info: InfoCircleFilledIcon,
        success: CheckCircleFilledIcon,
        warning: ErrorCircleFilledIcon,
        error: ErrorCircleFilledIcon,
        question: HelpCircleFilledIcon,
        loading: Loading,
      }[this.theme];
      return <component></component>;
    },
  },

  render() {
    return (
      <div ref="msg" class={this.classes} onMouseenter={this.clearTimer} onMouseleave={this.setTimer}>
        {this.renderIcon()}
        {renderContent(this, 'default', 'content')}
        {this.renderClose()}
      </div>
    );
  },
});
