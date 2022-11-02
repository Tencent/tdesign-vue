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

const keepAnimationMixins = getKeepAnimationMixins();

export const treeItemProps = {
  nested: {
    type: Boolean as PropType<TypeTreeItemProps['nested']>,
    default: false,
  },
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
  mixins: [getConfigReceiverMixins<Vue, TreeConfig>('tree'), keepAnimationMixins, getGlobalIconMixins()],
  setup(props: TypeTreeItemProps, context) {
    const { clearNodesMap, renderItemNode, renderBranchNode } = useTreeItem(props, context);

    return {
      renderItemNode,
      renderBranchNode,
      clearNodesMap,
    };
  },
  render(h) {
    const {
      node, nested, clearNodesMap, renderItemNode, renderBranchNode,
    } = this;
    const { tree, value } = node;

    if (!tree || !tree.nodeMap.get(value)) {
      clearNodesMap();
    }

    if (!nested) {
      return renderItemNode(h);
    }
    return renderBranchNode(h);
  },
});
