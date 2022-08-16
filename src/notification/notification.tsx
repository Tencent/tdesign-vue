import { CreateElement } from 'vue';
import isFunction from 'lodash/isFunction';
import { InfoCircleFilledIcon, CheckCircleFilledIcon, CloseIcon } from 'tdesign-icons-vue';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import props from './props';
import { TNodeReturnValue } from '../common';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('notification');

export default mixins(classPrefixMixins).extend({
  name: 'TNotification',
  components: {
    InfoCircleFilledIcon,
    CheckCircleFilledIcon,
    CloseIcon,
  },
  props: { ...props },
  mounted() {
    if (this.duration > 0) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        this.$emit('duration-end');
        if (this.onDurationEnd) {
          this.onDurationEnd();
        }
      }, this.duration);
    }
  },
  methods: {
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
        const iconType = this.theme === 'success' ? (
            <check-circle-filled-icon class={`${this.classPrefix}-is-${this.theme}`} />
        ) : (
            <info-circle-filled-icon class={`${this.classPrefix}-is-${this.theme}`} />
        );
        icon = <div class={`${this.componentName}__icon`}>{iconType}</div>;
      }
      return icon;
    },
    renderClose() {
      const defaultClose = <close-icon />;
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
      <div class={`${this.componentName}`}>
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
