import Vue from 'vue';
import {
  InfoCircleFilledIcon,
  CheckCircleFilledIcon,
  ErrorCircleFilledIcon,
  HelpCircleFilledIcon,
  CloseIcon,
} from 'tdesign-icons-vue';
import Loading from '../loading';
import { prefix } from '../config';
import { THEME_LIST } from './const';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import props from './props';
import { ClassName } from '../common';
import { fadeIn, fadeOut } from './animation';

const name = `${prefix}-message`;

export default Vue.extend({
  name: 'TMessage',

  components: {
    InfoCircleFilledIcon,
    CheckCircleFilledIcon,
    ErrorCircleFilledIcon,
    HelpCircleFilledIcon,
    CloseIcon,
    Loading,
  },

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
        status[`${prefix}-is-${t}`] = this.theme === t;
      });
      return [
        name,
        status,
        {
          [`${prefix}-is-closable`]: this.closeBtn || this.$scopedSlots.closeBtn,
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
          });
          if (this.onDurationEnd) {
            this.onDurationEnd();
          }
        }, this.duration),
      );
    },
    clearTimer() {
      this.duration && clearTimeout(this.timer);
    },
    close(e?: MouseEvent) {
      this.$emit('close-btn-click', { e });
      if (this.onCloseBtnClick) {
        this.onCloseBtnClick({ e });
      }
    },
    renderClose() {
      const defaultClose = <close-icon />;
      return (
        <span class={`${name}__close`} onClick={this.close}>
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
