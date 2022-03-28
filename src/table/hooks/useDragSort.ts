// 表格 行拖拽 + 列拖拽功能

import {
  SetupContext, ref, onMounted, toRefs,
} from '@vue/composition-api';
// , toRefs, ref, watch, computed,
import { SortableEvent } from 'sortablejs';
import { TdPrimaryTableProps, TableRowData } from '../type';
import setSortableConfig from '../util/sortable';
import useClassName from './useClassName';

export default function useDragSort(props: TdPrimaryTableProps, context: SetupContext) {
  const {
    sortOnRowDraggable, dragSort, data, columns,
  } = toRefs(props);
  // 判断是否有拖拽列
  const dragCol = columns.value.filter((item) => item.colKey === 'drag');

  // 行拖拽判断条件
  const isRowDraggable = ref(sortOnRowDraggable || dragSort.value === 'row');
  // 列拖拽判断条件
  const isColDraggable = ref(dragSort.value === 'drag-col' && dragCol.length > 0);

  const dataRef = ref(data.value);
  // // 拖拽节点下标
  // const currentIndex = ref(0);
  // const targetIndex = ref(0);
  const { tableDraggableClasses } = useClassName();

  function emitChange(
    currentIndex: number,
    current: TableRowData,
    targetIndex: number,
    target: TableRowData,
    currentData: TableRowData[],
    e: SortableEvent,
  ) {
    context.emit('drag-sort', {
      currentIndex,
      current,
      targetIndex,
      target,
      currentData,
      e,
    });
  }

  onMounted(() => {
    if (isColDraggable.value || isRowDraggable.value) {
      const {
        handle, bodyRow, bodyCol, ghost,
      } = tableDraggableClasses;
      const baseOptions = {
        animation: 150,
        ghostClass: ghost, // 放置占位符的类名
        // onStart(evt: any) {
        //   currentIndex.value = evt.oldIndex;
        // },
        onEnd(evt: SortableEvent) {
          const { oldIndex, newIndex } = evt;
          const newData = [].concat(dataRef.value);
          if (newIndex - oldIndex > 0) {
            newData.splice(newIndex + 1, 0, newData[oldIndex]);
            newData.splice(oldIndex, 1);
          } else {
            newData.splice(newIndex, 0, newData[oldIndex]);
            newData.splice(oldIndex + 1, 1);
          }
          emitChange(
            evt.oldIndex,
            dataRef.value[evt.oldIndex],
            evt.newIndex,
            dataRef.value[evt.newIndex],
            newData,
            evt,
          );
          dataRef.value = newData;
          // currentIndex.value = 0;
          // targetIndex.value = 0;
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
      const elementsRow = document.getElementsByClassName(bodyRow);
      const elementsCol = document.getElementsByClassName(bodyCol);
      for (let i = 0; i < elementsRow.length; i++) {
        setSortableConfig(elementsRow[i], rowOptions);
      }
      for (let i = 0; i < elementsCol.length; i++) {
        setSortableConfig(elementsCol[i], colOptions);
      }
    }
  });

  return {
    isRowDraggable,
    isColDraggable,
  };
}
