import Vue from 'vue';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import tinycolor from 'tinycolor2';
import { Color } from 'tvision-color';
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
        `${this.componentName}--${this.variant}`,
        this.shape !== 'square' && `${this.componentName}--${this.shape}`,
        {
          [this.commonSizeClassName[this.size]]: this.size !== 'medium',
          [`${this.componentName}--ellipsis`]: this.maxWidth,
          [`${this.componentName}--close`]: this.closable,
          [`${this.classPrefix}-is-disabled`]: this.disabled,
          [`${this.componentName}--disabled`]: this.disabled,
        },
      ];
    },
    textStyle(): Styles {
      if (this.maxWidth) {
        return {
          maxWidth: isNaN(Number(this.maxWidth)) ? this.maxWidth : `${this.maxWidth}px`,
        };
      }
      return {};
    },
    tagStyle(): Styles {
      if (this.color) {
        const luminance = tinycolor(this.color).getLuminance();

        const style: Styles = {
          color: luminance > 0.5 ? 'black' : 'white',
        };

        if (this.variant === 'outline' || this.variant === 'light-outline') {
          style.borderColor = this.color;
        }
        if (this.variant !== 'outline') {
          const getLightestShade = () => {
            const [{ colors }] = Color.getColorGradations({
              colors: [tinycolor(this.color).toHex()],
              step: 10,
              remainInput: true,
            });
            return colors[0];
          };
          style.backgroundColor = this.variant === 'dark' ? this.color : getLightestShade();
        }
        if (this.variant !== 'dark') {
          style.color = this.color;
        }
        return style;
      }
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

    const title = typeof tagContent === 'string' ? tagContent : '';
    const titleAttribute = title && this.maxWidth ? { title } : undefined;
    // 图标
    const icon = renderTNodeJSX(this, 'icon');
    return (
      <div class={this.tagClass} onClick={this.handleClick} style={this.tagStyle}>
        {icon}
        <span
          class={this.maxWidth ? `${this.componentName}--text` : undefined}
          style={this.textStyle}
          attrs={titleAttribute}
        >
          {tagContent}
        </span>
        {!this.disabled ? closeIcon : undefined}
      </div>
    );
  },
});
