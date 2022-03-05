import {
  ref, reactive, watch, toRefs,
} from '@vue/composition-api';
import get from 'lodash/get';
import log from '../../_common/js/log';
import { ClassName, Styles } from '../../common';
import { BaseTableCol, TdBaseTableProps } from '../type';
import { TABLE_CLASS_COLUMN_FIXED, TABLE_CLASS_ROW_FIXED } from './useStyle';

// 固定表头，固定列，固定行，不麻烦。但是加上多级表头，你试试，加上合并单元格，你再试试。

// 固定行的数量不得超过 70 - 50 = 20
const FIXED_ROW_MAX_Z_INDEX = 70;

export interface ColumnStickyLeftAndRight {
  left: number[];
  right: number[];
  top: number[];
  bottom?: number[];
}

export interface FixedColumnInfo {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  parent?: string;
  children?: string[];
  offsetWidth?: number;
  clientWidth?: number;
  offsetHeight?: number;
  clientHeight?: number;
  col?: BaseTableCol;
  index?: number;
  lastLeftFixedCol?: boolean;
  firstRightFixedCol?: boolean;
}

// 固定表头和固定列 具体的固定位置（left/top/right/bottom）
export type RowAndColFixedPosition = Map<string | number, FixedColumnInfo>;

// 固定列相关类名处理
export function getColumnFixedStyles(
  col: TdBaseTableProps['columns'][0],
  index: number,
  rowAndColFixedPosition: RowAndColFixedPosition,
): { style?: Styles; classes?: ClassName } {
  const fixedPos = rowAndColFixedPosition?.get(col.colKey || index);
  if (!fixedPos) return {};
  const thClasses = {
    [TABLE_CLASS_COLUMN_FIXED.left]: col.fixed === 'left',
    [TABLE_CLASS_COLUMN_FIXED.right]: col.fixed === 'right',
    [TABLE_CLASS_COLUMN_FIXED.lastLeft]: col.fixed === 'left' && fixedPos.lastLeftFixedCol,
    [TABLE_CLASS_COLUMN_FIXED.firstRight]: col.fixed === 'right' && fixedPos.firstRightFixedCol,
  };
  const thStyles = {
    left: col.fixed === 'left' ? `${fixedPos.left}px` : undefined,
    right: col.fixed === 'right' ? `${fixedPos.right}px` : undefined,
  };
  return {
    style: thStyles,
    classes: thClasses,
  };
}

// 固定行相关类名处理
export function getRowFixedStyles(
  rowId: string | number,
  rowIndex: number,
  rowLength: number,
  fixedRows: TdBaseTableProps['fixedRows'],
  rowAndColFixedPosition: RowAndColFixedPosition,
): { style: Styles; classes: ClassName } {
  if (!fixedRows || !fixedRows.length) return { style: undefined, classes: undefined };
  const fixedTop = rowIndex < fixedRows[0];
  const fixedBottom = rowIndex > rowLength - 1 - fixedRows[1];
  const firstFixedBottomRow = rowLength - fixedRows[1];
  const fixedPos = rowAndColFixedPosition?.get(rowId) || {};
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
  const rowStyles = {
    top: fixedTop ? `${fixedPos.top}px` : undefined,
    bottom: fixedBottom ? `${fixedPos.bottom}px` : undefined,
    zIndex,
  };
  return {
    style: rowStyles,
    classes: rowClasses,
  };
}

