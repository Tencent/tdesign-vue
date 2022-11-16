import Vue, { VueConstructor } from 'vue';
import TreeNode from '../../_common/js/tree/tree-node';
import { emitEvent } from '../../utils/event';
import { TypeTreeProps, TypDragEventState } from '../interface';

export interface onDragInjectKey {
  dragNode: TreeNode;
  handleDragStart: (context: { node: TreeNode; dragEvent: DragEvent }) => void;
  handleDragEnd: (context: { node: TreeNode; dragEvent: DragEvent }) => void;
  handleDragOver: (context: { node: TreeNode; dragEvent: DragEvent }) => void;
  handleDragLeave: (context: { node: TreeNode; dragEvent: DragEvent }) => void;
  handleDrop: (context: { node: TreeNode; dropPosition: number; dragEvent: DragEvent }) => void;
}

export type OnDragMixinsType = {
  onDrag: onDragInjectKey;
};

export default function onDragMixins<BasicComponent extends Vue>() {
  return (Vue as VueConstructor<onDragInjectKey & BasicComponent>).extend({
    provide() {
      const {
        handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop,
      } = this;
      return {
        onDrag: {
          handleDragStart,
          handleDragEnd,
          handleDragOver,
          handleDragLeave,
          handleDrop,
        } as onDragInjectKey,
      };
    },
    data() {
      return {
        dragNode: null as TreeNode,
      };
    },
    methods: {
      handleDragStart(state: TypDragEventState) {
        const { dragEvent, node } = state;
        this.dragNode = node;

        const ctx = {
          node: node.getModel(),
          e: dragEvent,
        };
        emitEvent<Parameters<TypeTreeProps['onDragStart']>>(this, 'drag-start', ctx);
      },

      handleDragEnd(state: TypDragEventState) {
        const { dragEvent, node } = state;
        this.dragNode = node;

        const ctx = {
          node: node.getModel(),
          e: dragEvent,
        };
        emitEvent<Parameters<TypeTreeProps['onDragEnd']>>(this, 'drag-end', ctx);
      },

      handleDragOver(state: TypDragEventState) {
        const { dragEvent, node } = state;
        const ctx = {
          node: node.getModel(),
          e: dragEvent,
        };
        emitEvent<Parameters<TypeTreeProps['onDragOver']>>(this, 'drag-over', ctx);
      },

      handleDragLeave(state: TypDragEventState) {
        const { dragEvent, node } = state;
        const ctx = {
          node: node.getModel(),
          e: dragEvent,
        };
        emitEvent<Parameters<TypeTreeProps['onDragLeave']>>(this, 'drag-leave', ctx);
      },

      handleDrop(state: TypDragEventState) {
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
          dropNode: node.getModel(),
          dragNode: this.dragNode.getModel(),
          dropPosition,
          e: dragEvent,
        };
        emitEvent<Parameters<TypeTreeProps['onDrop']>>(this, 'drop', ctx);
      },
    },
  });
}
