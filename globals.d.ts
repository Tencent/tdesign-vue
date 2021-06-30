
/** Vue2 特有全局变量 */

declare const __VERSION__: string;

declare type TNodeReturnValue = import('vue/types/vnode').ScopedSlotReturnValue;
declare type TNode<T = any> = (h: Vue.CreateElement, props?: T) => TNodeReturnValue;
declare type JsxNode = TNodeReturnValue;

declare type AttachNodeReturnValue = HTMLElement | Element | Document;
declare type AttachNode = CSSSelector | (() => AttachNodeReturnValue);

// 与滚动相关的容器类型，因为 document 上没有 scroll 相关属性, 因此排除document
declare type ScrollContainerElement = Window | HTMLElement
declare type ScrollContainer = (() => ScrollContainerElement) | CSSSelector;

declare type FormResetEvent = Event;
declare type FormSubmitEvent = SubmitEvent;

declare interface Styles {
  [css: string]: string | number;
}

declare module '@tencent/tdesign-vue' {
  export * from 'src';
}

/** 通用全局变量 */

declare type OptionData = {
  label?: string;
  value?: string | number;
} & { [key: string]: any };

declare type TreeOptionData = {
  children?: Array<TreeOptionData>;
} & OptionData;

declare type SizeEnum = 'small' | 'medium' | 'large';

declare type HorizontalAlignEnum = 'left' | 'center' | 'right';

declare type VerticalAlignEnum = 'top' | 'middle' | 'bottom';

declare type ClassName = { [className: string]: any } | ClassName[] | string;

declare type CSSSelector = string;
