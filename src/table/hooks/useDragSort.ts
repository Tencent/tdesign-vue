// 表格 行拖拽 + 列拖拽功能
import {
  SetupContext, computed, toRefs, ref, watch, h,
} from '@vue/composition-api';
import Sortable, { SortableEvent, SortableOptions, MoveEvent } from 'sortablejs';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import { hasClass } from '../../utils/dom';
import {
  TableRowData, TdPrimaryTableProps, DragSortContext, PrimaryTableCol,
} from '../type';
import useClassName from './useClassName';
import log from '../../_common/js/log';
import swapDragArrayElement from '../../_common/js/utils/swapDragArrayElement';

/**
 * TODO:
 * 1. 同时支持行拖拽和列拖拽，此时 dragSort 扩展为支持数组即可
 * 2. 多极表头场景下的列拖拽排序
 * 3. 优化列拖拽排序样式（优先级不高，可以慢慢来）
 * @param props
 * @param context
 * @returns
 */
export default function useDragSort(props: TdPrimaryTableProps, context: SetupContext) {
  const { sortOnRowDraggable, dragSort, data } = toRefs(props);
  const { tableDraggableClasses, tableBaseClass, tableFullRowClasses } = useClassName();
  const columns = ref<PrimaryTableCol[]>(props.columns || []);
  const primaryTableRef = ref(null);
  // @ts-ignore 判断是否有拖拽列
  const dragCol = computed(() => columns.value?.find((item) => item.colKey === 'drag'));
  // 行拖拽判断条件
  const isRowDraggable = computed(() => sortOnRowDraggable.value || dragSort.value === 'row');
  // 行手柄列拖拽判断条件
  const isRowHandlerDraggable = computed(() => ['drag-col', 'row-handler'].includes(dragSort.value) && !!dragCol.value);
  // 列拖拽排序，待开发
  const isColDraggable = computed(() => dragSort.value === 'col');
  // 行拖拽排序，存储上一次的变化结果
  const lastRowList = ref([]);
  // 列拖拽排序，存储上一次的变化结果
  const lastColList = ref([]);

  if (dragSort.value === 'drag-col') {
    log.error('Table', "dragSort='drag-col' is going to be deprecated, please use dragSort='col' instead.");
  }

  if (props.sortOnRowDraggable) {
    log.error('Table', "`sortOnRowDraggable` is going to be deprecated, please use dragSort='row' instead.");
  }

  watch(
    data,
    (data) => {
      lastRowList.value = data?.map((item) => get(item, props.rowKey));
    },
    { immediate: true },
  );

  watch(
    columns,
    (columns) => {
      lastColList.value = columns || [];
    },
    { immediate: true },
  );

  // 行拖拽排序，注意存在 firstFullRow 的情况
  const registerRowDragEvent = (element: HTMLDivElement): void => {
    if (!isRowHandlerDraggable.value && !isRowDraggable.value) return;
    const dragContainer = element?.querySelector('tbody');
    if (!dragContainer) {
      console.error('tbody does not exist.');
      return null;
    }
    // 拖拽实例
    let dragInstanceTmp: Sortable = null;
    const baseOptions: SortableOptions = {
      animation: 150,
      ...props.dragSortOptions,
      ghostClass: tableDraggableClasses.ghost,
      chosenClass: tableDraggableClasses.chosen,
      dragClass: tableDraggableClasses.dragging,
      filter: `.${tableFullRowClasses.base}`, // 过滤首行尾行固定
      onMove: (evt: MoveEvent) => !hasClass(evt.related, tableFullRowClasses.base),
      onEnd(evt: SortableEvent) {
        // 处理受控：拖拽列表恢复原始排序
        dragInstanceTmp?.sort(lastRowList.value);
        let { oldIndex: currentIndex, newIndex: targetIndex } = evt;
        if ((isFunction(props.firstFullRow) && props.firstFullRow(h)) || context.slots.firstFullRow) {
          currentIndex -= 1;
          targetIndex -= 1;
        }
        const params: DragSortContext<TableRowData> = {
          data: data.value,
          currentIndex,
          current: data.value[currentIndex],
          targetIndex,
          target: data.value[targetIndex],
          newData: swapDragArrayElement([...props.data], currentIndex, targetIndex),
          e: evt,
          sort: 'row',
        };
        // currentData is going to be deprecated
        params.currentData = params.newData;
        props.onDragSort?.(params);
        // Vue3 ignore next line
        context.emit('drag-sort', params);
      },
    };

    if (isRowDraggable.value) {
      dragInstanceTmp = new Sortable(dragContainer, { ...baseOptions });
    } else {
      dragInstanceTmp = new Sortable(dragContainer, {
        ...baseOptions,
        handle: `.${tableDraggableClasses.handle}`,
      });
    }
    lastRowList.value = dragInstanceTmp.toArray();
  };

  // 列拖拽排序：涉及到多级表头、自定义显示列 等综合场景
  const registerColDragEvent = (tableElement: HTMLElement) => {
    if (!isColDraggable.value || !tableElement) return;
    // 拖拽实例
    let dragInstanceTmp: Sortable = null;
    const options: SortableOptions = {
      animation: 150,
      ...props.dragSortOptions,
      dataIdAttr: 'data-colkey',
      direction: 'vertical',
      ghostClass: tableDraggableClasses.ghost,
      chosenClass: tableDraggableClasses.chosen,
      dragClass: tableDraggableClasses.dragging,
      handle: `.${tableBaseClass.thCellInner}`,
      onEnd: (evt: SortableEvent) => {
        // 处理受控：拖拽列表恢复原始排序，等待外部数据 data 变化，更新最终顺序
        dragInstanceTmp?.sort([...lastColList.value]);
        let { oldIndex: currentIndex, newIndex: targetIndex } = evt;
        const current = columns.value[currentIndex];
        const target = columns.value[targetIndex];
        if (!current || !current.colKey) {
          log.error('Table', `colKey is missing in ${JSON.stringify(current)}`);
        }
        if (!target || !target.colKey) {
          log.error('Table', `colKey is missing in ${JSON.stringify(target)}`);
        }
        // 寻找外部数据 props.columns 中的真正下标
        currentIndex = props.columns.findIndex((t) => t.colKey === current.colKey);
        targetIndex = props.columns.findIndex((t) => t.colKey === target.colKey);
        const params: DragSortContext<TableRowData> = {
          data: columns.value,
          currentIndex,
          current,
          targetIndex,
          target,
          newData: swapDragArrayElement([...props.columns], currentIndex, targetIndex),
          e: evt,
          sort: 'col',
        };
        // currentData is going to be deprecated
        params.currentData = params.newData;
        props.onDragSort?.(params);
        // Vue3 ignore next line
        context.emit('drag-sort', params);
      },
    };
    const container = tableElement.querySelector('thead > tr') as HTMLDivElement;
    dragInstanceTmp = new Sortable(container, options);
    lastColList.value = dragInstanceTmp?.toArray();
  };

  function setDragSortPrimaryTableRef(primaryTableElement: any) {
    primaryTableRef.value = primaryTableElement;
  }

  function setDragSortColumns(val: PrimaryTableCol[]) {
    columns.value = val;
  }

  // 注册拖拽事件
  watch([primaryTableRef], ([val]: [any]) => {
    if (!val || !val.$el) return;
    registerRowDragEvent(val.$el);
    registerColDragEvent(val.$el);
    /** 待表头节点准备完成后 */
    const timer = setTimeout(() => {
      if (val.$refs.affixHeaderRef) {
        registerColDragEvent(val.$refs.affixHeaderRef);
      }
      clearTimeout(timer);
    });
  });

  return {
    isRowDraggable,
    isRowHandlerDraggable,
    isColDraggable,
    setDragSortPrimaryTableRef,
    setDragSortColumns,
  };
}
