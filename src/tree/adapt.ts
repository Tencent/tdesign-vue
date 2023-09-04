// 在这个文件，解决 vue2/vue3 tree 组件依赖的差异问题
// 除此文件之外的其他组件文件，可从 vue2 项目直接复制到 vue3 项目进行维护
import { Ref, SetupContext } from '@vue/composition-api';
import { CreateElement, VNode, PropType } from 'vue';
import { CheckboxProps } from '../checkbox';
import {
  ClassName, TScroll, Styles, TNode, TreeOptionData, TNodeReturnValue,
} from '../common';
import { TypeTreeEventState as TreeEventState } from '../_common/js/tree/types';
import { VirtualScrollConfig } from '../hooks/useVirtualScrollNew';

export {
  ref, reactive, computed, watch, onMounted, toRefs, defineComponent,
} from '@vue/composition-api';
export { CaretRightSmallIcon as TdCaretRightSmallIcon } from 'tdesign-icons-vue';
export { Checkbox as TCheckBox } from '../checkbox';
export { Loading as TLoading } from '../loading';
export { useConfig, usePrefixClass } from '../hooks/useConfig';
export { useGlobalIcon } from '../hooks/useGlobalIcon';
export { default as useLazyLoad } from '../hooks/useLazyLoad';
export { default as useVirtualScroll } from '../hooks/useVirtualScrollNew';
export { TreeNode, privateKey } from '../_common/js/tree/tree-node';
export { TreeStore } from '../_common/js/tree/tree-store';

export type TypeRef<T> = Ref<T>;
export type TypeSetupContext = SetupContext;
export type TypeCreateElement = CreateElement;
export type TypeVNode = VNode;
export type TypePropType<T> = PropType<T>;
export type TypeCheckboxProps = CheckboxProps;
export type TypeClassName = ClassName;
export type TypeScroll = TScroll;
export type TypeStyles = Styles;
export type TypeTNode<T> = TNode<T>;
export type TypeTNodeReturnValue = TNodeReturnValue;
export type TypeTreeOptionData = TreeOptionData;
export type TypeTreeEventState = TreeEventState;
export type TypeVirtualScrollConfig = VirtualScrollConfig;

export interface TypeOnDrag {
  default?: unknown;
}

const onDrag: TypeOnDrag = {
  default: undefined,
};

export const TreeItemDefinition = {
  name: 'TTreeItem',
  inject: {
    onDrag,
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useRipple(el: unknown) {}
