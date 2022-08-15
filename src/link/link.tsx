import { VNode } from 'vue';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import props from './props';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('link');

export default mixins(classPrefixMixins).extend({
  name: 'TLink',
  props,
  methods: {
    handleClick(e: MouseEvent): void {
      if (this.disabled) return;
      this.$emit('click', e);
      this.onClick?.(e);
    },
  },
  render(): VNode {
    const linkContent = renderContent(this, 'default', 'content');
    const prefixContent = renderTNodeJSX(this, 'prefixIcon');
    const suffixContent = renderTNodeJSX(this, 'suffixIcon');
    const linkClass = [
      this.componentName,
      this.commonSizeClassName[this.size],
      `${this.componentName}--theme-${this.theme}`,
      {
        [this.commonStatusClassName.disabled]: this.disabled,
        [`${this.classPrefix}-is-underline`]: this.underline,
        [`${this.componentName}--hover-${this.hover}`]: !this.disabled,
      },
    ];

    return (
      <a
        class={linkClass}
        href={this.disabled || !this.href ? undefined : this.href}
        target={this.target}
        onClick={this.handleClick}
      >
        {prefixContent && <span class={`${this.componentName}__prefix-icon`}>{prefixContent}</span>}
        {linkContent}
        {suffixContent && <span class={`${this.componentName}__suffix-icon`}>{suffixContent}</span>}
      </a>
    );
  },
});
