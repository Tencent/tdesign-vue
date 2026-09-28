/**
 * 横向虚拟滚动：列数量较多时，同一时刻仅渲染可视区域内的列，避免一次性渲染 列数 × 行数 个单元格导致页面卡顿。
 * 与纵向虚拟滚动（useVirtualScrollNew）相互独立，互不干扰。
 */
import {
  ref, computed, watch, Ref,
} from '@vue/composition-api';
import { TScroll } from '../../common';
import { BaseTableCol, TableRowData } from '../type';

export type UseHorizontalVirtualScrollParams = Ref<{
  /** 列数据（叶子列） */
  columns: BaseTableCol<TableRowData>[];
  scroll: TScroll;
}>;

const DEFAULT_COLUMN_WIDTH = 120;

interface NormalizedHorizontalScroll {
  enableHorizontalVirtual?: boolean;
  columnWidth?: number;
  defaultColumnWidth?: number;
  columnBufferSize?: number;
  type?: TScroll['type'];
}

/** 解析列宽：优先 col.width，其次 scroll.columnWidth，最后默认宽度 */
const resolveColumnWidth = (col: BaseTableCol<TableRowData>, scroll: NormalizedHorizontalScroll): number => {
  const raw = col.width ?? scroll?.columnWidth;
  if (raw === undefined || raw === null) return scroll?.defaultColumnWidth || DEFAULT_COLUMN_WIDTH;
  const num = typeof raw === 'number' ? raw : parseFloat(String(raw));
  return Number.isFinite(num) && num > 0 ? num : scroll?.defaultColumnWidth || DEFAULT_COLUMN_WIDTH;
};

const useHorizontalVirtualScroll = (
  container: Ref<HTMLElement>,
  params: UseHorizontalVirtualScrollParams,
) => {
  const containerWidth = ref(0);
  const scrollLeft = ref(0);
  const startAndEndIndex = ref<[number, number]>([0, 0]);

  const tScroll = computed(() => {
    const { scroll } = params.value;
    if (!scroll) return {};
    return {
      enableHorizontalVirtual: scroll.enableHorizontalVirtual ?? false,
      columnWidth: scroll.columnWidth,
      defaultColumnWidth: scroll.defaultColumnWidth || DEFAULT_COLUMN_WIDTH,
      columnBufferSize: scroll.columnBufferSize ?? 5,
      type: scroll.type,
    };
  });

  /** 累计列偏移：columnOffsets[i] 表示第 i 列左侧相对内容起点的距离 */
  const columnOffsets = computed(() => {
    const { columns } = params.value;
    const offsets: number[] = [];
    let acc = 0;
    for (let i = 0, len = columns.length; i < len; i++) {
      offsets[i] = acc;
      acc += resolveColumnWidth(columns[i], tScroll.value);
    }
    return offsets;
  });

  const totalWidth = computed(() => {
    const offsets = columnOffsets.value;
    const last = offsets.length - 1;
    if (last < 0) return 0;
    const { columns } = params.value;
    return offsets[last] + resolveColumnWidth(columns[last], tScroll.value);
  });

  /** 只有显式开启且列数确实超出可视宽度时才启用，避免改变既有行为 */
  const isHorizontalVirtualScroll = computed(() => {
    const { columns } = params.value;
    if (!tScroll.value.enableHorizontalVirtual || !columns?.length) return false;
    if (!containerWidth.value) return false;
    return totalWidth.value > containerWidth.value;
  });

  const updateVisibleRange = () => {
    const { columns } = params.value;
    if (!columns?.length) return;
    if (!isHorizontalVirtualScroll.value) {
      if (startAndEndIndex.value[1] !== columns.length) {
        startAndEndIndex.value = [0, columns.length];
      }
      return;
    }
    const offsets = columnOffsets.value;
    const buffer = tScroll.value.columnBufferSize;
    const left = scrollLeft.value;
    const right = left + containerWidth.value;

    let startIndex = 0;
    for (let i = 0, len = offsets.length; i < len; i++) {
      const colRight = offsets[i] + resolveColumnWidth(columns[i], tScroll.value);
      if (colRight > left) {
        startIndex = i;
        break;
      }
    }
    let endIndex = startIndex;
    for (let i = startIndex, len = offsets.length; i < len; i++) {
      endIndex = i + 1;
      if (offsets[i] >= right) break;
    }

    startIndex = Math.max(0, startIndex - buffer);
    endIndex = Math.min(columns.length, endIndex + buffer);
    if (startAndEndIndex.value.join() !== [startIndex, endIndex].join()) {
      startAndEndIndex.value = [startIndex, endIndex];
    }
  };

  /** 可视列（左固定列单独处理，由调用方保证始终渲染） */
  const visibleColumns = computed(() => {
    const { columns } = params.value;
    if (!columns?.length) return [];
    if (!isHorizontalVirtualScroll.value) return columns;
    const [start, end] = startAndEndIndex.value;
    return columns.slice(start, end);
  });

  /** 已渲染列左侧需要平移的距离，用于保持列在正确的横向位置 */
  const translateX = computed(() => {
    if (!isHorizontalVirtualScroll.value) return 0;
    return columnOffsets.value[startAndEndIndex.value[0]] || 0;
  });

  const updateContainerWidth = () => {
    if (!container.value) return;
    const rect = container.value.getBoundingClientRect();
    // jsdom 或隐藏容器下 rect 可能为 0，退化为 clientWidth/offsetWidth
    const width = rect.width || container.value.clientWidth || container.value.offsetWidth || 0;
    containerWidth.value = width;
    updateVisibleRange();
  };

  const handleScroll = () => {
    if (!container.value) return;
    scrollLeft.value = container.value.scrollLeft;
    updateVisibleRange();
  };

  watch(
    () => [params.value.columns, tScroll.value, container.value],
    () => {
      updateContainerWidth();
      updateVisibleRange();
    },
    { immediate: true },
  );

  return {
    visibleColumns,
    translateX,
    isHorizontalVirtualScroll,
    handleScroll,
    updateContainerWidth,
    totalWidth,
    columnOffsets,
  };
};

export type HorizontalVirtualScrollConfig = ReturnType<typeof useHorizontalVirtualScroll>;

export default useHorizontalVirtualScroll;
