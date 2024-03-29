interface DragSortContext<T> {
  currentIndex: number;
  current: T;
  targetIndex: number;
  target: T;
}

export interface DragSortProps<T> {
  sortOnDraggable: boolean;
  onDragSort?: (context: DragSortContext<T>) => void;
  onDragOverCheck?: {
    x?: boolean;
    targetClassNameRegExp?: RegExp;
  };
}

type DragFnType = (e?: DragEvent, index?: number, record?: any) => void;
interface DragSortInnerData {
  dragging?: boolean;
  onDragStart?: DragFnType;
  onDragOver?: DragFnType;
  onDrop?: DragFnType;
  onDragEnd?: DragFnType;
}

export interface DragProps {
  (index?: number, record?: any): {
    draggable: boolean;
    onDragstart?: DragFnType;
    onDragover?: DragFnType;
    onDrop?: DragFnType;
    onDragend?: DragFnType;
  };
}

export interface DragSortInnerProps extends DragSortInnerData {
  getDragProps?: DragProps;
}
