import { VNode } from 'vue';
import get from 'lodash/get';
import { computed, ComputedRef } from '@vue/composition-api';
import { DropdownOption, TdDropdownProps } from '../type';

const DropdownMenuName = 'TDropdownMenu';
const DropdownItemName = 'TDropdownItem';

export const getOptionsFromChildren = (menuGroup: any): DropdownOption[] => {
  if (!menuGroup || menuGroup?.length === 0) return [];

  // 处理内部嵌套场景
  if (get(menuGroup, 'Ctor.extendOptions.name') === DropdownMenuName) {
    const groupChildren = menuGroup.children;
    if (Array.isArray(groupChildren)) {
      return getOptionsFromChildren(groupChildren);
    }
    return [];
  }

  if (Array.isArray(menuGroup)) {
    return menuGroup
      .map((item) => {
        const groupChildren = item?.componentOptions?.children;
        if (!groupChildren) return {};

        // 当前节点的渲染内容
        const contentCtx = groupChildren?.filter?.(
          (v: VNode) => ![DropdownMenuName, DropdownItemName].includes(get(v, 'componentOptions.Ctor.extendOptions.name')),
        );
        // 嵌套菜单的节点
        const childrenCtx = groupChildren?.filter?.(
          (v: VNode) => typeof v.text !== 'string'
            && [DropdownMenuName, DropdownItemName].includes(get(v, 'componentOptions.Ctor.extendOptions.name')),
        );

        const commonProps = {
          ...item.componentOptions?.propsData,
          style: item?.data?.style,
          class: item?.data?.staticClass,
          onClick: item.componentOptions?.listeners?.click,
          content: contentCtx || groupChildren,
        };

        if (childrenCtx.length === 1) {
          return {
            ...commonProps,
            children: childrenCtx.length > 0 ? getOptionsFromChildren(childrenCtx[0].componentOptions) : null,
          };
        }

        return {
          ...commonProps,
          children: childrenCtx.length > 0 ? getOptionsFromChildren(childrenCtx) : null,
        };
      })
      .filter((v) => !!v.content);
  }

  return [];
};

export default function useDropdownOptions(
  props: TdDropdownProps,
  slots: {
    [key: string]: VNode[];
  },
): ComputedRef<DropdownOption[]> {
  const menuSlot = slots?.default?.filter((v: VNode) => get(v, 'componentOptions.Ctor.extendOptions.name') === DropdownMenuName)?.[0]
    ?.componentOptions || slots?.dropdown?.[0]?.componentOptions;
  return computed(() => {
    if (props.options && props.options.length > 0) return props.options;

    return getOptionsFromChildren(menuSlot);
  });
}
