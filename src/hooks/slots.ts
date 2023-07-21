import { getCurrentInstance } from '@vue/composition-api';
import isArray from 'lodash/isArray';
import { VNode } from 'vue/types/umd';
import { ScopedSlot } from 'vue/types/vnode';

/**
 * 渲染default slot，获取子组件VNode。处理多种子组件创建场景
 * 使用场景：<t-steps> <t-steps-item /> </t-steps>, <t-steps> <t-steps-item v-for="(item, index)" :key="index" /> </t-steps>
 * @returns {function(childComponentName: string, slots: Slots): VNode[]}
 * @param childComponentName
 * @param slots
 * @example const getChildByName = useChildComponentSlots()
 * @example getChildComponentByName('TStepItem')
 */
export function useChildComponentSlots() {
  const instance = getCurrentInstance();
  return (childComponentName: string, slots?: ScopedSlot): VNode[] => {
    if (!slots) {
      // eslint-disable-next-line
      slots = instance.setupContext?.slots;
    }
    // @ts-ignore
    const content = slots?.default?.() || [];

    // 满足基于基础组件封装场景，递归找到子组件
    const childList: VNode[] = [];
    const getChildren = (content: VNode[]) => {
      if (!isArray(content)) return;
      content.forEach((item: VNode) => {
        if (item.children && isArray(item.children)) {
          // if (item.type !== Fragment) return;
          getChildren(item.children as VNode[]);
        } else {
          childList.push(item);
        }
      });
      return childList;
    };

    return getChildren(content).filter((item: VNode) => item.tag?.endsWith(childComponentName)) as VNode[];
  };
}

export default useChildComponentSlots;
