import { ref, Ref } from '@vue/composition-api';
import { TreeProps, TypeTreeStore, TypeTreeState } from '../interface';
import TreeNode from '../../_common/js/tree/tree-node';

// 提供公共对象
export default function useTreeState(props: TreeProps, store: TypeTreeStore) {
  const treeContentRef = ref<HTMLDivElement>();
  const nodes: Ref<TreeNode[]> = ref([]);
  const isScrolling: Ref<boolean> = ref(false);

  const state: TypeTreeState = {
    // tree 数据对象
    store,
    // 内容根节点
    treeContentRef,
    // 渲染节点
    nodes,
    // 是否正在滚动
    isScrolling,
    // 缓存点击事件
    mouseEvent: null,
    // 虚拟滚动对象
    virtualConfig: null,
    // 缓存与节点共享的关联对象
    scope: {
      treeContentRef,
      treeProps: props,
      scopedSlots: {},
      virtualConfig: null,
    },
  };

  return {
    isScrolling,
    treeContentRef,
    state,
  };
}
