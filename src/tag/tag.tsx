import Vue, { VNode } from 'vue';
import CLASSNAMES from '../utils/classnames';
import { prefix } from '../config';
import TIconClose from '../icon/close';
import props from './props';
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

export default Vue.extend({
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
  },
  render() {
    // 关闭按钮 自定义组件使用 nativeOnClick 绑定事件
    const closeIcon: VNode | string = this.closable ? <TIconClose nativeOnClick={this.handleClose} /> : '';
    // 标签内容
    const tagContent: TNodeReturnValue = renderTNodeJSX(this, 'default') || renderTNodeJSX(this, 'content');
    // 图标
    let icon: VNode;
    if (typeof this.icon === 'function') {
      icon = this.icon(this.$createElement);
    }

    return (
      <span class={this.tagClass} onClick={this.handleClick}>
        {icon}
        {this.maxWidth ? <span style={this.tagStyle} class={`${name}--text`}>{tagContent}</span> : tagContent}
        {closeIcon}
      </span>
    );
  },
});
