// 表格 行拖拽 + 列拖拽功能

import {
  SetupContext, computed, toRefs, ref, watch,
} from '@vue/composition-api';
import { SortableEvent } from 'sortablejs';
import get from 'lodash/get';
import { TdPrimaryTableProps } from '../type';
import { TargetDom } from '../interface';
import { setSortableConfig } from '../utils';
import useClassName from './useClassName';
import log from '../../_common/js/log';

export default function useDragSort(props: TdPrimaryTableProps, context: SetupContext) {
  const {
    sortOnRowDraggable, dragSort, columns, data,
  } = toRefs(props);
  const primaryTableRef = ref(null);
  // 判断是否有拖拽列
  const dragCol = computed(() => columns.value.find((item) => item.colKey === 'drag'));
  // 行拖拽判断条件
  const isRowDraggable = computed(() => sortOnRowDraggable.value || dragSort.value === 'row');
  // 行手柄列拖拽判断条件
  const isRowHandlerDraggable = computed(
    () => ['drag-col', 'col', 'row-handler'].includes(dragSort.value) && !!dragCol.value,
  );
  // 列拖拽排序，待开发
  // const isColDraggable = computed(() => dragSort.value === 'col' && !!dragCol.value);

  if (dragSort.value === 'col') {
    log.error(
      'Table',
      "dragSort='drag' is going to be used as column drag, please use dragSort='row-handler' instead.",
    );
  }

  if (dragSort.value === 'drag-col') {
    log.error('Table', "dragSort='drag-col' is going to be deprecated, please use dragSort='col' instead.");
  }

  if (props.sortOnRowDraggable) {
    log.error('Table', "`sortOnRowDraggable` is going to be deprecated, please use dragSort='row' instead.");
  }

  const { tableDraggableClasses } = useClassName();
  // 拖拽实例
  const dragInstance = ref(null);
  // 初始顺序
  const startList = ref([]);
  watch(data, (newData) => {
    // 更新排列顺序
    startList.value = newData.map((item) => get(item, props.rowKey));
  });
  // 注册拖拽事件
  const registerDragEvent = (element: TargetDom) => {
    if (!isRowHandlerDraggable.value && !isRowDraggable.value) {
      return;
    }
    const dragContainer = element?.querySelector('tbody');

    const { handle, ghost } = tableDraggableClasses;
    const baseOptions = {
      animation: 150,
      // 放置占位符的类名
      ghostClass: ghost,
      onEnd(evt: SortableEvent) {
        // 拖拽列表恢复原始排序
        dragInstance.value?.sort(startList.value);
        const { oldIndex, newIndex } = evt;
        const newData = [...props.data];
        if (newIndex - oldIndex > 0) {
          newData.splice(newIndex + 1, 0, newData[oldIndex]);
          newData.splice(oldIndex, 1);
        } else {
          newData.splice(newIndex, 0, newData[oldIndex]);
          newData.splice(oldIndex + 1, 1);
        }

        const params = {
          currentIndex: evt.oldIndex,
          current: props.data[evt.oldIndex],
          targetIndex: evt.newIndex,
          target: props.data[evt.newIndex],
          currentData: newData,
          e: evt,
        };
        props.onDragSort?.(params);
        // Vue3 ignore next line
        context.emit('drag-sort', params);
      },
    };

    const colOptions = {
      handle: `.${handle}`,
      ...baseOptions,
    };
    if (isRowDraggable.value) {
      dragInstance.value = setSortableConfig(dragContainer, { ...baseOptions });
    } else {
      dragInstance.value = setSortableConfig(dragContainer, colOptions);
    }
    startList.value = dragInstance.value.toArray();
  };

  function setDragSortPrimaryTableRef(primaryTableElement: any) {
    primaryTableRef.value = primaryTableElement;
  }

  // 注册拖拽事件
  watch([primaryTableRef], ([val]: [any]) => {
    registerDragEvent(val?.$el);
  });

  return {
    isRowDraggable,
    isRowHandlerDraggable,
    registerDragEvent,
    setDragSortPrimaryTableRef,
  };
}
