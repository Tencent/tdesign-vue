import { VNode } from 'vue';
import { computed, getCurrentInstance } from '@vue/composition-api';

const useListItems = () => {
  const instance = getCurrentInstance();
  const currentSlots = instance.proxy.$slots.default || [];

  const listItems = computed(() => {
    const computedListItems: VNode[] = [];
    currentSlots.forEach((child) => {
      if (child.componentOptions?.tag === 't-list-item') {
        computedListItems.push({
          class: child.data.staticClass,
          style: child.data.staticStyle,
          ...child.componentOptions.propsData,
          slots: () => child.componentOptions.children,
        } as unknown as VNode);
      }
    });
    return computedListItems;
  });

  return {
    listItems,
  };
};

export default useListItems;
