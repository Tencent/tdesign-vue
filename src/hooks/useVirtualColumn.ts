/**
 * 表格横向（列）虚拟滚动。
 * 与 useVirtualScrollNew（纵向/行虚拟滚动）职责分离，独立文件维护，避免相互影响。
 *
 * 设计取舍：
 * 1. 仅在 tableLayout === 'fixed' 且未出现多级表头（isMultipleHeader = false）时启用，
 *    避免与 colspan/rowspan 计算及 auto 布局宽度探测逻辑冲突。
 * 2. 依赖 thWidthList（各列已渲染宽度）计算累积偏移，在宽度尚未采集完成前不启用，
 *    避免因为宽度未知导致裁剪范围计算错误。
 * 3. 固定列（fixed: left / right）永远保留在可视集合之外，不参与横向裁剪。
 */
import { ref, computed, Ref } from '@vue/composition-api';
import { TScroll } from '../common';
import { BaseTableCol, TableRowData } from '../table/type';

export type UseVirtualColumnParams = Ref<{
  columns: BaseTableCol<TableRowData>[];
  scroll: TScroll;
  isMultipleHeader: boolean;
  tableLayout: string;
  thWidthList: { [colKey: string]: number };
}>;

export interface VisibleColumnRange {
  /** 可视区域内（含左右 buffer）第一个非固定列在 columns 中的下标 */
  startIndex: number;
  /** 可视区域内（含左右 buffer）最后一个非固定列在 columns 中的下标（不含） */
  endIndex: number;
  /** 起始下标之前，被裁剪掉的非固定列宽度总和，用于渲染左侧占位单元格 */
  leftPlaceholderWidth: number;
  /** 结束下标之后，被裁剪掉的非固定列宽度总和，用于渲染右侧占位单元格 */
  rightPlaceholderWidth: number;
}

const DEFAULT_COL_BUFFER = 5;
// 与 useVirtualScrollNew 的 threshold 语义保持一致：低于该列数不开启横向虚拟滚动
const DEFAULT_COL_THRESHOLD = 30;

const useVirtualColumn = (container: Ref<HTMLElement>, params: UseVirtualColumnParams) => {
  const startAndEndIndex = ref<[number, number]>([0, Number.MAX_SAFE_INTEGER]);
  const containerScrollLeft = ref(0);
  const containerClientWidth = ref(0);

  const colBufferSize = computed(() => params.value.scroll?.colBufferSize ?? DEFAULT_COL_BUFFER);
  const colThreshold = computed(() => params.value.scroll?.colThreshold ?? DEFAULT_COL_THRESHOLD);

  // 是否满足开启列虚拟滚动的前提条件
  const isColumnVirtualizable = computed(() => {
    const {
      scroll, columns, isMultipleHeader, tableLayout,
    } = params.value;
    if (scroll?.type !== 'virtual') return false;
    if (isMultipleHeader) return false;
    if (tableLayout !== 'fixed') return false;
    return (columns?.length || 0) > colThreshold.value;
  });

  // 各列宽度是否已经采集完成（存在缺失时不能安全裁剪，否则会造成占位宽度计算错误）
  const isThWidthListReady = computed(() => {
    const { columns, thWidthList } = params.value;
    if (!columns?.length) return false;
    return columns.every((col) => typeof thWidthList?.[col.colKey] === 'number' && thWidthList[col.colKey] > 0);
  });

  const isVirtualColumn = computed(() => isColumnVirtualizable.value && isThWidthListReady.value);

  // 非固定列在 columns 中的原始下标列表（fixed 列始终不参与裁剪）
  const nonFixedIndexList = computed(() => {
    const { columns } = params.value;
    const list: number[] = [];
    (columns || []).forEach((col, index) => {
      if (!col.fixed) list.push(index);
    });
    return list;
  });

  const colOffsetList = computed(() => {
    const { columns, thWidthList } = params.value;
    const offsets: number[] = [];
    let acc = 0;
    (columns || []).forEach((col) => {
      offsets.push(acc);
      acc += thWidthList?.[col.colKey] || 0;
    });
    return offsets;
  });

  const visibleColumnRange = computed<VisibleColumnRange>(() => {
    const { columns, thWidthList } = params.value;
    const fallback: VisibleColumnRange = {
      startIndex: 0,
      endIndex: columns?.length || 0,
      leftPlaceholderWidth: 0,
      rightPlaceholderWidth: 0,
    };
    if (!isVirtualColumn.value) return fallback;

    const offsets = colOffsetList.value;
    const nonFixed = nonFixedIndexList.value;
    if (!nonFixed.length) return fallback;

    const viewLeft = containerScrollLeft.value;
    const viewRight = viewLeft + containerClientWidth.value;

    let firstVisiblePos = 0;
    let lastVisiblePos = nonFixed.length - 1;
    for (let i = 0; i < nonFixed.length; i++) {
      const colIndex = nonFixed[i];
      const colRight = offsets[colIndex] + (thWidthList[columns[colIndex].colKey] || 0);
      if (colRight > viewLeft) { firstVisiblePos = i; break; }
      firstVisiblePos = i;
    }
    for (let i = nonFixed.length - 1; i >= 0; i--) {
      const colIndex = nonFixed[i];
      if (offsets[colIndex] < viewRight) { lastVisiblePos = i; break; }
      lastVisiblePos = i;
    }

    const bufferedFirstPos = Math.max(0, firstVisiblePos - colBufferSize.value);
    const bufferedLastPos = Math.min(nonFixed.length - 1, lastVisiblePos + colBufferSize.value);

    const startIndex = nonFixed[bufferedFirstPos];
    const endIndex = nonFixed[bufferedLastPos] + 1;

    let leftPlaceholderWidth = 0;
    for (let i = 0; i < bufferedFirstPos; i++) {
      const colIndex = nonFixed[i];
      leftPlaceholderWidth += thWidthList[columns[colIndex].colKey] || 0;
    }
    let rightPlaceholderWidth = 0;
    for (let i = bufferedLastPos + 1; i < nonFixed.length; i++) {
      const colIndex = nonFixed[i];
      rightPlaceholderWidth += thWidthList[columns[colIndex].colKey] || 0;
    }

    startAndEndIndex.value = [startIndex, endIndex];
    return {
      startIndex, endIndex, leftPlaceholderWidth, rightPlaceholderWidth,
    };
  });

  const handleColumnScroll = () => {
    if (!container.value) return;
    containerScrollLeft.value = container.value.scrollLeft;
    containerClientWidth.value = container.value.clientWidth;
  };

  const refreshContainerMetrics = () => {
    if (!container.value) return;
    containerScrollLeft.value = container.value.scrollLeft;
    containerClientWidth.value = container.value.clientWidth;
  };

  return {
    isVirtualColumn,
    visibleColumnRange,
    handleColumnScroll,
    refreshContainerMetrics,
  };
};

export type VirtualColumnConfig = ReturnType<typeof useVirtualColumn>;

export default useVirtualColumn;
