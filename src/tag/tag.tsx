import Vue from 'vue';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import props from './props';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { TagConfig, getGlobalIconMixins } from '../config-provider/config-receiver';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import { TdTagProps } from './type';
import { emitEvent } from '../utils/event';
import { TNodeReturnValue, ClassName, Styles } from '../common';

export default mixins(getConfigReceiverMixins<Vue, TagConfig>('tag'), getGlobalIconMixins()).extend({
  name: 'TTag',

  props: { ...props },

  computed: {
    tagClass(): ClassName {
      return [
        `${this.componentName}`,
        `${this.componentName}--${this.theme}`,
        this.commonSizeClassName[this.size],
        `${this.componentName}--${this.variant}`,
        this.shape !== 'square' && `${this.componentName}--${this.shape}`,
        {
          [`${this.componentName}--ellipsis`]: this.maxWidth,
          [`${this.componentName}--close`]: this.closable,
          [`${this.classPrefix}-is-disabled`]: this.disabled,
          [`${this.componentName}--disabled`]: this.disabled,
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
      const iconClassName = `${this.classPrefix}-tag__icon-close`;
      if (this.global.closeIcon) {
        return this.global.closeIcon((component, b) => {
          const tProps = typeof b === 'object' && 'attrs' in b ? b.attrs : {};
          return this.$createElement(component, {
            props: { ...tProps },
            class: iconClassName,
            nativeOn: {
              click: this.handleClose,
            },
          });
        });
      }
      const { CloseIcon } = this.useGlobalIcon({ CloseIcon: TdCloseIcon });

      return <CloseIcon nativeOnClick={this.handleClose} class={iconClassName} />;
    },
  },

  render() {
    // 关闭按钮 自定义组件使用 nativeOnClick 绑定事件
    const closeIcon = this.getCloseIcon();
    // 标签内容
    const tagContent: TNodeReturnValue = renderContent(this, 'default', 'content');
    const tagContentWithMaxWidth = (
      <span style={this.tagStyle} class={`${this.componentName}--text`}>
        {tagContent}
      </span>
    );
    // 图标
    const icon = renderTNodeJSX(this, 'icon');

    return (
      <span class={this.tagClass} onClick={this.handleClick}>
        {icon}
        {this.maxWidth ? tagContentWithMaxWidth : tagContent}
        {closeIcon}
      </span>
    );
  },
});
