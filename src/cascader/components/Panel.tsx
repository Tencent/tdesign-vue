import { PropType } from 'vue';
import { defineComponent, computed } from '@vue/composition-api';
import Item from './Item';
import { TreeNode, CascaderContextType, CascaderValue } from '../interface';
import CascaderProps from '../props';
import { usePrefixClass, useConfig } from '../../hooks/useConfig';
import { useTNodeDefault } from '../../hooks/tnode';
import { getDefaultNode } from '../../hooks/render-tnode';
import { getPanels } from '../core/helper';
import { expendClickEffect, valueChangeEffect } from '../core/effect';

export default defineComponent({
  name: 'TCascaderSubPanel',
  props: {
    option: CascaderProps.option,
    empty: CascaderProps.empty,
    trigger: CascaderProps.trigger,
    onChange: CascaderProps.onChange,
    loading: CascaderProps.loading,
    loadingText: CascaderProps.loadingText,
    cascaderContext: {
      type: Object as PropType<CascaderContextType>,
    },
  },
  setup(props, { emit }) {
    const renderTNodeJSXDefault = useTNodeDefault();
    const COMPONENT_NAME = usePrefixClass('cascader');
    const { global } = useConfig('cascader');
    const {
      valueType, cascaderValue, treeStore, multiple,
    } = props.cascaderContext;
    const { config } = treeStore;

    const panels = computed(() => getPanels(props.cascaderContext.treeNodes));

    const handleExpand = (node: TreeNode, trigger: 'hover' | 'click') => {
      const { trigger: propsTrigger, cascaderContext } = props;
      expendClickEffect(propsTrigger, trigger, node, cascaderContext);
    };

    // 异步加载回显时默认触发第一个值
    if (config.load && valueType === 'full' && (cascaderValue as Array<CascaderValue>).length > 0) {
      const firstValue = multiple ? cascaderValue[0][0] : cascaderValue[0];
      const firstExpandNode = treeStore.nodes.find((node: TreeNode) => node.value === firstValue);
      handleExpand(firstExpandNode, 'click');
    }

    return {
      global,
      panels,
      handleExpand,
      renderTNodeJSXDefault,
      COMPONENT_NAME,
      emit,
    };
  },
  render() {
    const {
      global, COMPONENT_NAME, handleExpand, renderTNodeJSXDefault, cascaderContext, panels, emit,
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
        />
      );
    };

    const renderList = (treeNodes: TreeNode[], isFilter = false, segment = true, index = 1) => (
      <ul
        class={[
          `${COMPONENT_NAME}__menu`,
          'narrow-scrollbar',
          {
            [`${COMPONENT_NAME}__menu--segment`]: segment,
            [`${COMPONENT_NAME}__menu--filter`]: isFilter,
          },
        ]}
        key={`${COMPONENT_NAME}__menu${index}`}
      >
        {treeNodes.map((node: TreeNode) => renderItem(node, index))}
      </ul>
    );

    const renderEmpty = () => {
      if (this.empty && typeof this.empty === 'string') {
        return <div class={`${COMPONENT_NAME}__panel--empty`}>{this.empty}</div>;
      }
      return renderTNodeJSXDefault('empty', <div class={`${COMPONENT_NAME}__panel--empty`}>{global.empty}</div>);
    };

    const renderPanels = () => {
      const { inputVal, treeNodes } = cascaderContext;
      return inputVal
        ? renderList(treeNodes, true)
        : panels.map((treeNodes, index: number) => renderList(treeNodes, false, index !== panels.length - 1, index));
    };

    let content;
    if (this.loading) {
      content = renderTNodeJSXDefault(
        'loadingText',
        <div class={`${COMPONENT_NAME}__panel--empty`}>{global.loadingText}</div>,
      );
    } else {
      content = panels.length ? renderPanels() : renderEmpty();
    }
    return (
      <div class={[`${COMPONENT_NAME}__panel`, { [`${COMPONENT_NAME}--normal`]: panels.length && !this.loading }]}>
        {content}
      </div>
    );
  },
});
