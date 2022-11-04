import Vue, { VueConstructor } from 'vue';
import TreeNode from '../../_common/js/tree/tree-node';
import { emitEvent } from '../util';
import { TypeTdTreeProps, TypDragEventState } from '../interface';

export interface DragInjectKey extends Vue {
  dragNode: TreeNode;
  onDragStart: (context: { node: TreeNode; dragEvent: DragEvent }) => void;
  onDragEnd: (context: { node: TreeNode; dragEvent: DragEvent }) => void;
  onDragOver: (context: { node: TreeNode; dragEvent: DragEvent }) => void;
  onDragLeave: (context: { node: TreeNode; dragEvent: DragEvent }) => void;
  onDrop: (context: { node: TreeNode; dropPosition: number; dragEvent: DragEvent }) => void;
}

export interface OnDrag extends Vue {
  onDrag: DragInjectKey;
}

// export function useOnDrag(vm: Vue): DragInjectKey {
//   let dragNode: TreeNode = null;

//   const onDragStart = (state: TypDragEventState) => {
//     const { dragEvent, node } = state;
//     dragNode = node;

//     const ctx = {
//       node: node.getModel(),
//       e: dragEvent,
//     };
//     emitEvent<Parameters<TypeTdTreeProps['onDragStart']>>(vm, 'drag-start', ctx);
//   };

//   const onDragEnd = (state: TypDragEventState) => {
//     const { dragEvent, node } = state;
//     dragNode = node;

//     const ctx = {
//       node: node.getModel(),
//       e: dragEvent,
//     };
//     emitEvent<Parameters<TypeTdTreeProps['onDragEnd']>>(vm, 'drag-end', ctx);
//   };

//   const onDragOver = (state: TypDragEventState) => {
//     const { dragEvent, node } = state;
//     const ctx = {
//       node: node.getModel(),
//       e: dragEvent,
//     };
//     emitEvent<Parameters<TypeTdTreeProps['onDragOver']>>(vm, 'drag-over', ctx);
//   };

//   const onDragLeave = (state: TypDragEventState) => {
//     const { dragEvent, node } = state;
//     const ctx = {
//       node: node.getModel(),
//       e: dragEvent,
//     };
//     emitEvent<Parameters<TypeTdTreeProps['onDragLeave']>>(vm, 'drag-leave', ctx);
//   };

//   const onDrop = (state: TypDragEventState) => {
//     const { dragEvent, node, dropPosition } = state;
//     if (node.value === dragNode.value || node.getParents().some((_node) => _node.value === dragNode.value)) return;

//     const nodes = vm.$data.store.getNodes() as TreeNode[];
//     nodes.some((_node) => {
//       if (_node.value === node.value) {
//         if (dropPosition === 0) {
//           dragNode.appendTo(vm.$data.store, _node);
//         } else if (dropPosition < 0) {
//           node.insertBefore(dragNode);
//         } else {
//           node.insertAfter(dragNode);
//         }
//         return true;
//       }
//       return false;
//     });
//     const ctx = {
//       node: node.getModel(),
//       dropPosition,
//       e: dragEvent,
//     };
//     emitEvent<Parameters<TypeTdTreeProps['onDrop']>>(vm, 'drop', ctx);
//   };

//   return {
//     onDragStart,
//     onDragEnd,
//     onDragOver,
//     onDragLeave,
//     onDrop,
//   };
// }

export default function draggableMixins<BasicComponent extends Vue>() {
  return (Vue as VueConstructor<DragInjectKey & BasicComponent>).extend({
    provide() {
      const {
        onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
      } = this;
      return {
        onDrag: {
          onDragStart,
          onDragEnd,
          onDragOver,
          onDragLeave,
          onDrop,
        } as DragInjectKey,
      };
    },
    data() {
      return {
        dragNode: null as TreeNode,
      };
    },
    methods: {
      onDragStart(state: TypDragEventState) {
        const { dragEvent, node } = state;
        this.dragNode = node;

        const ctx = {
          node: node.getModel(),
          e: dragEvent,
        };
        emitEvent<Parameters<TypeTdTreeProps['onDragStart']>>(this, 'drag-start', ctx);
      },

      onDragEnd(state: TypDragEventState) {
        const { dragEvent, node } = state;
        this.dragNode = node;

        const ctx = {
          node: node.getModel(),
          e: dragEvent,
        };
        emitEvent<Parameters<TypeTdTreeProps['onDragEnd']>>(this, 'drag-end', ctx);
      },

      onDragOver(state: TypDragEventState) {
        const { dragEvent, node } = state;
        const ctx = {
          node: node.getModel(),
          e: dragEvent,
        };
        emitEvent<Parameters<TypeTdTreeProps['onDragOver']>>(this, 'drag-over', ctx);
      },

      onDragLeave(state: TypDragEventState) {
        const { dragEvent, node } = state;
        const ctx = {
          node: node.getModel(),
          e: dragEvent,
        };
        emitEvent<Parameters<TypeTdTreeProps['onDragLeave']>>(this, 'drag-leave', ctx);
      },

      onDrop(state: TypDragEventState) {
        const { dragEvent, node, dropPosition } = state;
        if (
          node.value === this.dragNode.value
          || node.getParents().some((_node) => _node.value === this.dragNode.value)
        ) return;

        const nodes = this.$data.store.getNodes() as TreeNode[];
        nodes.some((_node) => {
          if (_node.value === node.value) {
            if (dropPosition === 0) {
              this.dragNode.appendTo(this.$data.store, _node);
            } else if (dropPosition < 0) {
              node.insertBefore(this.dragNode);
            } else {
              node.insertAfter(this.dragNode);
            }
            return true;
          }
          return false;
        });
        const ctx = {
          node: node.getModel(),
          dropPosition,
          e: dragEvent,
        };
        emitEvent<Parameters<TypeTdTreeProps['onDrop']>>(this, 'drop', ctx);
      },
    },
  });
}
