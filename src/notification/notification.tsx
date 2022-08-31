import { CreateElement } from 'vue';
import isFunction from 'lodash/isFunction';
import {
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  CloseIcon as TdCloseIcon,
} from 'tdesign-icons-vue';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import props from './props';
import { TNodeReturnValue } from '../common';
import { getClassPrefixMixins, getGlobalIconMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('notification');

export default mixins(classPrefixMixins, getGlobalIconMixins()).extend({
  name: 'TNotification',
  props: { ...props },
  data() {
    return {
      timer: null,
    };
  },
  created() {
    this.duration && this.setTimer();
  },
  methods: {
    setTimer() {
      if (!this.duration) {
        return;
      }
      this.timer = Number(
        setTimeout(() => {
          this.clearTimer();
          this.$emit('duration-end');
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
    renderIcon(h: CreateElement) {
      let icon: TNodeReturnValue;
      if (this.icon === false) return null;
      if (isFunction(this.icon)) {
        icon = this.icon(h);
      } else if (this.$scopedSlots.icon) {
        icon = this.$scopedSlots.icon(null);
      } else if (this.theme) {
        const { InfoCircleFilledIcon, CheckCircleFilledIcon } = this.useGlobalIcon({
          InfoCircleFilledIcon: TdInfoCircleFilledIcon,
          CheckCircleFilledIcon: TdCheckCircleFilledIcon,
        });
        const iconType = this.theme === 'success' ? (
            <CheckCircleFilledIcon class={`${this.classPrefix}-is-${this.theme}`} />
        ) : (
            <InfoCircleFilledIcon class={`${this.classPrefix}-is-${this.theme}`} />
        );
        icon = <div class={`${this.componentName}__icon`}>{iconType}</div>;
      }
      return icon;
    },
    renderClose() {
      const { CloseIcon } = this.useGlobalIcon({
        CloseIcon: TdCloseIcon,
      });
      const defaultClose = <CloseIcon />;
      return (
        <span class={`${this.classPrefix}-message__close`} onClick={this.close}>
          {renderTNodeJSX(this, 'closeBtn', defaultClose)}
        </span>
      );
    },
    renderContent() {
      return <div class={`${this.componentName}__content`}>{renderContent(this, 'default', 'content')}</div>;
    },
  },
  render(h: CreateElement) {
    const icon = this.renderIcon(h);
    const close = this.renderClose();
    const content = this.renderContent();
    const footer = renderTNodeJSX(this, 'footer');
    const title = renderTNodeJSX(this, 'title');

    return (
      <div class={`${this.componentName}`} onMouseenter={this.clearTimer} onMouseleave={this.setTimer}>
        {icon}
        <div class={`${this.componentName}__main`}>
          <div class={`${this.componentName}__title__wrap`}>
            <span class={`${this.componentName}__title`}>{title}</span>
            {close}
          </div>
          {content}
          {footer}
        </div>
      </div>
    );
  },
});
