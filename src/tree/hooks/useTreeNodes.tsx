import { CreateElement } from 'vue';
import {
  // ref,
  nextTick,
} from '@vue/composition-api';
import { TypeVNode, TypeTreeProps, TypeTreeState } from '../interface';
import TreeItem from '../tree-item';
import TreeNode from '../../_common/js/tree/tree-node';

export default function useTreeNodes(props: TypeTreeProps, state: TypeTreeState) {
  // 创建单个 tree 节点
  const renderItem = (h: CreateElement, node: TreeNode) => {
    const { nested, cache } = state;
    const { expandOnClickNode } = props;
    const { scope, scopedSlots } = cache;

    const treeItem = (
      <TreeItem
        key={node.value}
        node={node}
        nested={nested.value}
        treeScope={scope}
        proxyScope={scopedSlots}
        // onClick={this.handleClick}
        // onChange={this.handleChange}
        expandOnClickNode={expandOnClickNode}
      />
    );
    return treeItem;
  };

  const cacheMap = new Map();

  const renderTreeNodes = (h: CreateElement) => {
    const { store, nested } = state;
    let nodes = [];
    if (nested.value) {
      // 渲染为嵌套结构
      nodes = store.getChildren();
    } else {
      // 渲染为平铺列表
      nodes = store.getNodes();
    }

    const treeNodeViews = nodes.map((node: TreeNode) => {
      // 如果节点已经存在，则使用缓存节点
      let nodeView = cacheMap.get(node.value);
      // 如果节点未曾创建，则临时创建
      if (!nodeView && node.visible) {
        // 初次仅渲染可显示的节点
        // 不存在节点视图，则创建该节点视图并插入到当前位置
        nodeView = renderItem(h, node);
        cacheMap.set(node.value, nodeView);
      }
      return nodeView;
    });

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

  return {
    renderTreeNodes,
  };
}
