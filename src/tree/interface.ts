import { VNode } from 'vue';
import { Ref } from '@vue/composition-api';
import { TNode, TreeOptionData, TScroll } from '../common';
import TreeStore from '../_common/js/tree/tree-store';
import TreeNode from '../_common/js/tree/tree-node';
import { TypeTreeEventState } from '../_common/js/tree/types';
import { VirtualScrollConfig } from '../hooks/useVirtualScrollNew';
import {
  TdTreeProps, TreeNodeModel, TreeInstanceFunctions, TreeNodeValue, TreeNodeState,
} from './type';

// 在这个文件做统一的类型梳理
// 所有类型，接口，都用 Type 作为名称前缀

export * from './type';

export type TypeVNode = VNode;

export type TreeProps<T extends TreeOptionData = TreeOptionData> = TdTreeProps<T> & {
  treeStore?: TreeStore;
};
/**
 * @deprecated
 */
export type TypeTreeProps<T extends TreeOptionData = TreeOptionData> = TdTreeProps<T>;

export type TypeTNodeState = TreeNodeState;
export type TypeTNodeValue = TreeNodeValue;
export type TypeTreeNode = TreeNode;
export type TypeTreeStore = TreeStore;
export type TypeValueMode = TreeProps['valueMode'];
export type TypeTNodeProp = boolean | string | TNode<TypeTreeNodeModel>;
export type TypeTreeNodeModel = TreeNodeModel<TreeOptionData>;
export type TypeTargetNode = TreeNodeValue | TypeTreeNode | TypeTreeNodeModel;
export type TypeVirtualScrollConfig = VirtualScrollConfig;
export type TypeTimer = ReturnType<typeof setTimeout>;

export interface TypeTreeRow extends TreeNode {
  __VIRTUAL_SCROLL_INDEX?: number;
}

export interface TypeEventState extends TypeTreeEventState {
  mouseEvent?: MouseEvent;
  event?: Event;
  path?: TypeTreeNode[];
  dragEvent?: DragEvent;
  dropPosition?: number;
}

export interface TypDragEventState extends TypeEventState {
  dragEvent?: DragEvent;
  dropPosition?: number;
}

export interface TypeMark {
  name: string;
  value: string;
  el?: HTMLElement;
}

export interface TypeLineModel {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface TypeTreeInstance extends Vue, TreeInstanceFunctions {}

export interface TypeGetTNodeOption {
  node?: TreeNode;
  createElement?: Vue.CreateElement;
}

export interface TypeRenderTNodeOption {
  node?: TypeTreeNodeModel;
}

export interface TypeScopedSlots {
  empty?: (opts?: TypeRenderTNodeOption) => VNode;
  icon?: (opts?: TypeRenderTNodeOption) => VNode;
  label?: (opts?: TypeRenderTNodeOption) => VNode;
  line?: (opts?: TypeRenderTNodeOption) => VNode;
  operations?: (opts?: TypeRenderTNodeOption) => VNode;
}

export interface TypeDragHandle {
  handleDragStart: (state: TypDragEventState) => void;
  handleDragEnd: (state: TypDragEventState) => void;
  handleDragOver: (state: TypDragEventState) => void;
  handleDragLeave: (state: TypDragEventState) => void;
  handleDrop: (state: TypDragEventState) => void;
}

export interface TypeTreeScope {
  treeContentRef: Ref<HTMLDivElement>;
  treeProps?: TreeProps;
  scopedSlots?: TypeScopedSlots;
  drag?: TypeDragHandle;
  scrollProps?: Ref<TScroll>;
  virtualConfig?: TypeVirtualScrollConfig;
}

export interface TypeTreeState {
  scope: TypeTreeScope;
  store: TypeTreeStore;
  nodes: Ref<TreeNode[]>;
  isScrolling: Ref<boolean>;
  treeContentRef: Ref<HTMLDivElement>;
  mouseEvent?: Event;
  virtualConfig?: TypeVirtualScrollConfig;
}

export interface TypeTreeItemProps {
  node: TypeTreeNode;
  treeScope: TypeTreeScope;
  expandOnClickNode: boolean;
  rowIndex: number;
}

export interface TypeEventContext {
  node: TypeTreeNodeModel;
  e: MouseEvent;
}

export interface TypeExpandEventContext extends TypeEventContext {
  trigger: 'setItem' | 'node-click' | 'icon-click';
}

export interface TypeActiveEventContext extends TypeEventContext {
  trigger: 'setItem' | 'node-click';
}

export interface TypeChangeEventContext extends TypeEventContext {
  trigger: 'setItem' | 'node-click';
}
