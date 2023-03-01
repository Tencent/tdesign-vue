import { CreateElement } from 'vue';
import { ref, nextTick, SetupContext } from '@vue/composition-api';
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

  const cacheMap = new Map();

  const nodesEmpty = ref(false);
  const refresh = () => {
    // 渲染为平铺列表
    nodes.value = store.getNodes();
  };

  const renderTreeNodes = (h: CreateElement) => {
    let treeNodeViews: TypeVNode[] = [];
    let isEmpty = true;
    let list = nodes.value;

    const isVirtual = virtualConfig?.isVirtualScroll.value;
    if (isVirtual) {
      list = virtualConfig.visibleData.value;
      nodesEmpty.value = list.length <= 0;
      // 虚拟滚动只渲染可见节点
      treeNodeViews = list.map((node: TypeTreeNode, index) => renderItem(h, node, index));
    } else {
      treeNodeViews = list.map((node: TypeTreeNode, index) => {
        const nodePrivateKey = node[privateKey];
        // 如果节点已经存在，则使用缓存节点
        // 不可见的节点，缓存中存在，则依然会保留
        let nodeView: TypeVNode = cacheMap.get(nodePrivateKey);
        if (node.visible) {
          // 任意一个节点可视，过滤结果就不是空
          isEmpty = false;
          // 如果节点未曾创建，则临时创建
          if (!nodeView) {
            // 初次仅渲染可显示的节点
            // 不存在节点视图，则创建该节点视图并插入到当前位置
            nodeView = renderItem(h, node, index);
            cacheMap.set(nodePrivateKey, nodeView);
          }
        }
        return nodeView;
      });
      nodesEmpty.value = isEmpty;

      // 更新缓存后，被删除的节点要移除掉，避免内存泄露
      nextTick(() => {
        cacheMap.forEach((view: TypeVNode, nodePrivateKey: string) => {
          const node = store.privateMap.get(nodePrivateKey);
          if (!node) {
            cacheMap.delete(nodePrivateKey);
          }
        });
      });
    }

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
