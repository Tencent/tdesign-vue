import upperFirst from 'lodash/upperFirst';
import isFunction from 'lodash/isFunction';
import {
  computed, watch, toRefs, defineComponent,
} from '@vue/composition-api';

import TreeNode from '../_common/js/tree/tree-node';
import props from './props';
import { useConfig, usePrefixClass } from '../hooks/useConfig';
import { renderTNodeJSX } from '../utils/render-tnode';
import { TNodeReturnValue, TreeOptionData } from '../common';
import {
  TreeNodeValue, TypeTreeState, TreeNodeState, TypeTreeNodeModel,
} from './interface';
import useTreeStore from './hooks/useTreeStore';
import useCache from './hooks/useCache';
import useTreeAction from './hooks/useTreeAction';
import useTreeNodes from './hooks/useTreeNodes';
import useDragHandle from './hooks/useDragHandle';
import { getNode } from './util';

// 2022.11.02 tabliang 备注
// 之前尝试实现了嵌套布局，原本预期嵌套布局能够提升大数据量下，全部渲染节点时的性能表现
// 实测性能提升有限，不如使用虚拟滚动的收益高，反而导致了组件的维护困难与混乱
// 自 2022 年初首次提出嵌套布局要求，大半年以来，对嵌套布局的需求也不是很高
// 因此废弃嵌套布局方案，之后重点解决虚拟滚动能力

