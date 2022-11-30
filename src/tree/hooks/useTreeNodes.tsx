import { CreateElement } from 'vue';
import {
  ref, nextTick, SetupContext, Ref,
} from '@vue/composition-api';
import { TypeVNode, TypeTreeProps, TypeTreeState } from '../interface';
import TreeItem from '../tree-item';
import TreeNode from '../../_common/js/tree/tree-node';
import useTreeEvents from './useTreeEvents';

// tree 节点列表渲染
export default function useTreeNodes(props: TypeTreeProps, context: SetupContext, state: TypeTreeState) {
  const { store } = state;

  const { handleClick, handleChange } = useTreeEvents(props, context, state);

  // 创建单个 tree 节点
  const renderItem = (h: CreateElement, node: TreeNode) => {
    const { cache } = state;
    const { expandOnClickNode } = props;
    const { scope } = cache;

    const treeItem = (
      <TreeItem
        key={node.value}
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

  const clearCacheNodes = () => {
    cacheMap.clear();
  };

  const nodes: Ref<TreeNode[]> = ref([]);
  const nodesFilterEmpty = ref(false);
  const refresh = () => {
    // 渲染为平铺列表
    nodes.value = store.getNodes();
  };

  const renderTreeNodes = (h: CreateElement) => {
    let isFilterEmpty = true;
    const treeNodeViews = nodes.value.map((node: TreeNode) => {
      // 如果节点已经存在，则使用缓存节点
      let nodeView = cacheMap.get(node.value);
      if (node.visible) {
        // 任意一个节点可视，过滤结果就不是空
        isFilterEmpty = false;
        // 如果节点未曾创建，则临时创建
        if (!nodeView) {
          // 初次仅渲染可显示的节点
          // 不存在节点视图，则创建该节点视图并插入到当前位置
          nodeView = renderItem(h, node);
          cacheMap.set(node.value, nodeView);
        }
      }
      return nodeView;
    });
    nodesFilterEmpty.value = isFilterEmpty;

    // 更新缓存后，被删除的节点要移除掉，避免内存泄露
    nextTick(() => {
      cacheMap.forEach((view: TypeVNode, value: string) => {
        if (!store.getNode(value)) {
          cacheMap.delete(value);
        }
      });
    });

    return treeNodeViews;
  };

  refresh();
  store.emitter.on('update', refresh);

  return {
    nodesFilterEmpty,
    clearCacheNodes,
    renderTreeNodes,
  };
}
