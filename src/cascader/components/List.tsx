import {
  computed, defineComponent, nextTick, PropType, ref, watch,
} from '@vue/composition-api';
import { useTNodeDefault } from '../../hooks/tnode';
import { getDefaultNode } from '../../hooks/render-tnode';
import useListVirtualScroll from '../../list/hooks/useListVirtualScroll';
import { usePrefixClass } from '../../hooks';
import Item from './Item';
import CascaderProps from '../props';
import { CascaderContextType, TreeNode } from '../interface';
import { expendClickEffect, valueChangeEffect } from '../core/effect';

const props = {
  treeNodes: {
    type: Array as PropType<TreeNode[]>,
    default: [] as PropType<TreeNode[]>,
  },
  isFilter: {
    type: Boolean,
    default: false,
  },
  segment: {
    type: Boolean,
    default: true,
  },
  listKey: {
    type: String,
  },
  level: {
    type: Number,
    default: 0,
  },
  option: CascaderProps.option,
  trigger: CascaderProps.trigger,
  scroll: CascaderProps.scroll,
  cascaderContext: {
    type: Object as PropType<CascaderContextType>,
  },
};

export default defineComponent({
  name: 'TCascaderList',
  props,
  setup(props, { emit }) {
    const renderTNodeJSXDefault = useTNodeDefault();
    const COMPONENT_NAME = usePrefixClass('cascader');
    const panelWrapperRef = ref<HTMLDivElement>(null);

    const treeNodes = computed(() => props.treeNodes);
    const isVisible = computed(() => props.cascaderContext.visible);

    const {
      virtualConfig,
      cursorStyle,
      listStyle,
      isVirtualScroll,
      onInnerVirtualScroll,
      scrollToElement,
      handleRowMounted,
    } = useListVirtualScroll(props.scroll, panelWrapperRef, treeNodes as any);

    const handleExpand = (node: TreeNode, trigger: 'hover' | 'click') => {
      const { trigger: propsTrigger, cascaderContext } = props;
      expendClickEffect(propsTrigger, trigger, node, cascaderContext);
    };

    const onScrollIntoView = () => {
      const { level, treeNodes, cascaderContext } = props;
      const checkedNodes = cascaderContext.treeStore.getCheckedNodes();
      let lastCheckedNodes = checkedNodes[checkedNodes.length - 1];
      let index = -1;
      if (lastCheckedNodes?.level === level) {
        index = treeNodes.findLastIndex((item) => item.value === lastCheckedNodes.value);
      } else {
        while (lastCheckedNodes) {
          if (lastCheckedNodes?.level === level) {
            // eslint-disable-next-line no-loop-func
            index = treeNodes.findIndex((item) => item.value === lastCheckedNodes.value);
            break;
          }
          lastCheckedNodes = lastCheckedNodes?.parent;
        }
      }

      if (index !== -1) {
        scrollToElement({
          index,
        });
      }
    };

    const handleScroll = (event: WheelEvent): void => {
      if (isVirtualScroll.value) onInnerVirtualScroll(event as unknown as WheelEvent);
    };

    watch(
      isVisible,
      () => {
        if (props.scroll && props.cascaderContext.visible) {
          setTimeout(() => {
            nextTick(() => {
              onScrollIntoView();
            });
          }, 16);
        }
      },
      {
        immediate: true,
      },
    );

    return {
      panelWrapperRef,
      COMPONENT_NAME,
      virtualConfig,
      cursorStyle,
      listStyle,
      isVirtualScroll,
      renderTNodeJSXDefault,
      emit,
      handleExpand,
      handleScroll,
      handleRowMounted,
    };
  },
  render() {
    const {
      COMPONENT_NAME,
      treeNodes,
      isFilter,
      segment,
      listKey: key,
      cascaderContext,
      virtualConfig,
      cursorStyle,
      listStyle,
      isVirtualScroll,
      renderTNodeJSXDefault,
      emit,
      handleExpand,
      handleScroll,
      handleRowMounted,
    } = this;

    const renderItem = (node: TreeNode, index: number) => {
      const optionChild = node.data.content
        ? getDefaultNode(node.data.content(this.$createElement))
        : renderTNodeJSXDefault('option', {
          params: { item: node.data, index },
        });
      return (
        <Item
          key={node.value}
          node={node}
          cascaderContext={cascaderContext}
          isVirtual={isVirtualScroll}
          {...{
            props: {
              node,
              optionChild,
              cascaderContext,
              onClick: () => {
                emit('click', node.value, node);
                handleExpand(node, 'click');
              },
              onMouseenter: () => {
                handleExpand(node, 'hover');
              },
              onChange: () => {
                valueChangeEffect(node, cascaderContext);
              },
            },
          }}
          handleRowMounted={handleRowMounted}
        />
      );
    };

    return (
      <div
        ref="panelWrapperRef"
        onScroll={handleScroll}
        class={[
          `${COMPONENT_NAME}__menu`,
          'narrow-scrollbar',
          {
            [`${COMPONENT_NAME}__menu--segment`]: segment,
            [`${COMPONENT_NAME}__menu--filter`]: isFilter,
          },
        ]}
        style={{
          position: isVirtualScroll ? 'relative' : undefined,
        }}
      >
        {isVirtualScroll ? <div style={cursorStyle}></div> : null}
        {isVirtualScroll ? (
          <ul key={key} style={listStyle}>
            {virtualConfig.visibleData.value.map((node, index) => renderItem(node, index))}
          </ul>
        ) : (
          <ul key={key}>{treeNodes.map((node: TreeNode, index: number) => renderItem(node, index))}</ul>
        )}
      </div>
    );
  },
});
