import { VNode } from 'vue';
import { ComputedRef } from '@vue/composition-api';
import { TNode, TreeOptionData } from '../common';
import TreeStore from '../_common/js/tree/tree-store';
import TreeNode from '../_common/js/tree/tree-node';
import { TypeTreeEventState } from '../_common/js/tree/types';
import {
  TdTreeProps, TreeNodeModel, TreeInstanceFunctions, TreeNodeValue, TreeNodeState,
} from './type';

// 在这个文件做统一的类型梳理
// 所有类型，接口，都用 Type 作为名称前缀

export * from './type';

export type TypeVNode = VNode;

export type TypeTreeProps = TdTreeProps;

export type TypeTNodeState = TreeNodeValue;

export type TypeTNodeValue = TreeNodeState;

export type TypeTreeNode = TreeNode;

export type TypeTreeStore = TreeStore;

export type TypeValueMode = TdTreeProps['valueMode'];

export type TypeTNodeProp = string | TNode<TypeTreeNodeModel>;

export type TypeTreeNodeModel = TreeNodeModel<TreeOptionData>;

export type TypeTargetNode = TreeNodeValue | TypeTreeNode | TypeTreeNodeModel;

export interface TypeEventState extends TypeTreeEventState {
  mouseEvent?: MouseEvent;
  event?: Event;
  path?: TypeTreeNode[];
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

export interface TypeTreeScope {
  checkProps?: TdTreeProps['checkProps'];
  disableCheck?: TdTreeProps['disableCheck'];
  empty?: TdTreeProps['empty'];
  icon?: TdTreeProps['icon'];
  label?: TdTreeProps['label'];
  line?: TdTreeProps['line'];
  operations?: TdTreeProps['operations'];
}

export interface TypeTreeCache {
  mouseEvent?: Event;
  scope: TypeTreeScope;
  scopedSlots: any;
}

export interface TypeTreeState {
  store: TypeTreeStore;
  cache: TypeTreeCache;
  itemMaxHeight: ComputedRef<number>;
  vScrollEnable: ComputedRef<boolean>;
  nested: ComputedRef<boolean>;
}
