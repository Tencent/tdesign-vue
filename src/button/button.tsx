import { VNode, CreateElement } from 'vue';
import TLoading from '../loading';
import props from './props';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import ripple from '../utils/ripple';
import { getKeepAnimationMixins, getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const keepAnimationMixins = getKeepAnimationMixins();
const classPrefixMixins = getClassPrefixMixins('button');

export default mixins(keepAnimationMixins, classPrefixMixins).extend({
  name: 'TButton',

  props,

  directives: { ripple },

  render(h: CreateElement): VNode {
    let buttonContent = renderContent(this, 'default', 'content');
    const icon = this.loading ? <TLoading inheritColor={true} /> : renderTNodeJSX(this, 'icon');
    const disabled = this.disabled || this.loading;

    let { theme } = this;

    if (!this.theme) {
      if (this.variant === 'base') {
        theme = 'primary';
      } else {
        theme = 'default';
      }
    }

    const buttonClass = [
      `${this.componentName}`,
      this.commonSizeClassName[this.size],
      `${this.componentName}--variant-${this.variant}`,
      `${this.componentName}--theme-${theme}`,
      {
        [this.commonStatusClassName.disabled]: this.disabled,
        [this.commonStatusClassName.loading]: this.loading,
        [`${this.componentName}--shape-${this.shape}`]: this.shape !== 'rectangle',
        [`${this.componentName}--ghost`]: this.ghost,
        [this.commonSizeClassName.block]: this.block,
      },
    ];

    buttonContent = buttonContent ? <span class={`${this.componentName}__text`}>{buttonContent}</span> : '';
    if (icon) {
      buttonContent = [icon, buttonContent];
    }

    const on = { ...this.$listeners };
    if (typeof this.onClick === 'function') {
      on.click = this.onClick;
    }

    const buttonAttrs = {
      type: this.type,
      disabled,
      href: this.href,
    };

    const renderTag = () => {
      if (!this.tag && this.href) return 'a';
      return this.tag || 'button';
    };

    return h(
      renderTag(),
      {
        class: buttonClass,
        attrs: buttonAttrs,
        on,
        directives: [{ name: 'ripple', value: this.keepAnimation.ripple }],
      },
      [buttonContent],
    );
  },
});
