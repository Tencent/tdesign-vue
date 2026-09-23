import { ref, computed, Ref } from '@vue/composition-api';
import { TScroll } from '../common';
import { BaseTableCol, TableRowData } from './type';

export type UseVirtualColumnParams = Ref<{
  columns: BaseTableCol<TableRowData>[];
  scroll: TScroll;
  tableLayout: 'auto' | 'fixed';
  isMultipleHeader: boolean;
  thWidthList: { [colKey: string]: number };
}>;

const DEFAULT_COL_THRESHOLD = 30;
const DEFAULT_COL_BUFFER_SIZE = 5;

/**
 * 横向（列）虚拟滚动。与纵向虚拟滚动（useVirtualScrollNew）职责相互独立：
 * 1. 仅当 scroll.type === 'virtual'、tableLayout === 'fixed'、无多级表头、且列数超过阈值时启用
 * 2. 依据已采集的各列宽度（thWidthList）与容器横向滚动位置，计算可视区间内的列下标范围（含左右缓冲列）
 * 3. 固定列（fixed: left/right）始终渲染，不参与裁剪
 * 4. 未开启时返回全部列下标，不改变原有渲染行为
 */
const useVirtualColumn = (container: Ref<HTMLElement>, params: UseVirtualColumnParams) => {
  const scrollLeft = ref(0);
  const containerWidth = ref(0);

  const tScroll = computed(() => {
    const { scroll } = params.value;
    return {
      type: scroll?.type,
      colBufferSize: scroll?.colBufferSize ?? DEFAULT_COL_BUFFER_SIZE,
      colThreshold: scroll?.colThreshold ?? DEFAULT_COL_THRESHOLD,
    };
  });

  // 各列宽度：优先使用已采集的 thWidthList，缺失时回退声明宽度或估算值
  const columnWidthList = computed(() => {
    const { columns, thWidthList } = params.value;
    const fallback = 100;
    return (columns || []).map((col) => {
      const measured = thWidthList?.[col.colKey];
      if (measured && measured > 0) return measured;
      const declared = typeof col.width === 'number' ? col.width : parseFloat(String(col.width || ''));
      return Number.isFinite(declared) && declared > 0 ? declared : fallback;
    });
  });

  // 各列左侧累计偏移，长度 = 列数 + 1，末位为总宽度
  const columnOffsetList = computed(() => {
    const widthList = columnWidthList.value;
    const offsets: number[] = [0];
    for (let i = 0; i < widthList.length; i++) {
      offsets.push(offsets[i] + widthList[i]);
    }
    return offsets;
  });

  const isMultipleHeader = computed(() => !!params.value.isMultipleHeader);
  const columnCount = computed(() => (params.value.columns || []).length);

  const isVirtualColumn = computed(() => tScroll.value.type === 'virtual'
    && params.value.tableLayout === 'fixed'
    && !isMultipleHeader.value
    && columnCount.value > tScroll.value.colThreshold);

  // 依据 scrollLeft、containerWidth 计算可视列下标区间 [start, end)（含缓冲列）
  const visibleColRange = computed<[number, number]>(() => {
    if (!isVirtualColumn.value) return [0, columnCount.value];
    const offsets = columnOffsetList.value;
    const left = scrollLeft.value;
    const right = left + (containerWidth.value || 0);
    let startIndex = 0;
    while (startIndex < columnCount.value && offsets[startIndex + 1] < left) startIndex += 1;
    let endIndex = startIndex;
    while (endIndex < columnCount.value && offsets[endIndex] < right) endIndex += 1;
    const buffer = tScroll.value.colBufferSize;
    const start = Math.max(0, startIndex - buffer);
    const end = Math.min(columnCount.value, endIndex + buffer);
    return [start, end];
  });

  // 是否裁剪某一列：固定列始终渲染；区间内的列渲染；区间外的非固定列被裁剪
  const isColumnVisible = (colIndex: number, col: BaseTableCol<TableRowData>) => {
    if (!isVirtualColumn.value) return true;
    if (col.fixed === 'left' || col.fixed === 'right') return true;
    const [start, end] = visibleColRange.value;
    return colIndex >= start && colIndex < end;
  };

  // 左右占位单元格：裁剪掉的列以两个占位 <td> 承担，用 colspan 覆盖被裁剪的列数（不含固定列），
  // 从而使 colgroup 的 <col> 数量保持不变（表头列数不受影响），只有 tbody 每行渲染的 <td> 数量减少
  const spacerInfo = computed(() => {
    if (!isVirtualColumn.value) return { left: { width: 0, colSpan: 0 }, right: { width: 0, colSpan: 0 } };
    const [start, end] = visibleColRange.value;
    const columns = params.value.columns || [];
    let leftWidth = 0;
    let leftColSpan = 0;
    let rightWidth = 0;
    let rightColSpan = 0;
    for (let i = 0; i < start; i++) {
      if (columns[i]?.fixed !== 'left' && columns[i]?.fixed !== 'right') {
        leftWidth += columnWidthList.value[i];
        leftColSpan += 1;
      }
    }
    for (let i = end; i < columns.length; i++) {
      if (columns[i]?.fixed !== 'left' && columns[i]?.fixed !== 'right') {
        rightWidth += columnWidthList.value[i];
        rightColSpan += 1;
      }
    }
    return { left: { width: leftWidth, colSpan: leftColSpan }, right: { width: rightWidth, colSpan: rightColSpan } };
  });

  const handleScroll = () => {
    if (!container.value) return;
    scrollLeft.value = container.value.scrollLeft;
    containerWidth.value = container.value.getBoundingClientRect().width;
  };

  const refreshContainer = () => {
    if (!container.value) return;
    containerWidth.value = container.value.getBoundingClientRect().width;
    scrollLeft.value = container.value.scrollLeft;
  };

  return {
    isVirtualColumn,
    visibleColRange,
    isColumnVisible,
    spacerInfo,
    handleScroll,
    refreshContainer,
  };
};

export type VirtualColumnConfig = ReturnType<typeof useVirtualColumn>;

export default useVirtualColumn;
