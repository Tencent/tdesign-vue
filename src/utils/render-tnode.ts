import Vue from 'vue';
import { ComponentRenderProxy, h } from '@vue/composition-api';
import {
  PropType, CreateElement, VNode, VNodeChildren, RenderContext,
} from 'vue/types/umd';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
// import isObject from 'lodash/isObject';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import { TNode } from '../common';

// 组件render属性的ts类型
type RenderTsTypesSimple = string | number | boolean;
type RenderTsTypesObject = Record<string, any> | Array<any>;
type RenderTsTypes = VNode | VNodeChildren | TNode | RenderTsTypesSimple | RenderTsTypesObject;
// 组件render属性的js类型
const RenderJsTypes = [Function, String, Number, Boolean, Object, Array];

// 定义组件内容的渲染方式
enum RenderWay {
  Text = 'text',
  JsonString = 'jsonstring',
  VNode = 'vnode',
  Unknown = 'unknown',
}

export type VmType = Vue | ComponentRenderProxy;

// 同时支持驼峰命名和中划线命名的插槽，示例：value-display 和 valueDisplay
export function handleSlots(vm: VmType, params: Record<string, any>, name: string) {
  // 检查是否存在 驼峰命名 的插槽
  let node = vm.$scopedSlots[camelCase(name)]?.(params || h);
  if (node) return node;
  // 检查是否存在 中划线命名 的插槽
  node = vm.$scopedSlots[kebabCase(name)]?.(params || h);
  if (node) return node;
  return null;
}

/**
 * 根据传入的值（对象），判断渲染该值（对象）的方式
 * @param value 传入的值（对象）
 */
const getValueRenderWay = (value: RenderTsTypes): RenderWay => {
  // 简单类型
  if (['string', 'number', 'boolean'].includes(typeof value)) return RenderWay.Text;
  // 复杂对象
  if (typeof value === 'object') {
    // 虚拟dom对象
    if (!(value instanceof Array) && value && value.context instanceof Vue) {
      return RenderWay.VNode;
    }
    // 其他复杂对象或数组
    return RenderWay.JsonString;
  }
  // 未知类型（兜底）
  return RenderWay.Unknown;
};

// 通过template的方式渲染TNode
export const RenderTNodeTemplate = Vue.extend({
  name: 'render-tnode-template',
  functional: true,
  props: {
    render: RenderJsTypes as PropType<RenderTsTypes>,
    params: null as PropType<any>,
  },
  render(h: CreateElement, ctx: RenderContext): VNode {
    const { render, params } = ctx.props;
    const renderResult = typeof render === 'function' ? render(h, params) : render;
    const renderWay = getValueRenderWay(renderResult);

    // @ts-ignore
    const renderText = (c: RenderTsTypesSimple | RenderTsTypesObject) => ctx.__proto__._v(c);
    const renderMap = {
      [RenderWay.Text]: (c: RenderTsTypesSimple) => renderText(c),
      [RenderWay.JsonString]: (c: RenderTsTypesObject) => renderText(JSON.stringify(c, null, 2)),
      [RenderWay.VNode]: (c: VNode) => c,
    };

    return renderMap[renderWay] ? renderMap[renderWay](renderResult) : h();
  },
});

interface JSXRenderContext {
  defaultNode?: VNode;
  params?: Record<string, any>;
  // 是否不打印 LOG
  silent?: boolean;
}

/**
 * 通过JSX的方式渲染 TNode，props 和 插槽同时处理，也能处理默认值为 true 则渲染默认节点的情况
 * @param vm 组件实例
 * @param name 插槽和属性名称
 * @param options 值可能为默认渲染节点，也可能是默认渲染节点和参数的集合
 * @example renderTNodeJSX(this, 'closeBtn')  优先级 props function 大于 插槽
 * @example renderTNodeJSX(this, 'closeBtn', <t-icon-close />)。 当属性值为 true 时则渲染 <t-icon-close />
 * @example renderTNodeJSX(this, 'closeBtn', { defaultNode: <t-icon-close />, params })。 params 为渲染节点时所需的参数
 */
export const renderTNodeJSX = (vm: VmType, name: string, options?: ScopedSlotReturnValue | JSXRenderContext) => {
  // 是否静默日志
  // const isSilent = Boolean(isObject(options) && 'silent' in options && options.silent);

  // if (vm.$scopedSlots[name] && vm[name] && vm[name] !== true && !isSilent) {
  //   console.warn(`Both $scopedSlots.${name} and $props.${name} exist, $props.${name} is preferred`);
  // }
  const params = typeof options === 'object' && 'params' in options ? options.params : null;
  const defaultNode = typeof options === 'object' && 'defaultNode' in options ? options.defaultNode : options;
  const propsNode = vm[name];
  if (propsNode === false) return;
  if (propsNode === true && defaultNode) {
    return handleSlots(vm, params, name) || defaultNode;
  }
  if (typeof propsNode === 'function') return propsNode(vm.$createElement, params);
  const isPropsEmpty = [undefined, params, ''].includes(propsNode);
  // Props 为空，但插槽存在
  if (isPropsEmpty && (vm.$scopedSlots[camelCase(name)] || vm.$scopedSlots[kebabCase(name)])) {
    return handleSlots(vm, params, name);
  }
  return propsNode;
};

/**
 * 通过JSX的方式渲染 TNode，props 和 插槽同时处理。与 renderTNodeJSX 区别在于 属性值为 undefined 时会渲染默认节点
 * @param vm 组件实例
 * @param name 插槽和属性名称
 * @example renderTNodeJSXDefault(this, 'closeBtn')
 * @example renderTNodeJSXDefault(this, 'closeBtn', <t-icon-close />)。this.closeBtn 为空时，则兜底渲染 <t-icon-close />
 * @example renderTNodeJSXDefault(this, 'closeBtn', { defaultNode: <t-icon-close />, params }) 。params 为渲染节点时所需的参数
 */
export const renderTNodeJSXDefault = (vm: VmType, name: string, options?: ScopedSlotReturnValue | JSXRenderContext) => {
  const defaultNode = typeof options === 'object' && 'defaultNode' in options ? options.defaultNode : options;
  return renderTNodeJSX(vm, name, options) || defaultNode;
};

/**
 * 用于处理相同名称的 TNode 渲染
 * @param vm 组件实例
 * @param name1 第一个名称，优先级高于 name2
 * @param name2 第二个名称
 * @param defaultNode 默认渲染内容：当 name1 和 name2 都为空时会启动默认内容渲染
 * @example renderContent(this, 'default', 'content')
 * @example renderContent(this, 'default', 'content', '我是默认内容')
 * @example renderContent(this, 'default', 'content', { defaultNode: '我是默认内容', params })
 */
export const renderContent = (vm: VmType, name1: string, name2: string, options?: VNode | JSXRenderContext) => {
  const params = typeof options === 'object' && 'params' in options ? options.params : null;
  let defaultNode = typeof options === 'object' && 'defaultNode' in options && options.defaultNode;
  defaultNode = typeof options === 'object' && 'context' in options && options;
  const toParams = params ? { params } : undefined;
  const node1 = renderTNodeJSX(vm, name1, toParams);
  const node2 = renderTNodeJSX(vm, name2, toParams);
  const r = [undefined, null, ''].includes(node1) ? node2 : node1;
  return [undefined, null, ''].includes(r) ? defaultNode : r;
};
