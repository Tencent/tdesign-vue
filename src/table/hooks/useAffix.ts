import {
  computed, ref, watch, onBeforeMount,
} from '@vue/composition-api';
import { TdBaseTableProps } from '../type';
import { on, off } from '../../utils/dom';
import { AffixProps } from '../../affix';

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
  // 吸底分页器
  const paginationRef = ref<HTMLDivElement>();
  // 当表格完全滚动消失在视野时，需要隐藏吸顶表头
  const showAffixHeader = ref(true);
  // 当表格完全滚动消失在视野时，需要隐藏吸底尾部
  const showAffixFooter = ref(true);
  // 当表格完全滚动消失在视野时，需要隐藏吸底分页器
  const showAffixPagination = ref(true);

  const isAffixed = computed(
    () => !!(
      props.headerAffixedTop
        || props.footerAffixedBottom
        || props.horizontalScrollAffixedBottom
        || (props.scroll && props.scroll.type === 'virtual' && (props.scroll.threshold || 100) < props.data.length)
    ),
  );

  let lastScrollLeft = 0;
  const onHorizontalScroll = (scrollElement?: HTMLElement) => {
    if (!isAffixed.value) return;
    let target = scrollElement;
    if (!target && tableContentRef.value) {
      lastScrollLeft = 0;
      target = tableContentRef.value;
    }
    if (!target) return;
    const left = target.scrollLeft;
    // 如果 lastScrollLeft 等于 left，说明不是横向滚动，不需要更新横向滚动距离
    if (lastScrollLeft === left) return;
    lastScrollLeft = left;
    // 表格内容、吸顶表头、吸底表尾、吸底横向滚动更新
    const toUpdateScrollElement = [
      tableContentRef.value,
      affixHeaderRef.value,
      affixFooterRef.value,
      horizontalScrollbarRef.value,
    ];
    for (let i = 0, len = toUpdateScrollElement.length; i < len; i++) {
      if (toUpdateScrollElement[i] && scrollElement !== toUpdateScrollElement[i]) {
        toUpdateScrollElement[i].scrollLeft = left;
      }
    }
  };

  // 吸底的元素（footer、横向滚动条、分页器）是否显示
  const isAffixedBottomElementShow = (elementRect: DOMRect, tableRect: DOMRect, headerHeight: number) => tableRect.top + headerHeight < elementRect.top && elementRect.top > elementRect.height;

  const getOffsetTop = (props: boolean | AffixProps) => {
    if (typeof props === 'boolean') return 0;
    return props.offsetTop || 0;
  };

  const updateAffixHeaderOrFooter = () => {
    if (!isAffixed.value) return;
    const pos = tableContentRef.value?.getBoundingClientRect();
    const headerHeight = tableContentRef.value?.querySelector('thead').offsetHeight || 0;
    if ((props.headerAffixedTop || props.scroll?.type === 'virtual') && affixHeaderRef.value) {
      const offsetTop = getOffsetTop(props.headerAffixProps || props.headerAffixedTop);
      const footerHeight = affixFooterRef?.value?.offsetHeight || 0;
      const r = Math.abs(pos.top) < pos.height - headerHeight - offsetTop - footerHeight;
      showAffixHeader.value = r;
    }
    // 底部内容吸底 和 底部滚动条吸底，不可能同时存在，二选一即可
    if (props.footerAffixedBottom && affixFooterRef?.value) {
      const footerRect = affixFooterRef.value.getBoundingClientRect();
      showAffixFooter.value = isAffixedBottomElementShow(footerRect, pos, headerHeight);
    } else if (props.horizontalScrollAffixedBottom && horizontalScrollbarRef?.value) {
      const horizontalScrollbarRect = horizontalScrollbarRef.value.getBoundingClientRect();
      showAffixFooter.value = isAffixedBottomElementShow(horizontalScrollbarRect, pos, headerHeight);
    }
    if (props.paginationAffixedBottom && paginationRef.value) {
      const pageRect = paginationRef.value.getBoundingClientRect();
      showAffixPagination.value = isAffixedBottomElementShow(pageRect, pos, headerHeight);
    }
  };

  const setTableContentRef = (tableContent: HTMLDivElement) => {
    tableContentRef.value = tableContent;
    addScrollListener();
  };

  const onDocumentScroll = () => {
    updateAffixHeaderOrFooter();
  };

  const onFootScroll = () => {
    onHorizontalScroll(affixFooterRef.value);
  };

  const horizontalScrollbarScroll = () => {
    onHorizontalScroll(horizontalScrollbarRef.value);
  };

  const onTableContentScroll = () => {
    onHorizontalScroll(tableContentRef.value);
  };

  const onFootMouseEnter = () => {
    on(affixFooterRef.value, 'scroll', onFootScroll);
  };

  const onFootMouseLeave = () => {
    off(affixFooterRef.value, 'scroll', onFootScroll);
  };

  const onScrollbarMouseEnter = () => {
    on(horizontalScrollbarRef.value, 'scroll', horizontalScrollbarScroll);
  };

  const onScrollbarMouseLeave = () => {
    off(horizontalScrollbarRef.value, 'scroll', horizontalScrollbarScroll);
  };

  const onTableContentMouseEnter = () => {
    on(tableContentRef.value, 'scroll', onTableContentScroll);
  };

  const onTableContentMouseLeave = () => {
    off(tableContentRef.value, 'scroll', onTableContentScroll);
  };

  const addScrollListeners = () => {
    if (props.footerAffixedBottom && affixFooterRef.value) {
      on(affixFooterRef.value, 'mouseenter', onFootMouseEnter);
      on(affixFooterRef.value, 'mouseleave', onFootMouseLeave);
    } else {
      off(affixFooterRef.value, 'mouseenter', onFootMouseEnter);
      off(affixFooterRef.value, 'mouseleave', onFootMouseLeave);
    }

    if (props.horizontalScrollAffixedBottom && horizontalScrollbarRef.value) {
      on(horizontalScrollbarRef.value, 'mouseenter', onScrollbarMouseEnter);
      on(horizontalScrollbarRef.value, 'mouseleave', onScrollbarMouseLeave);
    } else {
      off(horizontalScrollbarRef.value, 'mouseenter', onScrollbarMouseEnter);
      off(horizontalScrollbarRef.value, 'mouseleave', onScrollbarMouseLeave);
    }

    if (isAffixed.value) {
      on(tableContentRef.value, 'mouseenter', onTableContentMouseEnter);
      on(tableContentRef.value, 'mouseleave', onTableContentMouseLeave);
    } else {
      off(tableContentRef.value, 'mouseenter', onTableContentMouseEnter);
      off(tableContentRef.value, 'mouseleave', onTableContentMouseLeave);
    }
  };

  watch([affixFooterRef, horizontalScrollbarRef, tableContentRef], () => {
    const timer = setTimeout(() => {
      addScrollListeners();
      clearTimeout(timer);
    }, 0);
  });

  const addScrollListener = () => {
    if (!isAffixed.value && !props.paginationAffixedBottom) return;
    const timer = setTimeout(() => {
      if (isAffixed.value || props.paginationAffixedBottom) {
        on(document, 'scroll', onDocumentScroll);
      } else {
        off(document, 'scroll', onDocumentScroll);
      }
      clearTimeout(timer);
    });
  };

  watch(isAffixed, addScrollListener);

  watch([affixFooterRef, tableContentRef, horizontalScrollbarRef], () => {
    updateAffixHeaderOrFooter();
  });

  onBeforeMount(() => {
    off(document, 'scroll', onDocumentScroll);
    if (affixFooterRef.value) {
      off(affixFooterRef.value, 'mouseenter', onFootMouseEnter);
      off(affixFooterRef.value, 'mouseleave', onFootMouseLeave);
    }
    if (tableContentRef.value) {
      off(tableContentRef.value, 'mouseenter', onTableContentMouseEnter);
      off(tableContentRef.value, 'mouseleave', onTableContentMouseLeave);
    }
    if (horizontalScrollbarRef.value) {
      off(horizontalScrollbarRef.value, 'mouseenter', onScrollbarMouseEnter);
      off(horizontalScrollbarRef.value, 'mouseleave', onScrollbarMouseLeave);
    }
  });

  return {
    showAffixHeader,
    showAffixFooter,
    showAffixPagination,
    affixHeaderRef,
    affixFooterRef,
    horizontalScrollbarRef,
    paginationRef,
    onHorizontalScroll,
    setTableContentRef,
  };
}
