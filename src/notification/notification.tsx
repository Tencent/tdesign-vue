import Vue, { CreateElement } from 'vue';
import isFunction from 'lodash/isFunction';
import {
  InfoCircleFilledIcon as TIconInfoCircleFilled,
  CheckCircleFilledIcon as TIconCheckCircleFilled,
  CloseIcon as TIconClose,
} from 'tdesign-icons-vue';
import { prefix } from '../config';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import props from './props';
import { TNodeReturnValue } from '../common';

const name = `${prefix}-notification`;

export default Vue.extend({
  name: 'TNotification',
  components: {
    TIconInfoCircleFilled,
    TIconCheckCircleFilled,
    TIconClose,
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
        const iconType = this.theme === 'success'
          ? (<t-icon-check-circle-filled class={`t-is-${this.theme}`} />)
          : (<t-icon-info-circle-filled class={`t-is-${this.theme}`} />);
        icon = (<div class='t-notification__icon'>
          {iconType}
        </div>);
      }
      return icon;
    },
    renderClose() {
      const defaultClose = <t-icon-close />;
      return (
        <span class='t-message-close' onClick={this.close}>
          {renderTNodeJSX(this, 'closeBtn', defaultClose)}
        </span>
      );
    },
    renderContent() {
      return (
        <div class={`${name}__content`}>
          {renderContent(this, 'default', 'content')}
        </div>
      );
    },
  },
  render(h: CreateElement) {
    const icon = this.renderIcon(h);
    const close = this.renderClose();
    const content = this.renderContent();
    const footer = renderTNodeJSX(this, 'footer');
    const title = renderTNodeJSX(this, 'title');

    return (
      <div class={`${name}`}>
        {icon}
        <div class={`${name}__main`}>
          <div class={`${name}__title__wrap`}>
            <span class={`${name}__title`}>{title}</span>
            {close}
          </div>
          {content}
          {footer}
        </div>
      </div>
    );
  },
});
