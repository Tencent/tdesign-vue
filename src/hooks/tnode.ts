import { h, getCurrentInstance } from '@vue/composition-api';
import { VNode } from 'vue';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

export interface JSXRenderContext {
  defaultNode?: VNode | string;
  params?: Record<string, any>;
}

const isVNode = (obj: OptionsType) => {
  const vNode = h('span', '');
  const VNode = vNode.constructor;
  return obj instanceof VNode;
};

export type OptionsType = VNode | JSXRenderContext | string;

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
/**
 * 通过 JSX 的方式渲染 TNode，props 和 插槽同时处理，也能处理默认值为 true 则渲染默认节点的情况
 * 优先级：Props 大于插槽
 * 如果 props 值为 true ，则使用插槽渲染。如果也没有插槽的情况下，则使用 defaultNode 渲染
 * @example const renderTNodeJSX = useTNodeJSX()
 * @return renderTNodeJSX
 * @param name 插槽和属性名称
 * @param options 值可能为默认渲染节点，也可能是默认渲染节点和参数的集合
 * @example renderTNodeJSX('closeBtn')  优先级 props function 大于 插槽
 * @example renderTNodeJSX('closeBtn', <close-icon />)。 当属性值为 true 时则渲染 <close-icon />
 * @example renderTNodeJSX('closeBtn', { defaultNode: <close-icon />, params })。 params 为渲染节点时所需的参数
 */

export const useTNodeJSX = () => {
  const instance = getCurrentInstance();
  return function (name: string, options?: OptionsType) {
    // assemble params && defaultNode
    const params = getParams(options);
    const defaultNode = getDefaultNode(options);

    const { slots } = instance.setupContext;
    // 处理 props 类型的Node
    let propsNode;
    if (Object.keys(instance.props).includes(name)) {
      propsNode = instance.props[name];
    }

    // propsNode 为 false 不渲染
    if (propsNode === false) return;

    // 同名function和slot优先处理插槽
    if (slots[name]) {
      return slots[name](params);
    }
    if (isFunction(propsNode)) return propsNode(h, params);

    // propsNode为true则渲染defaultNode
    if (propsNode === true && defaultNode) {
      return defaultNode;
    }
    // 处理字符串类型的 propsNode
    return propsNode;
  };
};

/**
 * 在setup中，通过JSX的方式 TNode，props 和 插槽同时处理。与 renderTNodeJSX 区别在于属性值为 undefined 时会渲染默认节点
 * @example const renderTNodeJSXDefault = useTNodeDefault()
 * @return renderTNodeJSXDefault
 * @param name 插槽和属性名称
 * @example renderTNodeJSXDefault('closeBtn')
 * @example renderTNodeJSXDefault('closeBtn', <close-icon />) closeBtn 为空时，则兜底渲染 <close-icon />
 * @example renderTNodeJSXDefault('closeBtn', { defaultNode: <close-icon />, params }) 。params 为渲染节点时所需的参数
 */
export const useTNodeDefault = () => {
  const renderTNodeJSX = useTNodeJSX();
  return function (name: string, options?: VNode | JSXRenderContext) {
    const defaultNode = getDefaultNode(options);
    return renderTNodeJSX(name, options) || defaultNode;
  };
};

/**
 * 在setup中，用于处理相同名称的 TNode 渲染
 * @example const renderContent = useContent()
 * @return renderContent
 * @param name1 第一个名称，优先级高于 name2
 * @param name2 第二个名称
 * @param defaultNode 默认渲染内容：当 name1 和 name2 都为空时会启动默认内容渲染
 * @example renderContent('default', 'content')
 * @example renderContent('default', 'content', '我是默认内容')
 * @example renderContent('default', 'content', { defaultNode: '我是默认内容', params })
 */
export const useContent = () => {
  const renderTNodeJSX = useTNodeJSX();
  return function (name1: string, name2: string, options?: VNode | JSXRenderContext) {
    // assemble params && defaultNode
    const params = getParams(options);
    const defaultNode = getDefaultNode(options);

    const toParams = params ? { params } : undefined;

    const node1 = renderTNodeJSX(name1, toParams);
    const node2 = renderTNodeJSX(name2, toParams);

    const res = isEmpty(node1) ? node2 : node1;
    return isEmpty(res) ? defaultNode : res;
  };
};
