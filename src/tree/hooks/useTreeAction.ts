import { SetupContext } from '@vue/composition-api';
import {
  TreeNodeValue, TreeProps, TypeTreeState, TypeTargetNode,
} from '../interface';
import { getNode, emitEvent } from '../util';

// tree 组件节点状态设置
export default function useTreeAction(props: TreeProps, context: SetupContext, state: TypeTreeState) {
  const treeState = state;
  const { store } = treeState;

  const setExpanded = (item: TypeTargetNode, isExpanded: boolean): TreeNodeValue[] => {
    const node = getNode(store, item);
    const expanded = node.setExpanded(isExpanded);
    const evtCtx = {
      node: node.getModel(),
      e: treeState.mouseEvent as MouseEvent,
    };
    emitEvent<Parameters<TreeProps['onExpand']>>(props, context, 'expand', expanded, evtCtx);
    return expanded;
  };

  const toggleExpanded = (item: TypeTargetNode): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setExpanded(node, !node.isExpanded());
  };

  const setActived = (item: TypeTargetNode, isActived: boolean) => {
    const node = getNode(store, item);
    const actived = node.setActived(isActived);
    const evtCtx = {
      node: node.getModel(),
      e: treeState.mouseEvent,
    };
    emitEvent<Parameters<TreeProps['onActive']>>(props, context, 'active', actived, evtCtx);
    return actived;
  };

  const toggleActived = (item: TypeTargetNode): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setActived(node, !node.isActived());
  };

  const setChecked = (item: TypeTargetNode, isChecked: boolean, ctx: { e: Event }): TreeNodeValue[] => {
    const node = getNode(store, item);
    const checked = node.setChecked(isChecked);
    const evtCtx = {
      node: node.getModel(),
      e: ctx?.e,
    };
    emitEvent<Parameters<TreeProps['onChange']>>(props, context, 'change', checked, evtCtx);
    return checked;
  };

  const toggleChecked = (item: TypeTargetNode, ctx: { e: Event }): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setChecked(node, !node.isChecked(), ctx);
  };

  return {
    setExpanded,
    toggleExpanded,
    setActived,
    toggleActived,
    setChecked,
    toggleChecked,
  };
}
