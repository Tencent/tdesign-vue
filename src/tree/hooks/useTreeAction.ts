import { SetupContext } from '@vue/composition-api';
import {
  TreeNodeValue, TypeTreeProps, TypeTreeState, TypeTargetNode,
} from '../interface';
import { getNode, emitEvent } from '../util';

// tree 组件节点状态设置
export default function useTreeAction(props: TypeTreeProps, context: SetupContext, state: TypeTreeState) {
  const { cache, store } = state;

  const setExpanded = (item: TypeTargetNode, isExpanded: boolean): TreeNodeValue[] => {
    const node = getNode(store, item);
    const expanded = node.setExpanded(isExpanded);
    const evtCtx = {
      node: node.getModel(),
      e: cache.mouseEvent as MouseEvent,
    };
    emitEvent<Parameters<TypeTreeProps['onExpand']>>(props, context, 'expand', expanded, evtCtx);
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
      e: cache.mouseEvent,
    };
    emitEvent<Parameters<TypeTreeProps['onActive']>>(props, context, 'active', actived, evtCtx);
    return actived;
  };

  const toggleActived = (item: TypeTargetNode): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setActived(node, !node.isActived());
  };

  const setChecked = (item: TypeTargetNode, isChecked: boolean): TreeNodeValue[] => {
    const node = getNode(store, item);
    const checked = node.setChecked(isChecked);
    const evtCtx = {
      node: node.getModel(),
    };
    emitEvent<Parameters<TypeTreeProps['onChange']>>(props, context, 'change', checked, evtCtx);
    return checked;
  };

  const toggleChecked = (item: TypeTargetNode): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setChecked(node, !node.isChecked());
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
