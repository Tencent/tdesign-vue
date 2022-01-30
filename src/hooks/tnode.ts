import { getCurrentInstance, h } from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import log from '../_common/js/log';

/**
 * 通过 JSX 的方式渲染 TNode，props 和 插槽同时处理，也能处理默认值为 true 则渲染默认节点的情况
 * 优先级：Props 大于插槽
 * 如果 props 值为 true ，则使用插槽渲染。如果也没有插槽的情况下，则使用 defaultNode 渲染
 * @param vm 组件实例
 * @param name 插槽和属性名称
 * @param options 值可能为默认渲染节点，也可能是默认渲染节点和参数的集合
 * @example useTNodeJSX('closeBtn')  优先级 props function 大于 插槽
 * @example useTNodeJSX('closeBtn', { defaultNode: <close-icon />, params })。 params 为渲染节点时所需的参数
 */
export function useTNodeJSX<T>(name: string, options?: { defaultNode?: JSX.Element; params: T }) {
  const vm = getCurrentInstance();
  // 插槽和属性同时存在，则提醒用户只需要选择一种方式即可
  if (vm.slots[name] && vm.props[name] && vm.props[name] !== true) {
    log.warn('', `Both slots.${name} and $props.${name} exist, $props.${name} is preferred`);
  }
  const propsNode = vm.props[name];
  // props 值为 false，则表示无论何种情况都不显示元素
  if (propsNode === false) return null;
  // props 值类型为 Function，则表示使用渲染函数输出
  if (isFunction(propsNode)) return propsNode(h, options?.params);
  // props 值为 true，使用插槽渲染，如果插槽不存在，则使用默认节点 defaultNode 渲染
  if (propsNode === true && options?.defaultNode) {
    return vm.slots[name] ? vm.slots[name](options?.params) : options?.defaultNode;
  }
  // props 为其他数据类型，只要不为空，则直接输出
  if (!['', undefined, null].includes(String(propsNode))) return propsNode;
  // 兜底输出插槽内容
  return vm.slots[name]?.(options?.params) || options?.defaultNode;
}

export default useTNodeJSX;
