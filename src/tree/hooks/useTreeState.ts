import { ref, Ref } from '@vue/composition-api';
import { TypeTreeProps, TypeTreeStore, TypeTreeState } from '../interface';
import TreeNode from '../../_common/js/tree/tree-node';

// 提供公共对象
export default function useTreeState(props: TypeTreeProps, store: TypeTreeStore) {
  const treeContentRef = ref<HTMLDivElement>();
  const nodes: Ref<TreeNode[]> = ref([]);

  const state: TypeTreeState = {
    store,
    treeContentRef,
    nodes,
    // 缓存点击事件
    mouseEvent: null,
    // 虚拟滚动对象
    virtualConfig: null,
    // 缓存与节点共享的关联对象
    scope: {
      treeProps: props,
      scopedSlots: {},
    },
  };

  return {
    treeContentRef,
    state,
  };
}
