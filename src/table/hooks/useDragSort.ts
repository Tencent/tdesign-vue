// 表格 行拖拽 + 列拖拽功能

import { ref, toRefs, SetupContext } from '@vue/composition-api';
import { SortableEvent } from 'sortablejs';
import { TdPrimaryTableProps, TableRowData } from '../type';
import { TargetDom } from '../interface';
import setSortableConfig from '../util/sortable';
import useClassName from './useClassName';

export default function useDragSort(props: TdPrimaryTableProps, context: SetupContext) {
  const {
    sortOnRowDraggable, dragSort, data, columns,
  } = toRefs(props);
  // 判断是否有拖拽列
  const dragCol = columns.value.find((item) => item.colKey === 'drag');
  // 行拖拽判断条件
  const isRowDraggable = ref(sortOnRowDraggable || dragSort.value === 'row');
  // 列拖拽判断条件
  const isColDraggable = ref(dragSort.value === 'drag-col' && !!dragCol);

  const innerData = ref(data.value);

  const { tableDraggableClasses } = useClassName();

  function emitChange(
    currentIndex: number,
    current: TableRowData,
    targetIndex: number,
    target: TableRowData,
    currentData: TableRowData[],
    e: SortableEvent,
  ) {
    props.onDragSort?.({
      currentIndex,
      current,
      targetIndex,
      target,
      currentData,
      e,
    });
    // Vue3 ignore next linet
    context.emit('drag-sort', {
      currentIndex,
      current,
      targetIndex,
      target,
      currentData,
      e,
    });
  }

  // 注册拖拽事件
  const registerDragEvent = (element: TargetDom) => {
    if (!isColDraggable.value && !isRowDraggable.value) {
      return;
    }
    const dragContainer = element?.querySelector('tbody');
    const { handle, ghost } = tableDraggableClasses;
    const baseOptions = {
      animation: 150,
      ghostClass: ghost, // 放置占位符的类名
      onEnd(evt: SortableEvent) {
        const { oldIndex, newIndex } = evt;
        const newData = [].concat(innerData.value);
        if (newIndex - oldIndex > 0) {
          newData.splice(newIndex + 1, 0, newData[oldIndex]);
          newData.splice(oldIndex, 1);
        } else {
          newData.splice(newIndex, 0, newData[oldIndex]);
          newData.splice(oldIndex + 1, 1);
        }
        emitChange(
          evt.oldIndex,
          innerData.value[evt.oldIndex],
          evt.newIndex,
          innerData.value[evt.newIndex],
          newData,
          evt,
        );
        innerData.value = newData;
      },
    };
    // 注册拖拽事件
    const rowOptions = {
      ...baseOptions,
    };

    const colOptions = {
      handle: `.${handle}`,
      ...baseOptions,
    };
    if (isRowDraggable) {
      setSortableConfig(dragContainer, rowOptions);
    } else {
      setSortableConfig(dragContainer, colOptions);
    }
  };

  return {
    isRowDraggable,
    isColDraggable,
    registerDragEvent,
  };
}
