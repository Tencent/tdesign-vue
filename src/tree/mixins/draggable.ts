import Vue, { VueConstructor } from 'vue';
import type { DebouncedFunc } from 'lodash';
import throttle from 'lodash/throttle';
import { OnDrag } from './onDrag';

export interface DragStates {
  isDragOver: boolean;
  isDragging: boolean;
  dropPosition: number;
}

export interface Draggable extends Vue {
  throttleUpdateDropPosition: DebouncedFunc<any>;
}

type DragStatus = 'dragStart' | 'dragOver' | 'dragLeave' | 'dragEnd' | 'drop';

// export interface DragEvents {
//   setDragStatus: (status: DragStatus, dragEvent: DragEvent) => void;
// }

// export default function useDraggable(props: { nodeRef: HTMLElement | undefined; node: TreeNode, dragStates: DragStates, onDrag: DragInjectKey }): DragEvents {
//   const {
//     nodeRef, node, onDrag, dragStates,
//   } = props;

//   const updateDropPosition = throttle((dragEvent: DragEvent) => {
//     if (!nodeRef) return;

//     const rect = nodeRef.getBoundingClientRect();
//     const offsetY = window.pageYOffset + rect.top;
//     const { pageY } = dragEvent;
//     const gapHeight = rect.height / 4;
//     const diff = pageY - offsetY;

//     // 其实三元可行
//     if (diff < gapHeight) {
//       dragStates.dropPosition = -1;
//     } else if (diff < rect.height - gapHeight) {
//       dragStates.dropPosition = 0;
//     } else {
//       dragStates.dropPosition = 1;
//     }
//   });

//   const setDragStatus = (status: DragStatus, dragEvent: DragEvent) => {
//     switch (status) {
//       case 'dragStart':
//         dragStates.isDragging = true;
//         dragStates.dropPosition = 0;
//         onDrag.onDragStart?.({ node, dragEvent });
//         break;
//       case 'dragEnd':
//         dragStates.isDragging = false;
//         dragStates.isDragOver = false;
//         dragStates.dropPosition = 0;
//         updateDropPosition.cancel();
//         onDrag.onDragEnd?.({ node, dragEvent });
//         break;
//       case 'dragOver':
//         dragStates.isDragOver = true;
//         updateDropPosition(dragEvent);
//         onDrag.onDragOver?.({ node, dragEvent });
//         break;
//       case 'dragLeave':
//         dragStates.isDragOver = false;
//         dragStates.dropPosition = 0;
//         updateDropPosition.cancel();
//         onDrag.onDragLeave?.({ node, dragEvent });
//         break;
//       case 'drop':
//         onDrag.onDrop?.({ node, dropPosition: dragStates.dropPosition, dragEvent });
//         dragStates.isDragOver = false;
//         updateDropPosition.cancel();
//         break;
//       default:
//         break;
//     }
//   };

//   return {
//     setDragStatus,
//   };
// }

export default function draggableMixins<BasicComponent extends Vue>() {
  return (Vue as VueConstructor<OnDrag & Draggable & BasicComponent>).extend({
    inject: {
      onDrag: { default: undefined },
    },
    data() {
      return {
        dragStates: {
          isDragOver: false,
          isDragging: false,
          dropPosition: 0,
        } as DragStates,
      };
    },
    created() {
      this.throttleUpdateDropPosition = throttle((dragEvent: DragEvent) => {
        this.updateDropPosition(dragEvent);
      });
    },
    methods: {
      updateDropPosition(dragEvent: DragEvent) {
        const { $el, dragStates } = this;
        if (!$el) return;

        const rect = $el.getBoundingClientRect();
        const offsetY = window.pageYOffset + rect.top;
        const { pageY } = dragEvent;
        const gapHeight = rect.height / 4;
        const diff = pageY - offsetY;

        if (diff < gapHeight) {
          dragStates.dropPosition = -1;
        } else if (diff < rect.height - gapHeight) {
          dragStates.dropPosition = 0;
        } else {
          dragStates.dropPosition = 1;
        }
      },

      setDragStatus(status: DragStatus, dragEvent: DragEvent) {
        const { dragStates, onDrag, throttleUpdateDropPosition } = this;

        const { node } = this.$props;
        switch (status) {
          case 'dragStart':
            dragStates.isDragging = true;
            dragStates.dropPosition = 0;
            onDrag.onDragStart?.({ node, dragEvent });
            break;
          case 'dragEnd':
            dragStates.isDragging = false;
            dragStates.isDragOver = false;
            dragStates.dropPosition = 0;
            throttleUpdateDropPosition.cancel();
            onDrag.onDragEnd?.({ node, dragEvent });
            break;
          case 'dragOver':
            dragStates.isDragOver = true;
            throttleUpdateDropPosition(dragEvent);
            onDrag.onDragOver?.({ node, dragEvent });
            break;
          case 'dragLeave':
            dragStates.isDragOver = false;
            dragStates.dropPosition = 0;
            throttleUpdateDropPosition.cancel();
            onDrag.onDragLeave?.({ node, dragEvent });
            break;
          case 'drop':
            onDrag.onDrop?.({ node, dropPosition: dragStates.dropPosition, dragEvent });
            dragStates.isDragOver = false;
            throttleUpdateDropPosition.cancel();
            break;
          default:
            break;
        }
      },

      handleDragStart(evt: DragEvent) {
        const { node } = this.$props;
        if (!node.isDraggable()) return;
        evt.stopPropagation();
        this.setDragStatus('dragStart', evt);

        try {
          // ie throw error firefox-need-it
          evt.dataTransfer?.setData('text/plain', '');
        } catch (e) {
          // empty
        }
      },

      handleDragEnd(evt: DragEvent) {
        const { node } = this.$props;
        if (!node.isDraggable()) return;
        evt.stopPropagation();
        this.setDragStatus('dragEnd', evt);
      },

      handleDragOver(evt: DragEvent) {
        const { node } = this.$props;
        if (!node.isDraggable()) return;
        evt.stopPropagation();
        evt.preventDefault();
        this.setDragStatus('dragOver', evt);
      },

      handleDragLeave(evt: DragEvent) {
        const { node } = this.$props;
        if (!node.isDraggable()) return;
        evt.stopPropagation();
        this.setDragStatus('dragLeave', evt);
      },

      handleDrop(evt: DragEvent) {
        const { node } = this.$props;
        if (!node.isDraggable()) return;
        evt.stopPropagation();
        evt.preventDefault();
        this.setDragStatus('drop', evt);
      },
    },
  });
}
