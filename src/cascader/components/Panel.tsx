import { PropType } from 'vue';
import { defineComponent, computed } from '@vue/composition-api';
import { TreeNode, CascaderContextType, CascaderValue } from '../interface';
import CascaderProps from '../props';
import { usePrefixClass, useConfig } from '../../hooks/useConfig';
import { useTNodeDefault } from '../../hooks/tnode';
import { getPanels } from '../core/helper';
import { expendClickEffect } from '../core/effect';
import List from './List';

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
    scroll: CascaderProps.scroll,
  },
  setup(props, { emit }) {
    const renderTNodeJSXDefault = useTNodeDefault();
    const COMPONENT_NAME = usePrefixClass('cascader');
    const { global } = useConfig('cascader');
    const {
      valueType, cascaderValue, treeStore, multiple,
    } = props.cascaderContext;

    const panels = computed(() => getPanels(props.cascaderContext.treeNodes));

    const handleExpand = (node: TreeNode, trigger: 'hover' | 'click') => {
      const { trigger: propsTrigger, cascaderContext } = props;
      expendClickEffect(propsTrigger, trigger, node, cascaderContext);
    };

    // 异步加载回显时默认触发第一个值
    if (treeStore?.config?.load && valueType === 'full' && (cascaderValue as Array<CascaderValue>).length > 0) {
      const firstValue = multiple ? (cascaderValue as any)[0][0] : (cascaderValue as any)[0];
      const firstExpandNode = treeStore.nodes.find((node: TreeNode) => node.value === firstValue);
      handleExpand(firstExpandNode, 'click');
    }
    return {
      global,
      panels,
      renderTNodeJSXDefault,
      COMPONENT_NAME,
      emit,
    };
  },
  render() {
    const {
      global, COMPONENT_NAME, renderTNodeJSXDefault, option, cascaderContext, panels, scroll, trigger,
    } = this;

    const renderEmpty = () => {
      if (this.empty && typeof this.empty === 'string') {
        return <div class={`${COMPONENT_NAME}__panel--empty`}>{this.empty}</div>;
      }
      return renderTNodeJSXDefault('empty', <div class={`${COMPONENT_NAME}__panel--empty`}>{global.empty}</div>);
    };

    const renderPanels = () => {
      const { inputVal, treeNodes } = cascaderContext;
      return inputVal ? (
        <List
          treeNodes={treeNodes}
          isFilter
          option={option}
          cascaderContext={cascaderContext}
          scroll={scroll}
          trigger={trigger}
        />
      ) : (
        panels.map((treeNodes, index: number) => (
          <List
            treeNodes={treeNodes}
            isFilter={false}
            segment={index !== panels.length - 1}
            key={`${COMPONENT_NAME}__menu${index}`}
            listKey={`${COMPONENT_NAME}__menu${index}`}
            level={index}
            option={option}
            cascaderContext={cascaderContext}
            scroll={scroll}
            trigger={trigger}
          />
        ))
      );
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
