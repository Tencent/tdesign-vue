import { PropType } from 'vue';
import { defineComponent, computed } from '@vue/composition-api';
import Item from './Item';
import { TreeNode, CascaderContextType } from '../interface';
import CascaderProps from '../props';
import { usePrefixClass, useConfig } from '../../hooks/useConfig';
import { useTNodeDefault } from '../../hooks/tnode';

import { getPanels } from '../core/helper';
import { expendClickEffect, valueChangeEffect } from '../core/effect';

export default defineComponent({
  name: 'TCascaderSubPanel',
  props: {
    empty: CascaderProps.empty,
    trigger: CascaderProps.trigger,
    onChange: CascaderProps.onChange,
    cascaderContext: {
      type: Object as PropType<CascaderContextType>,
    },
  },
  setup(props) {
    const renderTNodeJSXDefault = useTNodeDefault();
    const COMPONENT_NAME = usePrefixClass('cascader');
    const { global } = useConfig('cascader');

    const panels = computed(() => getPanels(props.cascaderContext.treeNodes));

    const handleExpand = (node: TreeNode, trigger: 'hover' | 'click') => {
      const { trigger: propsTrigger, cascaderContext } = props;
      expendClickEffect(propsTrigger, trigger, node, cascaderContext);
    };

    return {
      global,
      panels,
      handleExpand,
      renderTNodeJSXDefault,
      COMPONENT_NAME,
    };
  },
  render() {
    const {
      global, COMPONENT_NAME, handleExpand, renderTNodeJSXDefault, cascaderContext, panels,
    } = this;

    const renderItem = (node: TreeNode) => (
      <Item
        key={node.value}
        node={node}
        cascaderContext={cascaderContext}
        {...{
          props: {
            node,
            cascaderContext,
            onClick: () => {
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

    const renderList = (treeNodes: TreeNode[], isFilter = false, segment = true, key = '1') => (
      <ul
        class={[
          `${COMPONENT_NAME}__menu`,
          'narrow-scrollbar',
          {
            [`${COMPONENT_NAME}__menu--segment`]: segment,
            [`${COMPONENT_NAME}__menu--filter`]: isFilter,
          },
        ]}
        key={key}
      >
        {treeNodes.map((node: TreeNode) => renderItem(node))}
      </ul>
    );

    const renderPanels = () => {
      const { inputVal, treeNodes } = cascaderContext;
      return inputVal
        ? renderList(treeNodes, true)
        : panels.map((treeNodes, index: number) => renderList(treeNodes, false, index !== panels.length - 1, `${COMPONENT_NAME}__menu${index}`));
    };

    return (
      <div class={[`${COMPONENT_NAME}__panel`, { [`${COMPONENT_NAME}--normal`]: panels.length }]}>
        {panels.length
          ? renderPanels()
          : renderTNodeJSXDefault('empty', <div class={`${COMPONENT_NAME}__panel--empty`}>{global.empty}</div>)}
      </div>
    );
  },
});
