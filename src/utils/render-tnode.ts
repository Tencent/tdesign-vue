import Vue from 'vue';
import { PropType, CreateElement, VNode, VNodeChildren, RenderContext } from 'vue/types/umd';

// 组件render属性的ts类型
type RenderTsTypesSimple = string | number | boolean;
type RenderTsTypesObject = Record<string, any> | Array<any>;
type RenderTsTypes  = VNode | VNodeChildren | TNode | RenderTsTypesSimple | RenderTsTypesObject
// 组件render属性的js类型
const RenderJsTypes = [Function, String, Number, Boolean, Object, Array];

// 定义组件内容的渲染方式
enum RenderWay {
  Text = 'text',
  JsonString = 'jsonstring',
  VNode = 'vnode',
  Unknown = 'unknown'
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
    if (!(value instanceof Array) && value && (value.context instanceof Vue)) {
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
    const renderResult = (typeof render === 'function') ? render(h, params) : render;
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
}

/**
 * 通过JSX的方式渲染 TNode，props 和 插槽同时处理，也能处理默认值为 true 则渲染默认节点的情况
 * @param vm 组件示例
 * @param name 插槽和属性名称
 * @param defaultNode 默认渲染内容，当属性值为 true 时默认渲染该内容
 * @example renderTNodeJSX(this, 'closeBtn')
 * @example renderTNodeJSX(this, 'closeBtn', <t-icon-close />)
 * @example renderTNodeJSX(this, 'closeBtn', { defaultNode: <t-icon-close />, params })
 */
export const renderTNodeJSX = (vm: Vue, name: string, options?: VNode | JSXRenderContext) => {
  const params = options && 'params' in options ? options.params : null;
  const defaultNode = options && 'defaultNode' in options ? options.defaultNode : options;
  const propsNode = vm[name];
  if (propsNode === false) return;
  if (propsNode === true && defaultNode) {
    return vm.$scopedSlots[name] ? vm.$scopedSlots[name](params) : defaultNode;
  }
  if (typeof propsNode === 'function') return propsNode(vm.$createElement, params);
  const isPropsEmpty = [undefined, params, ''].includes(propsNode);
  if (isPropsEmpty && vm.$scopedSlots[name]) return vm.$scopedSlots[name](params);
  return propsNode;
};


/**
 * 通过JSX的方式渲染 TNode，props 和 插槽同时处理。与renderTNodeJSX区别在于 属性值为undefined时会渲染默认节点
 * @param vm 组件示例
 * @param name 插槽和属性名称
 * @param defaultNode 默认渲染内容，不传属性值时会渲染
 * @example renderTNodeJSX(this, 'closeBtn')
 * @example renderTNodeJSX(this, 'closeBtn', <t-icon-close />)
 * @example renderTNodeJSX(this, 'closeBtn', { defaultNode: <t-icon-close />, params })
 */
export const renderTNodeJSXDefault = (vm: Vue, name: string, options?: VNode | JSXRenderContext) => {
  const defaultNode = options && 'defaultNode' in options ? options.defaultNode : options;
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
export const renderContent = (vm: Vue, name1: string, name2: string, options?: VNode | JSXRenderContext) => {
  const params = options && 'params' in options ? options.params : null;
  let defaultNode = (options && 'defaultNode' in options) && options.defaultNode;
  defaultNode = (options && 'context' in options) && options;
  const node1 = renderTNodeJSX(vm, name1, { params });
  const node2 = renderTNodeJSX(vm, name2, { params });
  const r = [undefined, null, ''].includes(node1) ? node2 : node1;
  return [undefined, null, ''].includes(r) ? defaultNode : r;
};
