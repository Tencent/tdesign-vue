import {
  computed, onMounted, ref, watch, onBeforeMount,
} from '@vue/composition-api';
import { TdBaseTableProps } from '../type';
import { on, off } from '../../utils/dom';

/**
 * 1. 表头吸顶（普通表头吸顶 和 虚拟滚动表头吸顶）
 * 2. 表尾吸底
 * 3. 底部滚动条吸底
 * 4. 分页器吸底
 */
export default function useAffix(props: TdBaseTableProps) {
  const tableContentRef = ref<HTMLDivElement>();
  // 吸顶表头
  const affixHeaderRef = ref<HTMLDivElement>();
  // 吸底表尾
  const affixFooterRef = ref<HTMLDivElement>();
  // 吸底滚动条
  const horizontalScrollbarRef = ref<HTMLDivElement>();
  // 当表格完全滚动消失在视野时，需要隐藏吸顶表头
  const showAffixHeader = ref(true);
  // 当表格完全滚动消失在视野时，需要隐藏吸底尾部
  const showAffixFooter = ref(true);

  const isAffixed = computed(
    () => !!(
      props.headerAffixedTop
        || props.footerAffixedBottom
        || props.horizontalScrollAffixedBottom
        || props.paginationAffixedBottom
        || (props.scroll.type === 'virtual' && props.scroll.threshold < props.data.length)
    ),
  );

  let lastScrollLeft = -1;
  const updateHeaderScroll = (target?: HTMLElement) => {
    if (!target) {
      lastScrollLeft = -1;
    }
    const newTarget = target || tableContentRef.value;
    if (!newTarget) return;
    // 固定列左右滚动时，更新吸顶表头滚动
    const left = newTarget.scrollLeft;
    if (lastScrollLeft === left) return;
    lastScrollLeft = left;
    if (affixHeaderRef.value) {
      affixHeaderRef.value.scrollLeft = left;
    }
    if (affixFooterRef.value) {
      affixFooterRef.value.scrollLeft = left;
    }
    if (horizontalScrollbarRef.value) {
      horizontalScrollbarRef.value.scrollLeft = left;
    }
  };

  // 吸底的元素（footer、横向滚动条、分页器）是否显示
  const isAffixedBottomElementShow = (elementRect: DOMRect, headerRect: DOMRect, tableRect: DOMRect) => tableRect.top + (headerRect?.height || 0) < elementRect.top && elementRect.top > elementRect.height;

  const updateAffixHeaderOrFooter = () => {
    const pos = tableContentRef.value?.getBoundingClientRect();
    const headerRect = affixHeaderRef.value?.getBoundingClientRect();
    if ((props.headerAffixedTop || props.scroll?.type === 'virtual') && affixHeaderRef.value) {
      const offsetTop = props.headerAffixProps?.offsetTop || 0;
      const footerHeight = affixFooterRef?.value?.offsetHeight || 0;
      const r = Math.abs(pos.top) < pos.height - headerRect.height - offsetTop - footerHeight;
      showAffixHeader.value = r;
    }
    // 底部内容吸底 和 底部滚动条吸底，不可能同时存在，二选一即可
    if (props.footerAffixedBottom && affixFooterRef?.value) {
      const footerRect = affixFooterRef.value.getBoundingClientRect();
      showAffixFooter.value = isAffixedBottomElementShow(footerRect, headerRect, pos);
    } else if (horizontalScrollbarRef?.value) {
      const horizontalScrollbarRect = horizontalScrollbarRef.value.getBoundingClientRect();
      showAffixFooter.value = isAffixedBottomElementShow(horizontalScrollbarRect, headerRect, pos);
    }
  };

  const setTableContentRef = (tableContent: HTMLDivElement) => {
    tableContentRef.value = tableContent;
  };

  const onDocumentScroll = () => {
    updateAffixHeaderOrFooter();
  };

  const onTableContentScroll = (params?: { e: WheelEvent; trigger: 'tfoot' | 'tbody' }) => {
    const target = tableContentRef.value;
    if (params?.trigger === 'tfoot') {
      updateHeaderScroll(affixFooterRef.value);
    } else {
      // 表头和表尾滚动位置更新
      updateHeaderScroll(target);
    }
  };

  const onFootScroll = (e: WheelEvent) => {
    onTableContentScroll({ e, trigger: 'tfoot' });
  };

  const onFootMouseEnter = () => {
    on(affixFooterRef.value, 'scroll', onFootScroll);
  };

  const onFootMouseLeave = () => {
    off(affixFooterRef.value, 'scroll', onFootScroll);
  };

  const onScrollbarMouseEnter = () => {
    on(horizontalScrollbarRef.value, 'scroll', onFootScroll);
  };

  const onFootScrollbarMouseLeave = () => {
    off(horizontalScrollbarRef.value, 'scroll', onFootScroll);
  };

  watch(affixFooterRef, () => {
    if (props.footerAffixedBottom && affixFooterRef.value) {
      on(affixFooterRef.value, 'mouseenter', onFootMouseEnter);
      on(affixFooterRef.value, 'mouseleave', onFootMouseLeave);
    } else {
      off(affixFooterRef.value, 'mouseenter', onFootMouseEnter);
      off(affixFooterRef.value, 'mouseleave', onFootMouseLeave);
    }
  });

  watch(horizontalScrollbarRef, () => {
    if (props.horizontalScrollAffixedBottom && horizontalScrollbarRef.value) {
      on(horizontalScrollbarRef.value, 'mouseenter', onScrollbarMouseEnter);
      on(horizontalScrollbarRef.value, 'mouseleave', onFootScrollbarMouseLeave);
    } else {
      off(horizontalScrollbarRef.value, 'mouseenter', onScrollbarMouseEnter);
      off(horizontalScrollbarRef.value, 'mouseleave', onFootScrollbarMouseLeave);
    }
  });

  const onTableContentMouseEnter = () => {
    on(tableContentRef.value, 'scroll', onTableContentScroll);
  };

  const onTableContentMouseLeave = () => {
    off(tableContentRef.value, 'scroll', onTableContentScroll);
  };

  const addScrollListener = () => {
    if (isAffixed.value) {
      on(document, 'scroll', onDocumentScroll);
      on(tableContentRef.value, 'mouseenter', onTableContentMouseEnter);
      on(tableContentRef.value, 'mouseleave', onTableContentMouseLeave);
    } else {
      off(document, 'scroll', onDocumentScroll);
      off(tableContentRef.value, 'mouseenter', onTableContentMouseEnter);
      off(tableContentRef.value, 'mouseleave', onTableContentMouseLeave);
    }
  };

  watch(
    () => [
      props.headerAffixedTop,
      props.footerAffixedBottom,
      props.horizontalScrollAffixedBottom,
      props.paginationAffixedBottom,
    ],
    addScrollListener,
  );

  onMounted(() => {
    addScrollListener();
  });

  onBeforeMount(() => {
    off(document, 'scroll', onDocumentScroll);
    // if (props.headerAffixedTop || props.footerAffixedBottom) {
    if (affixFooterRef.value) {
      off(affixFooterRef.value, 'mouseenter', onFootMouseEnter);
      off(affixFooterRef.value, 'mouseleave', onFootMouseLeave);
    }
    if (tableContentRef.value) {
      off(tableContentRef.value, 'mouseenter', onTableContentMouseEnter);
      off(tableContentRef.value, 'mouseleave', onTableContentMouseLeave);
    }
  });

  return {
    showAffixHeader,
    showAffixFooter,
    affixHeaderRef,
    affixFooterRef,
    horizontalScrollbarRef,
    updateHeaderScroll,
    setTableContentRef,
  };
}
