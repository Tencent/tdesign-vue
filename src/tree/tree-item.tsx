import { PropType } from 'vue';
import { defineComponent } from '@vue/composition-api';
import getConfigReceiverMixins, {
  TreeConfig,
  getKeepAnimationMixins,
  getGlobalIconMixins,
} from '../config-provider/config-receiver';
import { TypeTreeItemProps } from './interface';
import useTreeItem from './hooks/useTreeItem';
import ripple from '../utils/ripple';
import draggableMixins from './mixins/draggable';

const keepAnimationMixins = getKeepAnimationMixins();

export const treeItemProps = {
  node: {
    type: Object as PropType<TypeTreeItemProps['node']>,
  },
  treeScope: {
    type: Object as PropType<TypeTreeItemProps['treeScope']>,
  },
  expandOnClickNode: {
    type: Boolean as PropType<TypeTreeItemProps['expandOnClickNode']>,
  },
};

export default defineComponent({
  name: 'TTreeItem',
  props: treeItemProps,
  directives: { ripple },
  mixins: [
    getConfigReceiverMixins<Vue, TreeConfig>('tree'),
    keepAnimationMixins,
    getGlobalIconMixins(),
    draggableMixins(),
  ],
  inject: {
    onDrag: { default: undefined },
  },
  setup(props: TypeTreeItemProps, context) {
    const { renderItemNode } = useTreeItem(props, context);
    return {
      renderItemNode,
    };
  },
  render(h) {
    // 这个类型判断看起来多此一举
    // 然而单元测试时没有它却会报错:
    // This expression is not callable. Type '{}' has no call signatures.
    if (typeof this.renderItemNode === 'function') {
      return this.renderItemNode(h);
    }
    return null;
  },
});

// computed: {
//   classList(): ClassName {
//     const { isDragOver, isDragging, dropPosition } = this.dragStates;
//     const { node, nested } = this;

//     const list = [];

//     list.push(`${this.componentName}__item`);
//     list.push({
//       [`${this.componentName}__item--open`]: node.expanded,
//       [`${this.classPrefix}-is-active`]: node.isActivable() ? node.actived : false,
//       [`${this.classPrefix}-is-disabled`]: node.isDisabled(),
//     });
//     list.push({
//       [`${this.componentName}__item--draggable`]: node.isDraggable(),
//     });
//     if (!nested) {
//       if (node.visible) {
//         list.push(`${this.componentName}__item--visible`);
//       } else {
//         list.push(`${this.componentName}__item--hidden`);
//       }
//     }
//     // 拖拽过程样式相关classList
//     const dragClassList = {
//       [`${this.componentName}__item--dragging`]: isDragging,
//       [`${this.componentName}__item--tip-top`]: isDragOver && dropPosition < 0,
//       [`${this.componentName}__item--tip-bottom`]: isDragOver && dropPosition > 0,
//       [`${this.componentName}__item--tip-highlight`]: !isDragging && isDragOver && dropPosition === 0,
//     };
//     return list.concat(dragClassList);
//   },
// },

// render(createElement: CreateElement) {
//   const { node, nested } = this;
//   const { tree, level, value } = node;

//   const styles = this.getStyles();
//   const { classList } = this;
//   const itemNode = (
//     <div
//       class={classList}
//       data-value={value}
//       data-level={level}
//       style={styles}
//       draggable={node.isDraggable()}
//       onClick={(evt: MouseEvent) => this.handleClick(evt)}
//       onDragstart={(evt: DragEvent) => this.handleDragStart(evt)}
//       onDragend={(evt: DragEvent) => this.handleDragEnd(evt)}
//       onDragover={(evt: DragEvent) => this.handleDragOver(evt)}
//       onDragleave={(evt: DragEvent) => this.handleDragLeave(evt)}
//       onDrop={(evt: DragEvent) => this.handleDrop(evt)}
//     >
//       {this.renderItem(createElement)}
//     </div>
//   );
