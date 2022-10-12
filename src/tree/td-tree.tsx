import upperFirst from 'lodash/upperFirst';
// import pick from 'lodash/pick';
import {
  computed,
  watch,
  toRefs,
  defineComponent,
  // SetupContext,
  // ref,
  // provide,
  // nextTick,
  // PropType,
  // onMounted,
} from '@vue/composition-api';
import TreeNode from '../_common/js/tree/tree-node';
// import TreeItem from './tree-item';
import props from './props';
import { useConfig, usePrefixClass } from '../hooks/useConfig';
import { renderTNodeJSX } from '../utils/render-tnode';
import { TNodeReturnValue, TreeOptionData } from '../common';
import {
  // TypeTdTreeProps,
  TreeNodeValue,
  TypeTreeState,
  // TypeValueMode,
  // TypeEventState,
  TreeNodeState,
  TypeTreeNodeModel,
  // TypeTreeInstance,
  // TypeTargetNode,
} from './interface';
import useTreeStore from './hooks/useTreeStore';
import useCache from './hooks/useCache';
import useTreeNodes from './hooks/useTreeNodes';
import {
  // getMark,
  getNode,
  // emitEvent,
} from './util';

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
    const { cache, updateTreeScope } = useCache(props);

    const classList = computed(() => {
      const cname = componentName.value;
      const list: Array<string> = [cname];
      const {
        disabled, hover, transition, checkable, expandOnClickNode,
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
      if (transition) {
        list.push(`${cname}--transition`);
      }
      if (expandOnClickNode) {
        list.push(`${cname}--block-node`);
      }
      return list;
    });

    // 单个节点高度(px)
    const itemMaxHeight = computed(() => 42);
    // tree 高度限制格式化
    const maxHeight = computed(() => 0);
    // 是否使用虚拟滚动
    const vScrollEnable = computed(() => !!maxHeight);
    // 是否启用嵌套布局
    // 暂时仅使用平铺布局
    // 嵌套布局还需要进一步提升渲染性能
    const nested = computed(() => !!maxHeight);

    // 用于 hooks 传递数据
    const state: TypeTreeState = {
      itemMaxHeight,
      vScrollEnable,
      nested,
      store,
      cache,
    };

    const {
      setActived, setExpanded, setChecked, renderTreeNodes,
    } = useTreeNodes(props, state, context);

    watch(refProps.data, (list) => {
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
      updateTreeScope,
      setActived,
      setExpanded,
      setChecked,
      renderTreeNodes,
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
            if (typeof setupMethod === 'function') {
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
      cache, classList, updateStoreConfig, updateTreeScope, renderTreeNodes,
    } = this;

    updateStoreConfig();
    updateTreeScope();

    // 更新 scopedSlots
    cache.scopedSlots = this.$scopedSlots;

    const treeNodeViews = renderTreeNodes(h);

    // 空数据判定
    let emptyNode: TNodeReturnValue = null;
    if (treeNodeViews.length <= 0) {
      const useLocale = !this.empty && !this.$scopedSlots.empty;
      const emptyContent = useLocale ? this.t(this.global.empty) : renderTNodeJSX(this, 'empty');
      emptyNode = <div class={`${this.componentName}__empty`}>{emptyContent}</div>;
    }

    // // 构造列表
    const treeNodeList = (
      <transition-group
        tag="div"
        class={`${this.componentName}__list`}
        enter-active-class={`${this.componentName}__item--enter-active`}
        leave-active-class={`${this.componentName}__item--leave-active`}
      >
        {treeNodeViews}
      </transition-group>
    );

    const treeNode = <div class={classList}>{emptyNode || treeNodeList}</div>;
    return treeNode;
  },
});

// watch: {
//   // tdesign-vue-next 编译的代码导致了 dom 频繁刷新
//   // 怀疑是在 render 替换了 object 类型的属性导致
//   // 因此变更属性替换能力为 watch 形式
//   // @see https://github.com/Tencent/tdesign-vue-next/issues/445
//   keys(keys) {
//     this.store.setConfig({
//       keys,
//     });
//   },
//   data(list) {
//     this.rebuild(list);
//   },
//   value(nVal) {
//     this.store.replaceChecked(nVal);
//   },
//   expanded(nVal) {
//     this.store.replaceExpanded(nVal);
//   },
//   actived(nVal) {
//     this.store.replaceActived(nVal);
//   },
// },
// methods: {
// rebuild(list: TdTreeProps['data']) {
//   this.$cacheMap.clear();
//   const { store, value, actived } = this;
//   store.reload(list);
//   // 初始化选中状态
//   if (Array.isArray(value)) {
//     store.setChecked(value);
//   }
//   // 更新展开状态
//   this.updateExpanded();
//   // 初始化激活状态
//   if (Array.isArray(actived)) {
//     store.setActived(actived);
//   }
//   // 刷新节点状态
//   store.refreshState();
// },
