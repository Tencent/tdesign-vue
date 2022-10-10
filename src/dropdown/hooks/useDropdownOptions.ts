import { VNode } from 'vue';
import { computed, ComputedRef } from '@vue/composition-api';
import { DropdownOption, TdDropdownProps } from '../type';

const DropdownMenuName = 't-dropdown-menu';

export const getOptionsFromChildren = (menuGroup: any): DropdownOption[] => {
  if (!menuGroup || menuGroup?.length === 0) return [];

  // 处理内部嵌套场景
  if (menuGroup?.tag === DropdownMenuName) {
    const groupChildren = menuGroup.children;
    if (Array.isArray(groupChildren)) {
      return getOptionsFromChildren(groupChildren);
    }
    return [];
  }

  if (Array.isArray(menuGroup)) {
    return menuGroup.map((item) => {
      const groupChildren = item?.componentOptions?.children;
      const contentIdx = groupChildren.findIndex?.((v: VNode) => typeof v.text === 'string');
      const childrenContent = groupChildren.filter?.((v: VNode) => typeof v.text !== 'string');

      const commonProps = {
        ...item.componentOptions?.propsData,
        style: item.componentOptions?.data?.style,
        class: item.componentOptions?.data?.staticClass,
        onClick: item.componentOptions?.listeners?.click,
        content: groupChildren[contentIdx]?.text,
      };
      if (childrenContent.length === 1) {
        return {
          ...commonProps,
          children: childrenContent.length > 0 ? getOptionsFromChildren(childrenContent[0].componentOptions) : null,
        };
      }
      return {
        ...commonProps,
        children: childrenContent.length > 0 ? getOptionsFromChildren(childrenContent) : null,
      };
    });
  }

  return [];
};

export default function useDropdownOptions(
  props: TdDropdownProps,
  slots: {
    [key: string]: VNode[];
  },
): ComputedRef<DropdownOption[]> {
  const menuSlot = slots?.default?.filter((v: VNode) => v.componentOptions?.tag === DropdownMenuName)?.[0]?.componentOptions
    || slots?.dropdown?.[0]?.componentOptions;
  return computed(() => {
    if (props.options && props.options.length > 0) return props.options;

    return getOptionsFromChildren(menuSlot);
  });
}
