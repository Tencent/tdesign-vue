import Vue from 'vue';
import {
  InfoCircleFilledIcon as TIconInfoCircleFilled,
  CheckCircleFilledIcon as TIconCheckCircleFilled,
  ErrorCircleFilledIcon as TIconErrorCircleFilled,
  HelpCircleFilledIcon as TIconHelpFill,
  LoadingIcon as TIconLoadingFill,
  CloseIcon as TIconClose,
} from '@tencent/tdesign-icons-vue';
import { prefix } from '../config';
import { THEME_LIST } from './const';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import props from './props';
import { ClassName } from '../common';

const name = `${prefix}-message`;

export default Vue.extend({
  name: 'TMessage',

  components: {
    TIconInfoCircleFilled,
    TIconCheckCircleFilled,
    TIconErrorCircleFilled,
    TIconHelpFill,
    TIconLoadingFill,
    TIconClose,
  },

  props: { ...props },

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

  methods: {
    setTimer() {
      if (!this.duration) {
        return;
      }
      this.timer = Number(setTimeout(() => {
        this.clearTimer();
        this.$emit('duration-end');
        if (this.onDurationEnd) {
          this.onDurationEnd();
        }
      }, this.duration));
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
      const defaultClose = <t-icon-close />;
      return (
        <span class={`${name}-close`} onClick={this.close}>
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
        info: TIconInfoCircleFilled,
        success: TIconCheckCircleFilled,
        warning: TIconErrorCircleFilled,
        error: TIconErrorCircleFilled,
        question: TIconHelpFill,
        loading: TIconLoadingFill,
      }[this.theme];
      return <component></component>;
    },
  },

  render() {
    return (
      <div class={ this.classes } onMouseenter={ this.clearTimer } onMouseleave={ this.setTimer }>
        { this.renderIcon() }
        { renderContent(this, 'default', 'content') }
        { this.renderClose() }
      </div>
    );
  },

});
