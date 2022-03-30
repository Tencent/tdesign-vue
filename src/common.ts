/** Vue2 特有全局变量 */

export type TNodeReturnValue = import('vue/types/vnode').ScopedSlotReturnValue;
export type TNode<T = undefined> = T extends undefined
  ? (h: Vue.CreateElement) => TNodeReturnValue
  : (h: Vue.CreateElement, props: T) => TNodeReturnValue;

export type JsxNode = TNodeReturnValue;

export type AttachNodeReturnValue = HTMLElement | Element | Document;
export type AttachNode = CSSSelector | ((triggerNode?: HTMLElement) => AttachNodeReturnValue);

// 与滚动相关的容器类型，因为 document 上没有 scroll 相关属性, 因此排除document
export type ScrollContainerElement = Window | HTMLElement;
export type ScrollContainer = (() => ScrollContainerElement) | CSSSelector;

export type FormResetEvent = Event;
// export type FormSubmitEvent = SubmitEvent; (for higher typescript version)
export type FormSubmitEvent = Event;

export interface Styles {
  [css: string]: string | number;
}
/** 通用全局变量 */

export type OptionData = {
  label?: string;
  value?: string | number;
} & { [key: string]: any };

export type TreeOptionData = {
  children?: Array<TreeOptionData>;
} & OptionData;

export type SizeEnum = 'small' | 'medium' | 'large';

export type HorizontalAlignEnum = 'left' | 'center' | 'right';

export type VerticalAlignEnum = 'top' | 'middle' | 'bottom';

export type ClassName = { [className: string]: any } | ClassName[] | string;

export type CSSSelector = string;

export interface KeysType {
  value?: string;
  label?: string;
}

export interface HTMLElementAttributes {
  [css: string]: string;
}
