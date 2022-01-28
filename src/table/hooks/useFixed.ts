import {
  ref, reactive, onMounted, onUpdated, computed,
} from '@vue/composition-api';
import { ClassName, Styles } from '../../common';
import { TdBaseTableProps } from '../type';
import { TABLE_CLASS_COLUMN_FIXED } from './useStyle';

export interface ColumnStickyLeftAndRight {
  left: number[];
  right: number[];
}

// 固定列相关类名处理
export function getColumnFixedStyles(
  col: TdBaseTableProps['columns'][0],
  index: number,
  columnStickyLeftAndRight: ColumnStickyLeftAndRight,
  colLength: number,
): { style: Styles; classes: ClassName } {
  const pos = columnStickyLeftAndRight;
  const posLefLength = pos.left.length;
  const posRightLength = pos.right.length;
  const thClasses = {
    [TABLE_CLASS_COLUMN_FIXED.left]: col.fixed === 'left',
    [TABLE_CLASS_COLUMN_FIXED.right]: col.fixed === 'right',
    [TABLE_CLASS_COLUMN_FIXED.lastLeft]: col.fixed === 'left' && posLefLength - 1 === index,
    [TABLE_CLASS_COLUMN_FIXED.firstRight]: col.fixed === 'right' && index + posRightLength === colLength,
  };
  const thStyles = {
    left: col.fixed === 'left' ? pos.left[index] && `${pos.left[index]}px` : undefined,
    right: col.fixed === 'right' ? `${pos.right[colLength - index - 1]}px` : undefined,
  };
  return {
    style: thStyles,
    classes: thClasses,
  };
}

export default function useFixed(props: TdBaseTableProps) {
  const tableContentRef = ref();
  const isFixedHeader = ref(false);
  const columnStickyLeftAndRight = ref<ColumnStickyLeftAndRight>({ right: [], left: [] });
  const showColumnShadow = reactive({
    left: false,
    right: false,
  });

  const isFixedColumn = computed<boolean>(() => !!props.columns.find((col) => ['left', 'right'].includes(col.fixed)));

  const setIsFixedHeader = () => {
    const timer = setTimeout(() => {
      isFixedHeader.value = tableContentRef.value.scrollHeight > tableContentRef.value.clientHeight;
      clearTimeout(timer);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  };

  // 左侧或右侧固定列需要计算位置（left/right）
  const setColumnsStickyLeftAndRight = (tableContentElm: HTMLElement) => {
    if (!tableContentElm) return;
    // t-table__content -> table -> tr -> th
    const tr = tableContentElm.querySelectorAll('thead.t-table__header > tr > th');
    const stickyLeft: number[] = [0];
    const stickyRight: number[] = [0];
    if (tr?.length) {
      const len = tr.length;
      for (let i = 1; i < len; i++) {
        if (props.columns[i].fixed !== 'left') break;
        const width = tr[i - 1].clientWidth;
        const left = stickyLeft[i - 1] + width;
        stickyLeft.push(left);
      }
      for (let i = len - 2; i >= 0; i--) {
        if (props.columns[i].fixed !== 'right') break;
        const width = tr[i + 1].clientWidth;
        const left = stickyRight[len - (i + 2)] + width;
        stickyRight.push(left);
      }
    }
    columnStickyLeftAndRight.value = {
      left: stickyLeft,
      right: stickyRight,
    };
  };

  const updateColumnFixedStatus = (target: HTMLElement) => {
    showColumnShadow.left = target.scrollLeft !== 0;
    showColumnShadow.right = target.clientWidth + target.scrollLeft !== target.scrollWidth;
  };

  const onTableContentScroll = (e: WheelEvent) => {
    props.onScrollX?.({ e });
    const target = (e.target || e.srcElement) as HTMLElement;
    updateColumnFixedStatus(target);
  };

  onMounted(setIsFixedHeader);

  onUpdated(setIsFixedHeader);

  return {
    isFixedHeader,
    tableContentRef,
    isFixedColumn,
    columnStickyLeftAndRight,
    showColumnShadow,
    setColumnsStickyLeftAndRight,
    onTableContentScroll,
    updateColumnFixedStatus,
  };
}