export default function useFixed(props: TdBaseTableProps) {
  const {
    data, columns, tableLayout, tableContentWidth, fixedRows, firstFullRow, lastFullRow, maxHeight,
  } = toRefs(props);
  const tableContentRef = ref();
  const tableRef = ref();
  const isFixedHeader = ref(false);
  // 固定列、固定表头、固定表尾等内容的位置信息
  const rowAndColFixedPosition = ref<RowAndColFixedPosition>(new Map());
  const showColumnShadow = reactive({
    left: false,
    right: false,
  });
  // 虚拟滚动不能使用 CSS sticky 固定表头
  const virtualScrollHeaderPos = ref<{ left: number; top: number }>({ left: 0, top: 0 });
  const tableWidth = ref();

  const isFixedColumn = ref(false);

  function getColumnMap(
    columns: BaseTableCol[],
    map: RowAndColFixedPosition = new Map(),
    levelNodes: FixedColumnInfo[][] = [],
    level = 0,
    parent = '',
  ) {
    for (let i = 0, len = columns.length; i < len; i++) {
      const col = columns[i];
      if (['left', 'right'].includes(col.fixed)) {
        isFixedColumn.value = true;
      }
      const key = col.colKey || i;
      const columnInfo: FixedColumnInfo = { col, parent, index: i };
      map.set(key, columnInfo);
      if (col.children?.length) {
        getColumnMap(col.children, map, levelNodes, level + 1, col.colKey);
      }
      if (levelNodes[level]) {
        levelNodes[level].push(columnInfo);
      } else {
        // eslint-disable-next-line no-param-reassign
        levelNodes[level] = [columnInfo];
      }
    }
    return {
      newColumnsMap: map,
      levelNodes,
    };
  }

  const setFixedLeftPos = (
    columns: BaseTableCol[],
    initialColumnMap: RowAndColFixedPosition,
    parent: FixedColumnInfo = {},
  ) => {
    for (let i = 0, len = columns.length; i < len; i++) {
      const col = columns[i];
      if (!col.fixed) return;
      const colInfo = initialColumnMap.get(col.colKey || i);
      // 多级表头，使用父元素作为初始基本位置
      const defaultWidth = i === 0 ? parent?.left || 0 : 0;
      const lastCol = columns[i - 1];
      const lastColInfo = initialColumnMap.get(lastCol?.colKey || i - 1);
      const isNextColFixed = columns[i + 1]?.fixed;
      // 最后一层 header 的最后一列使用 clientWidth
      const width = !isNextColFixed && (!col.children || !col.children.length)
        ? lastColInfo?.clientWidth
        : lastColInfo?.offsetWidth;
      // const width = lastColInfo?.clientWidth;
      colInfo.left = (lastColInfo?.left || defaultWidth) + (width || 0);
      // 多级表头
      if (col.children?.length) {
        setFixedLeftPos(col.children, initialColumnMap, colInfo);
      }
    }
  };

  const setFixedRightPos = (
    columns: BaseTableCol[],
    initialColumnMap: RowAndColFixedPosition,
    parent: FixedColumnInfo = {},
  ) => {
    for (let i = columns.length - 1; i >= 0; i--) {
      const col = columns[i];
      if (!col.fixed) return;
      const colInfo = initialColumnMap.get(col.colKey || i);
      const lastCol = columns[i + 1];
      // 多级表头，使用父元素作为初始基本位置
      const defaultWidth = i === columns.length - 1 ? parent?.right || 0 : 0;
      const lastColInfo = initialColumnMap.get(lastCol?.colKey || i + 1);
      // 最后一层 header 的最后一列使用 clientWidth
      const isLastColFixed = columns[i - 1]?.fixed;
      const width = !isLastColFixed && (!col.children || !col.children.length)
        ? lastColInfo?.clientWidth
        : lastColInfo?.offsetWidth;
      // const width = lastColInfo?.clientWidth;
      colInfo.right = (lastColInfo?.right || defaultWidth) + (width || 0);
      // 多级表头
      if (col.children?.length) {
        setFixedRightPos(col.children, initialColumnMap, colInfo);
      }
    }
  };

  // 获取固定列位置信息。先获取节点宽度 offsetWidth，再计算
  const setFixedColPosition = (trList: HTMLCollection, initialColumnMap: RowAndColFixedPosition) => {
    if (!trList) return;
    for (let i = 0, len = trList.length; i < len; i++) {
      const thList = trList[i].children;
      for (let j = 0, thLen = thList.length; j < thLen; j++) {
        const th = thList[j] as HTMLElement;
        const colKey = th.dataset.colkey;
        if (!colKey) {
          log.warn('TDesign Table', `${th.innerText} missing colKey. colKey is required for fixed column feature.`);
        }
        const obj = initialColumnMap.get(colKey || j);
        if (obj?.col?.fixed) {
          initialColumnMap.set(colKey, { ...obj, offsetWidth: th.offsetWidth, clientWidth: th.clientWidth });
        }
      }
    }
    setFixedLeftPos(columns.value, initialColumnMap);
    setFixedRightPos(columns.value, initialColumnMap);
  };

  // 设置固定行位置信息 top/bottom
  const setFixedRowPosition = (
    trList: HTMLCollection,
    initialColumnMap: RowAndColFixedPosition,
    thead: HTMLTableSectionElement,
    tfoot: HTMLTableSectionElement,
  ) => {
    const [fixedTopRows, fixedBottomRows] = fixedRows.value || [];
    const { data, rowKey = 'id' } = props;
    for (let i = 0; i < fixedTopRows; i++) {
      const tr = trList[i] as HTMLElement;
      const rowId = get(data[i], rowKey);
      const thisRowInfo = initialColumnMap.get(rowId) || {};
      const lastRowId = get(data[i - 1], rowKey);
      const lastRowInfo = initialColumnMap.get(lastRowId) || {};
      let defaultBottom = 0;
      if (i === 0) {
        defaultBottom = thead?.offsetHeight || 0;
      }
      thisRowInfo.top = (lastRowInfo.top || defaultBottom) + (lastRowInfo.offsetHeight || 0);
      initialColumnMap.set(rowId, { ...thisRowInfo, offsetHeight: tr.offsetHeight, clientHeight: tr.clientHeight });
    }
    for (let i = data.length - 1; i >= data.length - fixedBottomRows; i--) {
      const tr = trList[i] as HTMLElement;
      const rowId = get(data[i], rowKey);
      const thisRowInfo = initialColumnMap.get(rowId) || {};
      const lastRowId = get(data[i + 1], rowKey);
      const lastRowInfo = initialColumnMap.get(lastRowId) || {};
      let defaultBottom = 0;
      if (i === data.length - 1) {
        defaultBottom = tfoot?.offsetHeight || 0;
      }
      thisRowInfo.bottom = (lastRowInfo.bottom || defaultBottom) + (lastRowInfo.offsetHeight || 0);
      initialColumnMap.set(rowId, { ...thisRowInfo, offsetHeight: tr.offsetHeight, clientHeight: tr.clientHeight });
    }
  };

  const setRowAndColFixedPosition = (tableContentElm: HTMLElement, initialColumnMap: RowAndColFixedPosition) => {
    rowAndColFixedPosition.value.clear();
    const thead = tableContentElm.querySelector('thead');
    // 处理固定列
    thead && setFixedColPosition(thead.children, initialColumnMap);
    // 处理冻结行
    const tbody = tableContentElm.querySelector('tbody');
    const tfoot = tableContentElm.querySelector('tfoot');
    tbody && setFixedRowPosition(tbody.children, initialColumnMap, thead, tfoot);
    // 更新最终 Map
    rowAndColFixedPosition.value = initialColumnMap;
  };

  const updateColumnFixedShadow = (target: HTMLElement) => {
    const isShowRight = target.clientWidth + target.scrollLeft !== target.scrollWidth;
    showColumnShadow.left = target.scrollLeft !== 0;
    showColumnShadow.right = isShowRight;
  };

  const onTableContentScroll = (e: WheelEvent) => {
    props.onScrollX?.({ e });
    const target = (e.target || e.srcElement) as HTMLElement;
    updateColumnFixedShadow(target);
  };

  // 多级表头场景较为复杂：为了滚动的阴影效果，需要知道哪些列是边界列，左侧固定列的最后一列，右侧固定列的第一列，每一层表头都需要兼顾
  const setIsLastOrFirstFixedCol = (levelNodes: FixedColumnInfo[][]) => {
    for (let t = 0; t < levelNodes.length; t++) {
      const nodes = levelNodes[t];
      for (let i = 0, len = nodes.length; i < len; i++) {
        const colMapInfo = nodes[i];
        const nextColMapInfo = nodes[i + 1];
        if (colMapInfo.col.fixed === 'left' && nextColMapInfo?.col.fixed !== 'left') {
          colMapInfo.lastLeftFixedCol = true;
        }
        const lastColMapInfo = nodes[i - 1];
        if (colMapInfo.col.fixed === 'right' && lastColMapInfo?.col.fixed !== 'right') {
          colMapInfo.firstRightFixedCol = true;
        }
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateFixedStatus = () => {
    const { newColumnsMap, levelNodes } = getColumnMap(columns.value);
    setIsLastOrFirstFixedCol(levelNodes);
    const timer = setTimeout(() => {
      if (isFixedColumn.value || fixedRows.value?.length) {
        setRowAndColFixedPosition(tableContentRef.value, newColumnsMap);
      }
      clearTimeout(timer);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  };

  const updateFixedHeader = () => {
    const timer = setTimeout(() => {
      if (!tableContentRef.value) return;
      isFixedHeader.value = tableContentRef.value.scrollHeight > tableContentRef.value.clientHeight;
      const pos = tableContentRef.value.getBoundingClientRect();
      virtualScrollHeaderPos.value = {
        top: pos.top,
        left: pos.left,
      };
      tableWidth.value = tableContentRef.value.clientWidth;
      clearTimeout(timer);
    }, 0);
  };

  const updateFixedColumnHandler = () => {
    const timer = setTimeout(() => {
      if (isFixedColumn.value) {
        updateColumnFixedShadow(tableContentRef.value);
      }
      clearTimeout(timer);
    }, 0);
  };

  watch(
    [data, columns, tableLayout, tableContentWidth, isFixedHeader, fixedRows, firstFullRow, lastFullRow],
    updateFixedStatus,
    { immediate: true },
  );

  watch([isFixedColumn], updateFixedColumnHandler, { immediate: true });

  watch([maxHeight, data, columns], updateFixedHeader, { immediate: true });

  return {
    tableWidth,
    isFixedHeader,
    tableRef,
    tableContentRef,
    isFixedColumn,
    showColumnShadow,
    rowAndColFixedPosition,
    virtualScrollHeaderPos,
    onTableContentScroll,
    updateColumnFixedShadow,
  };
}