export default defineComponent({
  name: 'TTree',
  model: {
    prop: 'value',
    event: 'change',
  },
  props,
  setup(props, context) {
    const { t, global } = useConfig('tree');
    const classPrefix = usePrefixClass();
    const componentName = usePrefixClass('tree');
    const refProps = toRefs(props);
    const { store, rebuild, updateStoreConfig } = useTreeStore(props, context);
    const { cache } = useCache(props);

    const classList = computed(() => {
      const cname = componentName.value;
      const list: Array<string> = [cname];
      const {
        disabled, hover, transition, checkable, draggable, expandOnClickNode,
      } = props;
      if (disabled) {
        list.push(`${classPrefix.value}-is-disabled`);
      }
      if (hover) {
        list.push(`${cname}--hoverable`);
      }
      if (checkable) {
        list.push(`${cname}--checkable`);
      }
      if (draggable) {
        list.push(`${cname}--draggable`);
      }
      if (transition) {
        list.push(`${cname}--transition`);
      }
      if (expandOnClickNode) {
        list.push(`${cname}--block-node`);
      }
      return list;
    });

    // 用于 hooks 传递数据
    const state: TypeTreeState = {
      store,
      cache,
    };

    useDragHandle(props, context, state);
    const { setActived, setExpanded, setChecked } = useTreeAction(props, context, state);
    const { renderTreeNodes, clearCacheNodes, nodesEmpty } = useTreeNodes(props, context, state);

    watch(refProps.data, (list) => {
      clearCacheNodes();
      rebuild(list);
    });
    watch(refProps.keys, (keys) => {
      store.setConfig({
        keys,
      });
    });
    watch(refProps.value, (nVal) => {
      store.replaceChecked(nVal);
    });
    watch(refProps.expanded, (nVal) => {
      store.replaceExpanded(nVal);
    });
    watch(refProps.actived, (nVal) => {
      store.replaceActived(nVal);
    });

    // 不想暴露给用户的属性与方法，统一挂载到 setup 返回的对象上
    // 实例上无法直接访问这些方法与属性
    return {
      t,
      global,
      classPrefix,
      componentName,
      store,
      cache,
      classList,
      updateStoreConfig,
      setActived,
      setExpanded,
      setChecked,
      renderTreeNodes,
      nodesEmpty,
    };
  },
  // 在 methods 提供公共方法
  // 实例上可以直接访问
  methods: {
    setItem(value: TreeNodeValue, options: TreeNodeState): void {
      const node: TreeNode = this.store.getNode(value);
      const spec = options;
      const keys = Object.keys(spec);
      if (node && spec) {
        ['expanded', 'actived', 'checked'].forEach((name) => {
          if (keys.includes(name)) {
            const setupMethod = this[`set${upperFirst(name)}`];
            if (isFunction(setupMethod)) {
              setupMethod(node, spec[name]);
            }
            delete spec[name];
          }
        });
        node.set(spec);
      }
    },
    getItem(value: TreeNodeValue): TypeTreeNodeModel {
      const node: TreeNode = this.store.getNode(value);
      return node?.getModel();
    },
    getItems(value?: TreeNodeValue): TypeTreeNodeModel[] {
      const nodes = this.store.getNodes(value);
      return nodes.map((node: TreeNode) => node.getModel());
    },
    appendTo(para?: TreeNodeValue, item?: TreeOptionData | TreeOptionData[]) {
      const { store } = this;
      let list = [];
      if (Array.isArray(item)) {
        list = item;
      } else {
        list = [item];
      }
      list.forEach((item) => {
        const val = item?.value || '';
        const node = getNode(store, val);
        if (node) {
          store.appendNodes(para, node);
        } else {
          store.appendNodes(para, item);
        }
      });
    },
    insertBefore(value: TreeNodeValue, item: TreeOptionData) {
      const { store } = this;
      const val = item?.value || '';
      const node = getNode(store, val);
      if (node) {
        store.insertBefore(value, node);
      } else {
        store.insertBefore(value, item);
      }
    },
    insertAfter(value: TreeNodeValue, item: TreeOptionData) {
      const { store } = this;
      const val = item?.value || '';
      const node = getNode(store, val);
      if (node) {
        store.insertAfter(value, node);
      } else {
        store.insertAfter(value, item);
      }
    },
    remove(value?: TreeNodeValue) {
      return this.store.remove(value);
    },
    getIndex(value: TreeNodeValue): number {
      return this.store.getNodeIndex(value);
    },
    getParent(value: TreeNodeValue): TypeTreeNodeModel {
      const node = this.store.getParent(value);
      return node?.getModel();
    },
    getParents(value: TreeNodeValue): TypeTreeNodeModel[] {
      const nodes = this.store.getParents(value);
      return nodes.map((node: TreeNode) => node.getModel());
    },
    getPath(value: TreeNodeValue): TypeTreeNodeModel[] {
      const node = this.store.getNode(value);
      let pathNodes: TypeTreeNodeModel[] = [];
      if (node) {
        pathNodes = node.getPath().map((node: TreeNode) => node.getModel());
      }
      return pathNodes;
    },
  },
  render(h) {
    const {
      cache, classList, updateStoreConfig, renderTreeNodes, nodesEmpty,
    } = this;

    updateStoreConfig();

    const { scope } = cache;
    // 更新 scopedSlots
    scope.scopedSlots = this.$scopedSlots;

    const treeNodeViews = renderTreeNodes(h);
    const cname = this.componentName;

    // 空数据判定
    let emptyNode: TNodeReturnValue = null;
    if (nodesEmpty) {
      const useLocale = !this.empty && !this.$scopedSlots.empty;
      const emptyContent = useLocale ? this.t(this.global.empty) : renderTNodeJSX(this, 'empty');
      emptyNode = <div class={`${cname}__empty`}>{emptyContent}</div>;
    } else if (treeNodeViews.length <= 0) {
      // 数据切换时，有闪现的缓存节点呈现
      // 用这个替换内容置空
      emptyNode = <div></div>;
    }

    // 构造列表
    const treeNodeList = (
      <transition-group
        tag="div"
        class={`${cname}__list`}
        enter-active-class={`${cname}__item--enter-active`}
        leave-active-class={`${cname}__item--leave-active`}
      >
        {treeNodeViews}
      </transition-group>
    );

    const treeNode = <div class={classList}>{emptyNode || treeNodeList}</div>;
    return treeNode;
  },
});
