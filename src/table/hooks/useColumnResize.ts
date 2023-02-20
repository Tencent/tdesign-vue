/**
 * important info: only resize happened, th width calculating allowed
 * 验证场景：吸顶表头调整列宽、列数量发生变化、表格未超出、表格已超出
 */
import { ref, Ref, reactive } from '@vue/composition-api';
import isNumber from 'lodash/isNumber';
import { BaseTableCol, TableRowData } from '../type';
import { on, off } from '../../utils/dom';

const DEFAULT_MIN_WIDTH = 80;
const DEFAULT_MAX_WIDTH = 600;
// 当离右边框的距离不超过 8 时，显示拖拽图标
const distance = 8;

export default function useColumnResize(params: {
  isWidthOverflow: Ref<boolean>;
  tableContentRef: Ref<HTMLDivElement>;
  getThWidthList: (type?: 'default' | 'calculate') => { [colKeys: string]: number };
  updateThWidthList: (data: { [colKey: string]: number }) => void;
  setTableElmWidth: (width: number) => void;
}) {
  const {
    isWidthOverflow, tableContentRef, getThWidthList, updateThWidthList, setTableElmWidth,
  } = params;
  const resizeLineRef = ref<HTMLDivElement>();
  const effectColMap = ref<{ [colKey: string]: any }>({});
  const leafColumns = ref([]);
  const originalSelectStart = document.onselectstart;
  const originalDragStart = document.ondragstart;

  const getSiblingResizableCol = (nodes: BaseTableCol<TableRowData>[], index: number, type: 'prev' | 'next') => {
    let i = index;
    while (nodes[i] && nodes[i].resizable === false) {
      if (type === 'next') {
        i += 1;
      } else {
        i -= 1;
      }
    }
    return nodes[i];
  };

  // 递归查找列宽度变化后，受影响的相关列。前后非禁用调整列宽的列
  const setEffectColMap = (nodes: BaseTableCol<TableRowData>[], parent: BaseTableCol<TableRowData> | null) => {
    if (!nodes) return;
    leafColumns.value = nodes;
    nodes.forEach((n, index) => {
      const prevNode = getSiblingResizableCol(nodes, index - 1, 'prev');
      const nextNode = getSiblingResizableCol(nodes, index + 1, 'next');
      const parentPrevCol = parent ? effectColMap.value[parent.colKey].prev : nextNode;
      const parentNextCol = parent ? effectColMap.value[parent.colKey].next : prevNode;
      const prev = index === 0 ? parentPrevCol : prevNode;
      const next = index === nodes.length - 1 ? parentNextCol : nextNode;
      effectColMap.value[n.colKey] = {
        prev,
        next,
        current: {
          prevSibling: getSiblingResizableCol(nodes, index - 1, 'prev'),
          nextSibling: getSiblingResizableCol(nodes, index + 1, 'next'),
        },
      };
      setEffectColMap(n.children, n);
    });
  };

  const resizeLineParams = {
    isDragging: false,
    draggingCol: null as HTMLElement,
    draggingStart: 0,
    // 列宽调整类型：影响右侧列宽度、影响左侧列宽度、或者仅影响自身
    effectCol: 'next' as 'next' | 'prev',
  };

  const resizeLineStyle = reactive({
    display: 'none',
    height: '10px',
    left: '10px',
    bottom: '0',
  });

  // 频繁事件，仅用于计算是否在表头显示拖拽鼠标形态
  const onColumnMouseover = (e: MouseEvent, col: BaseTableCol<TableRowData>) => {
    // calculate mouse cursor before drag start
    if (!resizeLineRef.value || resizeLineParams.isDragging) return;
    const target = (e.target as HTMLElement).closest('th');
    // 判断是否为叶子阶段，仅叶子结点允许拖拽
    const colKey = target.getAttribute('data-colkey');
    if (!leafColumns.value.find((t) => t.colKey === colKey)) return;
    const targetBoundRect = target.getBoundingClientRect();
    if (targetBoundRect.right - e.pageX <= distance) {
      const colResizable = col.resizable ?? true;
      if (colResizable) {
        target.style.cursor = 'col-resize';
        resizeLineParams.draggingCol = target;
        resizeLineParams.effectCol = 'next';
        return;
      }
    } else if (e.pageX - targetBoundRect.left <= distance) {
      const prevEl = target.previousElementSibling;
      if (prevEl) {
        const effectPrevCol = effectColMap.value[col.colKey]?.prev;
        const colResizable = effectPrevCol?.resizable ?? true;
        if (colResizable) {
          target.style.cursor = 'col-resize';
          resizeLineParams.draggingCol = prevEl as HTMLElement;
          resizeLineParams.effectCol = 'prev';
          return;
        }
      }
    }
    // 重置记录值
    target.style.cursor = '';
    resizeLineParams.draggingCol = null;
    resizeLineParams.effectCol = null;
  };

  const getMinMaxColWidth = (col: BaseTableCol<TableRowData>, effectPrevCol: BaseTableCol<TableRowData>) => {
    const targetCol = resizeLineParams.effectCol === 'next' ? col : effectPrevCol;
    const propMinWidth = isNumber(targetCol.minWidth) ? targetCol.minWidth : parseInt(targetCol.minWidth || '0', 10);
    return {
      minColWidth: Math.max(targetCol.resize?.minWidth || DEFAULT_MIN_WIDTH, propMinWidth),
      maxColWidth: targetCol.resize?.maxWidth || DEFAULT_MAX_WIDTH,
    };
  };

  const getTotalTableWidth = (thWidthList: { [key: string]: number }): number => {
    let tableWidth = 0;
    leafColumns.value.forEach((col) => {
      tableWidth += thWidthList[col.colKey];
    });
    return tableWidth;
  };

  // 调整表格列宽
  const onColumnMousedown = (e: MouseEvent, col: BaseTableCol<TableRowData>) => {
    if (!resizeLineParams.draggingCol) return;
    const target = resizeLineParams.draggingCol;
    const targetBoundRect = target.getBoundingClientRect();
    const tableBoundRect = tableContentRef.value?.getBoundingClientRect();
    const resizeLinePos = targetBoundRect.right - tableBoundRect.left;
    const colLeft = targetBoundRect.left - tableBoundRect.left;
    const effectNextCol = effectColMap.value[col.colKey]?.next;
    const effectPrevCol = effectColMap.value[col.colKey]?.prev;
    const { minColWidth, maxColWidth } = getMinMaxColWidth(col, effectPrevCol);
    const minResizeLineLeft = colLeft + minColWidth;
    const maxResizeLineLeft = colLeft + maxColWidth;

    // 开始拖拽，记录下鼠标起始位置
    resizeLineParams.isDragging = true;
    resizeLineParams.draggingStart = e.x;

    // 初始化 resizeLine 标记线
    if (resizeLineRef?.value) {
      resizeLineStyle.display = 'block';
      resizeLineStyle.height = `${tableBoundRect.bottom - targetBoundRect.top}px`;
      resizeLineStyle.left = `${resizeLinePos}px`;
      const parent = tableContentRef.value.parentElement.getBoundingClientRect();
      resizeLineStyle.bottom = `${parent.bottom - tableBoundRect.bottom}px`;
    }

    // 结束拖拽，更新列宽。拖拽时鼠标可能会超出 table 范围，需要给 document 绑定拖拽相关事件；
    const onDragEnd = () => {
      if (!resizeLineParams.isDragging) return;
      const moveDistance = resizeLinePos - parseFloat(resizeLineStyle.left) || 0;
      /**
       * 计算列宽
       *  - 若表格宽度已经超出，存在横向滚动，则直接改变表格总宽度
       *  - 操作边框右侧，改变当前列和上一列；若上一列禁用宽度调整，则改变上一列的上一列，依次往前寻找
       *  - 操作边框左侧，改变当前列和下一列；若下一列禁用宽度调整，则改变下一列的下一列，依次往后寻找
       */
      const thWidthList = getThWidthList('calculate');
      const currentCol = effectColMap.value[col.colKey]?.current;
      if (!currentCol) return;
      const currentSibling = resizeLineParams.effectCol === 'next' ? currentCol.prevSibling : currentCol.nextSibling;
      // 多行表头，列宽为最后一层的宽度，即叶子结点宽度
      const newThWidthList = { ...thWidthList };
      const tmpCurrentCol = col.resizable !== false ? col : currentSibling;
      if (resizeLineParams.effectCol === 'next') {
        newThWidthList[tmpCurrentCol.colKey] -= moveDistance;
        if (!isWidthOverflow.value) {
          newThWidthList[effectNextCol.colKey] += moveDistance;
        }
      } else if (resizeLineParams.effectCol === 'prev') {
        if (!isWidthOverflow.value) {
          newThWidthList[tmpCurrentCol.colKey] += moveDistance;
        }
        newThWidthList[effectPrevCol.colKey] -= moveDistance;
      }
      updateThWidthList(newThWidthList);
      const tableWidth = getTotalTableWidth(newThWidthList);
      setTableElmWidth(tableWidth);

      // 恢复设置
      resizeLineParams.isDragging = false;
      resizeLineParams.draggingCol = null;
      resizeLineParams.effectCol = null;
      target.style.cursor = '';
      resizeLineStyle.display = 'none';
      resizeLineStyle.left = '0';
      off(document, 'mouseup', onDragEnd);
      off(document, 'mousemove', onDragOver);
      document.onselectstart = originalSelectStart;
      document.ondragstart = originalDragStart;
    };

    // 注意前后两列最小和最大宽度限制
    const onDragOver = (e: MouseEvent) => {
      if (resizeLineParams.isDragging) {
        const left = resizeLinePos + e.x - resizeLineParams.draggingStart;
        resizeLineStyle.left = `${Math.min(Math.max(left, minResizeLineLeft), maxResizeLineLeft)}px`;
      }
    };

    on(document, 'mouseup', onDragEnd);
    on(document, 'mousemove', onDragOver);

    // 禁用鼠标的选中文字和拖放
    document.onselectstart = () => false;
    document.ondragstart = () => false;
  };

  return {
    resizeLineRef,
    resizeLineStyle,
    onColumnMouseover,
    onColumnMousedown,
    setEffectColMap,
  };
}
