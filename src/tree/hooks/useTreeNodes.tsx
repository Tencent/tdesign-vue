import { CreateElement } from 'vue';
import { ref, SetupContext } from '@vue/composition-api';
import {
  TypeVNode, TypeTreeRow, TypeTreeNode, TreeProps, TypeTreeState,
} from '../interface';
import TreeItem from '../tree-item';
import { privateKey } from '../../_common/js/tree/tree-node';
import useTreeEvents from './useTreeEvents';

// tree 节点列表渲染
export default function useTreeNodes(props: TreeProps, context: SetupContext, state: TypeTreeState) {
  const treeState = state;
  const {
    store, scope, nodes, virtualConfig,
  } = treeState;

  const { handleClick, handleChange } = useTreeEvents(props, context, state);
  const nodesEmpty = ref(false);

  const refresh = () => {
    let list = [];
    const allNodes = store.getNodes();
    const isVirtual = virtualConfig?.isVirtualScroll.value;
    if (isVirtual) {
      // 虚拟滚动只渲染可见节点
      list = virtualConfig.visibleData.value;
    } else {
      list = allNodes.filter((node: TypeTreeNode) => node.visible);
    }
    nodesEmpty.value = list.length <= 0;
    // 渲染为平铺列表
    nodes.value = list;
  };

  // 创建单个 tree 节点
  const renderItem = (h: CreateElement, node: TypeTreeRow, index: number) => {
    const { expandOnClickNode } = props;
    const rowIndex = node.__VIRTUAL_SCROLL_INDEX || index;
    const treeItem = (
      <TreeItem
        key={node[privateKey]}
        rowIndex={rowIndex}
        node={node}
        treeScope={scope}
        onClick={handleClick}
        onChange={handleChange}
        expandOnClickNode={expandOnClickNode}
      />
    );
    return treeItem;
  };

  const renderTreeNodes = (h: CreateElement) => {
    const treeNodeViews: TypeVNode[] = nodes.value.map((node: TypeTreeNode, index) => renderItem(h, node, index));
    return treeNodeViews;
  };

  refresh();
  store.emitter.on('update', refresh);

  return {
    refresh,
    nodesEmpty,
    renderTreeNodes,
  };
}
