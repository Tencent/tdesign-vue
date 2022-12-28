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

  let clearStep = 0;
  const clearCacheNodes = () => {
    // 重构为 hooks api 之后发现一个问题
    // 立即执行 cacheMap.clear() 之后，renderTreeNodes 执行了 2 次
    // 其中第一次在 nodes.value 变更之前执行
    // 导致 cacheMap 缓存重新建立，并引发了视图绑定异常
    // 因此用 clearStep 方式解决
    clearStep = 1;
  };

  const nodes: Ref<TreeNode[]> = ref([]);
  const nodesEmpty = ref(false);
  const refresh = () => {
    // 渲染为平铺列表
    nodes.value = store.getNodes();
  };

  const renderTreeNodes = (h: CreateElement) => {
    let treeNodeViews: TypeVNode[] = [];
    let isEmpty = true;
    const list = nodes.value;
    if (clearStep) {
      cacheMap.clear();
      clearStep = 0;
      nodesEmpty.value = !list.some((node: TreeNode) => node.visible);
      return treeNodeViews;
    }
    treeNodeViews = list.map((node: TreeNode) => {
      // 如果节点已经存在，则使用缓存节点
      let nodeView: TypeVNode = cacheMap.get(node.value);
      if (node.visible) {
        // 任意一个节点可视，过滤结果就不是空
        isEmpty = false;
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
    nodesEmpty.value = isEmpty;

    // 更新缓存后，被删除的节点要移除掉，避免内存泄露
    nextTick(() => {
      cacheMap.forEach((view: TypeVNode, value: string) => {
        const node = store.getNode(value);
        if (!node) {
          cacheMap.delete(value);
        }
      });
    });

    return treeNodeViews;
  };

  refresh();
  store.emitter.on('update', refresh);

  return {
    refresh,
    nodesEmpty,
    clearCacheNodes,
    renderTreeNodes,
  };
}
