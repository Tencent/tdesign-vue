import { TypeTreeProps, TypeTreeState } from '../interface';
import TreeItem from '../tree-item';
import TreeNode from '../../_common/js/tree/tree-node';

export default function useTreeNodes(props: TypeTreeProps, state: TypeTreeState) {
  // 创建单个 tree 节点
  const renderItem = (node: TreeNode) => {
    const { nested, cache } = state;
    const { expandOnClickNode } = props;
    const { scope, scopedSlots } = cache;

    const treeItem = (
      <TreeItem
        key={node.value}
        node={node}
        nested={nested}
        treeScope={scope}
        proxyScope={scopedSlots}
        // onClick={this.handleClick}
        // onChange={this.handleChange}
        expandOnClickNode={expandOnClickNode}
      />
    );
    return treeItem;
  };

  return {
    renderItem,
  };
}
