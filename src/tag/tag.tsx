import Vue from 'vue';
import { CloseIcon } from 'tdesign-icons-vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import CLASSNAMES from '../utils/classnames';
import { prefix } from '../config';
import props from './props';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { TagConfig } from '../config-provider/config-receiver';
import { renderTNodeJSX } from '../utils/render-tnode';
import { TdTagProps } from './type';
import { emitEvent } from '../utils/event';
import { TNodeReturnValue, ClassName, Styles } from '../common';

const name = `${prefix}-tag`;

const initVariantList = {
  dark: `${name}--dark`,
  light: `${name}--light`,
  plain: `${name}--plain`,
};

const initShapeList = {
  square: `${name}--square`,
  round: `${name}--round`,
  mark: `${name}--mark`,
};

const defaultShape = 'square';

export default mixins(getConfigReceiverMixins<Vue, TagConfig>('tag')).extend({
  name: 'TTag',

  props: { ...props },

  computed: {
    tagClass(): ClassName {
      return [
        `${name}`,
        `${name}--${this.theme}`,
        CLASSNAMES.SIZE[this.size],
        initVariantList[this.variant],
        this.shape !== defaultShape && initShapeList[this.shape],
        {
          [`${name}--ellipsis`]: this.maxWidth,
          [`${name}--close`]: this.closable,
          [`${prefix}-is-disabled`]: this.disabled,
          [`${name}--disabled`]: this.disabled,
        },
      ];
    },
    tagStyle(): Styles {
      if (this.maxWidth) return { maxWidth: `${this.maxWidth}px` };
      return {};
    },
  },

  methods: {
    handleClose(e: MouseEvent): void {
      if (this.disabled) return;
      emitEvent<Parameters<TdTagProps['onClose']>>(this, 'close', { e });
    },
    handleClick(e: MouseEvent): void {
      if (this.disabled) return;
      emitEvent<Parameters<TdTagProps['onClick']>>(this, 'click', { e });
    },
    getCloseIcon(): ScopedSlotReturnValue {
      if (!this.closable) return null;
      const iconClassName = `${prefix}-tag__icon-close`;
      if (this.global.closeIcon) {
        return this.global.closeIcon((component, b) => {
          const tProps = (typeof b === 'object' && ('attrs' in b)) ? b.attrs : {};
          return this.$createElement(component, {
            props: { ...tProps },
            class: iconClassName,
          });
        });
      }
      return <CloseIcon nativeOnClick={this.handleClose} class={iconClassName} />;
    },
  },

  render() {
    // 关闭按钮 自定义组件使用 nativeOnClick 绑定事件
    const closeIcon = this.getCloseIcon();
    // 标签内容
    const tagContent: TNodeReturnValue = renderTNodeJSX(this, 'default') || renderTNodeJSX(this, 'content');
    // 图标
    const icon = renderTNodeJSX(this, 'icon');

    return (
      <span class={this.tagClass} onClick={this.handleClick}>
        {icon}
        {this.maxWidth ? <span style={this.tagStyle} class={`${name}--text`}>{tagContent}</span> : tagContent}
        {closeIcon}
      </span>
    );
  },
});
