import { VNode, h } from 'vue';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';

export interface JSXRenderContext {
  defaultNode?: VNode | string;
  params?: Record<string, any>;
  // 是否不打印 LOG
  silent?: boolean;
}

export type OptionsType = VNode | JSXRenderContext | string;

export const isVNode = (obj: OptionsType) => {
  const vNode = h('span', '');
  const VNode = vNode.constructor;
  return obj instanceof VNode;
};

export function getDefaultNode(options?: OptionsType) {
  let defaultNode;
  if (isObject(options) && 'defaultNode' in options) {
    defaultNode = options.defaultNode;
  } else if (isVNode(options) || isString(options)) {
    defaultNode = options;
  }

  return defaultNode;
}

export function getParams(options?: OptionsType) {
  return isObject(options) && 'params' in options ? options.params : null;
}
