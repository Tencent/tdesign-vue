import {
  ref, SetupContext, Ref, computed, onMounted,
} from '@vue/composition-api';
import useVirtualScroll from '../../hooks/useVirtualScrollNew';
import { TypeTreeProps, TypeTreeState } from '../interface';

import TreeNode from '../../_common/js/tree/tree-node';

// tree 虚拟滚动整合
export default function useTreeScroll(props: TypeTreeProps, context: SetupContext, state: TypeTreeState) {
  const treeState = state;
  const { scope, treeContentRef } = treeState;

  const nodes: Ref<TreeNode[]> = ref([]);

  // 虚拟滚动
  const virtualScrollParams = computed(() => {
    const list = nodes.value.filter((node) => node.visible);
    return {
      data: list,
      scroll: props.scroll,
    };
  });
  const virtualConfig = useVirtualScroll(treeContentRef, virtualScrollParams);
  scope.virtualConfig = virtualConfig;
  treeState.virtualConfig = virtualConfig;

  onMounted(() => {
    const isVirtual = virtualConfig?.isVirtualScroll.value;
    if (isVirtual) {
      virtualConfig.handleScroll();
    }
  });

  const emitScrollEvent = (e: WheelEvent) => {
    props.onScroll?.({ e });
    // Vue3 ignore next line
    context.emit('scroll', { e });
  };

  let lastScrollY = 0;
  const onInnerVirtualScroll = (e: WheelEvent) => {
    const isVirtual = virtualConfig?.isVirtualScroll.value;
    const target = (e.target || e.srcElement) as HTMLElement;
    const top = target.scrollTop;
    // 排除横向滚动出发的纵向虚拟滚动计算
    if (lastScrollY !== top) {
      if (isVirtual) {
        virtualConfig.handleScroll();
      }
    } else {
      lastScrollY = 0;
    }
    lastScrollY = top;
    emitScrollEvent(e);
  };

  return {
    // 虚拟滚动相关
    treeContentRef,
    onInnerVirtualScroll,
    virtualConfig,
    scrollToElement: virtualConfig.scrollToElement,
  };
}
