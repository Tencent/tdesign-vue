import { TypePropType, defineComponent, ref } from './adapt';
import { TypeTreeItemProps } from './interface';
import useTreeItem from './hooks/useTreeItem';
import getConfigReceiverMixins, {
  TreeConfig,
  getKeepAnimationMixins,
  getGlobalIconMixins,
} from '../config-provider/config-receiver';
import ripple from '../utils/ripple';

const keepAnimationMixins = getKeepAnimationMixins();

export const treeItemProps = {
  node: {
    type: Object as TypePropType<TypeTreeItemProps['node']>,
  },
  rowIndex: {
    type: Number as TypePropType<TypeTreeItemProps['rowIndex']>,
  },
  treeScope: {
    type: Object as TypePropType<TypeTreeItemProps['treeScope']>,
  },
  expandOnClickNode: {
    type: Boolean as TypePropType<TypeTreeItemProps['expandOnClickNode']>,
  },
};

export default defineComponent({
  name: 'TTreeItem',
  props: treeItemProps,
  directives: { ripple },
  mixins: [getConfigReceiverMixins<Vue, TreeConfig>('tree'), keepAnimationMixins, getGlobalIconMixins()],
  inject: {
    onDrag: { default: undefined },
  },
  setup(props: TypeTreeItemProps, context) {
    const treeItemRef = ref(null);
    const { renderItemNode } = useTreeItem(props, context, treeItemRef);
    return {
      treeItemRef,
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
