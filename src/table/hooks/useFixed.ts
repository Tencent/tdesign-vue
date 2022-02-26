import {
  ref, reactive, onMounted, watch, computed, toRefs,
} from '@vue/composition-api';
import { ClassName, Styles } from '../../common';
import { TdBaseTableProps } from '../type';
import { TABLE_CLASS_COLUMN_FIXED, TABLE_CLASS_ROW_FIXED } from './useStyle';

// 固定行的数量不得超过 70 - 50 = 20
const FIXED_ROW_MAX_Z_INDEX = 70;

export interface ColumnStickyLeftAndRight {
  left: number[];
  right: number[];
  top: number[];
  bottom?: number[];
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

// 固定行相关类名处理
export function getRowFixedStyles(
  rowIndex: number,
  columnStickyLeftAndRight: ColumnStickyLeftAndRight,
  rowLength: number,
  fixedRows: TdBaseTableProps['fixedRows'],
  hasFoot: boolean,
): { style: Styles; classes: ClassName } {
  if (!fixedRows || !fixedRows.length) return { style: undefined, classes: undefined };
  const pos = columnStickyLeftAndRight;
  const fixedTop = rowIndex < fixedRows[0];
  const fixedBottom = rowIndex > rowLength - 1 - fixedRows[1];
  const firstFixedBottomRow = rowLength - pos.bottom.length + 1;
  const rowClasses = {
    [TABLE_CLASS_ROW_FIXED.top]: fixedTop,
    [TABLE_CLASS_ROW_FIXED.bottom]: fixedBottom,
    [TABLE_CLASS_ROW_FIXED.firstBottom]: rowIndex === firstFixedBottomRow,
    [TABLE_CLASS_ROW_FIXED.withoutBorderBottom]: rowIndex === firstFixedBottomRow - 1,
  };
  let zIndex = FIXED_ROW_MAX_Z_INDEX;
  if (fixedTop) {
    zIndex = FIXED_ROW_MAX_Z_INDEX - rowIndex;
  } else if (fixedBottom) {
    zIndex = FIXED_ROW_MAX_Z_INDEX - rowIndex + 1;
  }
  const bottomPos = hasFoot ? rowLength - rowIndex : rowLength - rowIndex - 1;
  const rowStyles = {
    top: fixedTop ? pos.top[rowIndex + 1] && `${pos.top[rowIndex + 1]}px` : undefined,
    bottom: fixedBottom ? `${pos.bottom[bottomPos]}px` : undefined,
    zIndex,
  };
  return {
    style: rowStyles,
    classes: rowClasses,
  };
}

const defaultStickyPos: ColumnStickyLeftAndRight = {
  right: [],
  left: [],
  top: [],
  bottom: [],
};

export default function useFixed(props: TdBaseTableProps) {
  const {
    data, columns, tableLayout, tableContentWidth, fixedRows, firstFullRow, lastFullRow, maxHeight,
  } = toRefs(props);
  const tableContentRef = ref();
  const tableRef = ref();
  const isFixedHeader = ref(false);
  // 固定列、固定表头、固定表尾等内容的位置信息
  const columnStickyLeftAndRight = ref<ColumnStickyLeftAndRight>(defaultStickyPos);
  const showColumnShadow = reactive({
    left: false,
    right: false,
  });

  const isFixedColumn = computed<boolean>(() => !!columns.value.find((col) => ['left', 'right'].includes(col.fixed)));

  const updateFixedHeader = () => {
    const timer = setTimeout(() => {
      if (!tableContentRef.value) return;
      isFixedHeader.value = tableContentRef.value.scrollHeight > tableContentRef.value.clientHeight;
      clearTimeout(timer);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  };

  // 此处不使用 querySelectorAll 是为了保证获取到绝对直接子节点，不影响子孙节点
  const getThNodeList = (tableContentElm: HTMLElement): HTMLElement[] => {
    if (!tableContentElm) return;
    const thArr: HTMLElement[] = [];
    const tableChildren = tableContentElm.children[0]?.children;
    for (let i = 0, len = tableChildren.length; i < len; i++) {
      if (tableChildren[i].tagName.toLowerCase() === 'thead') {
        const trChildren = tableChildren[i].children[0].children;
        for (let j = 0, trLen = trChildren.length; j < trLen; j++) {
          thArr.push(trChildren[j] as HTMLElement);
        }
        break;
      }
    }
    return thArr;
  };

  const getTrNodeList = (tableContentElm: HTMLElement): HTMLElement[] => {
    if (!tableContentElm) return;
    const trArr: HTMLElement[] = [];
    const tableChildren = tableContentElm.children[0]?.children;
    for (let i = 0, len = tableChildren.length; i < len; i++) {
      if (['thead', 'tbody', 'tfoot'].includes(tableChildren[i].tagName.toLowerCase())) {
        const trs = tableChildren[i].children;
        for (let j = 0, trLen = trs.length; j < trLen; j++) {
          trArr.push(trs[j] as HTMLElement);
        }
      }
    }
    return trArr;
  };

  // 左侧或右侧固定列需要计算位置（left/right）
  const setColumnsStickyLeftAndRight = (tableContentElm: HTMLElement): ColumnStickyLeftAndRight => {
    if (!tableContentElm) return;
    const stickyPos: ColumnStickyLeftAndRight = {
      left: [0],
      top: [0],
      right: [0],
      bottom: [0],
    };
    // 固定列
    const thList: HTMLElement[] = getThNodeList(tableContentElm);
    if (isFixedColumn && thList?.length) {
      const len = thList.length;
      for (let i = 1; i < len; i++) {
        if (props.columns[i].fixed !== 'left') break;
        const width = thList[i - 1].offsetWidth;
        const left = stickyPos.left[i - 1] + width;
        stickyPos.left.push(left);
      }
      for (let i = len - 2; i >= 0; i--) {
        if (props.columns[i].fixed !== 'right') break;
        const width = thList[i + 1].offsetWidth;
        const left = stickyPos.right[len - (i + 2)] + width;
        stickyPos.right.push(left);
      }
    }

    // 冻结行
    const trList = getTrNodeList(tableContentElm);
    if (fixedRows.value?.length && trList?.length) {
      for (let i = 1; i <= fixedRows.value[0]; i++) {
        const height = trList[i - 1].offsetHeight;
        const top = (stickyPos.top[i - 1] || 0) + height;
        stickyPos.top.push(top);
      }
      const len = trList.length;
      const min = len - 1 - fixedRows.value[1];
      for (let i = len - 2; i >= min; i--) {
        const height = trList[i + 1].offsetHeight;
        const bottom = (stickyPos.bottom[len - (i + 2)] || 0) + height;
        stickyPos.bottom.push(bottom);
      }
    }
    columnStickyLeftAndRight.value = stickyPos;
  };

  const updateColumnFixedStatus = (target: HTMLElement) => {
    const isShowRight = target.clientWidth + target.scrollLeft !== target.scrollWidth;
    showColumnShadow.left = target.scrollLeft !== 0;
    showColumnShadow.right = isShowRight;
  };

  const onTableContentScroll = (e: WheelEvent) => {
    props.onScrollX?.({ e });
    const target = (e.target || e.srcElement) as HTMLElement;
    updateColumnFixedStatus(target);
  };

  const updateFixedStatus = () => {
    const timer = setTimeout(() => {
      if (isFixedColumn.value) {
        updateColumnFixedStatus(tableContentRef.value);
      }
      if (isFixedColumn.value || fixedRows.value?.length) {
        setColumnsStickyLeftAndRight(tableContentRef.value);
      }
      clearTimeout(timer);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  };

  watch(
    [data, columns, tableLayout, tableContentWidth, isFixedHeader, fixedRows, firstFullRow, lastFullRow, isFixedColumn],
    updateFixedStatus,
  );

  watch([maxHeight], updateFixedHeader);

  onMounted(updateFixedStatus);

  onMounted(updateFixedHeader);

  return {
    isFixedHeader,
    tableRef,
    tableContentRef,
    isFixedColumn,
    columnStickyLeftAndRight,
    showColumnShadow,
    setColumnsStickyLeftAndRight,
    onTableContentScroll,
    updateColumnFixedStatus,
  };
}
