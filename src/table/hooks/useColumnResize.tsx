import { ref, reactive } from '@vue/composition-api';
import { TableColumns } from './useMultiHeader';

export default function useColumnResize(tableElmRef: any) {
  const resizeLineRef = ref<HTMLDivElement>();

  const resizeLineParams = {
    isDragging: false,
    draggingCol: null as HTMLElement,
    draggingStart: 0,
  };

  const resizeLineStyle = reactive({
    display: 'none',
    left: '10px',
    height: '10px',
  });

  // 表格列宽拖拽事件
  // 只在表头显示拖拽图标
  const onColumnMouseover = (e: MouseEvent) => {
    if (!resizeLineRef.value) return;

    const target = e.target as HTMLElement;
    const targetBoundRect = target.getBoundingClientRect();
    if (!resizeLineParams.isDragging) {
      // 最小宽度暂定为30，如果单元格小于30，则不能拖拽
      // 当离右边框的距离不超过8时，显示拖拽图标
      if (targetBoundRect.width > 30 && targetBoundRect.right - e.pageX <= 8) {
        target.style.cursor = 'col-resize';
        resizeLineParams.draggingCol = target;
      } else {
        target.style.cursor = '';
        resizeLineParams.draggingCol = null;
      }
    }
  };

  // 调整表格列宽
  const onColumnMousedown = (e: MouseEvent, col: TableColumns[0]) => {
    // 非resize的点击，不做处理
    if (!resizeLineParams.draggingCol) return;

    const target = e.target as HTMLElement;
    const targetBoundRect = target.getBoundingClientRect();
    const tableBoundRect = tableElmRef.value?.getBoundingClientRect();
    const resizeLinePos = targetBoundRect.right - tableBoundRect.left;
    const colLeft = targetBoundRect.left - tableBoundRect.left;
    const minColLen = 30;
    const minResizeLineLeft = colLeft + minColLen;

    // 开始拖拽，记录下鼠标起始位置
    resizeLineParams.isDragging = true;
    resizeLineParams.draggingStart = e.x;

    // 初始化resizeline标记线
    if (resizeLineRef?.value) {
      resizeLineStyle.display = 'block';
      resizeLineStyle.left = `${resizeLinePos}px`;
      resizeLineStyle.height = `${tableElmRef.value?.clientHeight}px`;
    }

    // 拖拽时鼠标可能会超出table范围，需要给docuemnt绑定拖拽相关事件
    const onDragEnd = () => {
      if (resizeLineParams.isDragging) {
        // 结束拖拽，更新列宽
        const width = parseInt(resizeLineStyle.left, 10) - colLeft;

        // eslint-disable-next-line
        col.width = `${Math.floor(width)}px`;

        // 恢复设置
        resizeLineParams.isDragging = false;
        resizeLineParams.draggingCol = null;
        target.style.cursor = '';
        resizeLineStyle.display = 'none';
        resizeLineStyle.left = '0';
        document.removeEventListener('mousemove', onDragOver);
        document.removeEventListener('mouseup', onDragEnd);
        document.onselectstart = null;
        document.ondragstart = null;
      }
    };

    const onDragOver = (e: MouseEvent) => {
      // 计算新的列宽，新列宽不得小于最小列宽
      if (resizeLineParams.isDragging) {
        // 更新resizeLine的位置
        resizeLineStyle.left = `${Math.max(resizeLinePos + e.x - resizeLineParams.draggingStart, minResizeLineLeft)}px`;
      }
    };

    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('mousemove', onDragOver);

    // 禁用鼠标的选中文字和拖放
    document.onselectstart = () => false;
    document.ondragstart = () => false;
  };

  return {
    resizeLineRef,
    resizeLineStyle,
    onColumnMouseover,
    onColumnMousedown,
  };
}
