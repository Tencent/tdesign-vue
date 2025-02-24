import { h, ComponentInternalInstance, VNode } from 'vue';
import { isFunction, isString } from 'lodash-es';

import { ItemsType, TdDescriptionItem } from '../interface';
import { TdDescriptionItemProps } from '../type';

/**
 * ! 处理 node string / <div> / () => <div> / Component
 * [
 *  { key: 'string / <div> / () => <div> / Component'  }
 * ]
 * @param node
 * @param params
 * @returns
 */
export function renderCustomNode(node: string | ((...args: any[]) => any) | ComponentInternalInstance, params = {}) {
  if (isString(node)) {
    return node;
  }
  if (isFunction(node)) {
    return node(h, params);
  }
  if (isFunction(node.render)) {
    return <node />;
  }

  return node;
}

/**
 * ! 处理 VNode 中的 slot prop，同时存在时，props 优先级更高
 * @param node VNode
 * @param name1 props 名称，slot 名称应与其一致
 * @param name2 slot 别名
 * @returns
 */
export function renderVNodeTNode(node: VNode | ComponentInternalInstance, name1: string, name2?: string) {
  const prop = node.componentOptions.propsData?.[name1];
  if (prop) return prop;

  const slot = node.data.scopedSlots?.[name1]?.() || node.data.scopedSlots?.[name2]?.();
  if (slot) return slot;

  return node.componentOptions.children;
}

/**
 * 判断 item 当前类型
 * @param itemsType
 * @param item
 * @returns
 */
export function itemTypeIsProps(itemsType: ItemsType, item: TdDescriptionItem): item is TdDescriptionItemProps {
  return itemsType === ItemsType.props;
}
