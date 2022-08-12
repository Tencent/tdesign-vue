import Vue, { VNode } from 'vue';
import { prefix } from '../config';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import CLASSNAMES from '../utils/classnames';
import props from './props';

const name = `${prefix}-link`;

export default Vue.extend({
  name: 'TLink',
  props,
  render(): VNode {
    const linkContent = renderContent(this, 'default', 'content');
    const prefixContent = renderTNodeJSX(this, 'prefixIcon');
    const suffixContent = renderTNodeJSX(this, 'suffixIcon');
    const linkClass = [
      `${name}`,
      CLASSNAMES.SIZE[this.size],
      `${name}--theme-${this.theme}`,
      {
        [CLASSNAMES.STATUS.disabled]: this.disabled,
        [`${prefix}-is-underline`]: this.underline,
        [`${name}--hover-${this.hover}`]: !this.disabled,
      },
    ];

    const on = { ...this.$listeners };
    if (typeof this.onClick === 'function') {
      if (!this.disabled) {
        on.click = this.onClick;
      }
    }

    return (
      <a class={linkClass} href={this.disabled || !this.href ? undefined : this.href} target={this.target} {...{ on }}>
        {prefixContent && <span class={`${name}__prefix-icon`}>{prefixContent}</span>}
        {linkContent}
        {suffixContent && <span class={`${name}__suffix-icon`}>{suffixContent}</span>}
      </a>
    );
  },
});
