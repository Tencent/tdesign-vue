import { VNode } from 'vue';
import upperFirst from 'lodash/upperFirst';
import pick from 'lodash/pick';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { TreeConfig } from '../config-provider/config-receiver';
import TreeStore from '../_common/js/tree/tree-store';
import TreeNode from '../_common/js/tree/tree-node';
import TreeItem from './tree-item';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { ClassName, TNodeReturnValue, TreeOptionData } from '../common';
import { TdTreeProps } from './type';
import {
  TypeTdTreeProps,
  TreeNodeValue,
  TypeValueMode,
  TypeEventState,
  TreeNodeState,
  TypeTreeNodeModel,
  TypeTreeInstance,
  TypeTargetNode,
} from './interface';
import { CLASS_NAMES } from './constants';
import { getMark, getNode, emitEvent } from './util';

export default mixins(getConfigReceiverMixins<TypeTreeInstance, TreeConfig>('tree')).extend({
  name: 'TTree',
  model: {
    prop: 'value',
    event: 'change',
  },
  props,
  data() {
    // 添加 $ 前缀的属性，不会被 vue 监听，初始化时无法取得 data 中定义的值
    // 写在 data 中是为了通过 ts 语法检测，应当在 created 生命周期初始化
    return {
      // 数据源
      store: null,
      // 视图列表
      treeNodeViews: [],
      // 混合配置对象
      // 传递给子节点，一起监听属性
      // 便于同步传递给 tree 的状态
      treeScope: {
        checkProps: null,
        disableCheck: false,
        empty: null,
        icon: null,
        label: null,
        line: null,
        operations: null,
      },
      // 缓存节点
      $cacheMap: null,
      // 缓存鼠标事件
      $mouseEvent: null,
      // 用于禁止绑定监听的 scope 对象，例如 scopedSlots
      // 如果 scopedSlots 放在可监听属性如 treeScope 中
      // 会导致外部关联组件如 input value 更新时，同步触发了所有子节点 render 方法
      // 因此单独提供此对象解锁关联
      $proxyScope: null,
    };
  },
  computed: {
    classList(): ClassName {
      const list: Array<string> = [CLASS_NAMES.tree];
      const {
        disabled, hover, transition, checkable, expandOnClickNode,
      } = this;
      if (disabled) {
        list.push(CLASS_NAMES.disabled);
      }
      if (hover) {
        list.push(CLASS_NAMES.treeHoverable);
      }
      if (checkable) {
        list.push(CLASS_NAMES.treeCheckable);
      }
      if (transition) {
        list.push(CLASS_NAMES.treeTransition);
      }
      if (expandOnClickNode) {
        list.push(CLASS_NAMES.treeBlockNode);
      }
      return list;
    },
    // 单个节点高度(px)
    itemMaxHeight(): number {
      return 42;
    },
    // tree 高度限制格式化
    maxHeight(): number {
      return 0;
    },
    // 是否使用虚拟滚动
    vScrollEnable(): boolean {
      return !!this.maxHeight;
    },
    // 是否启用嵌套布局
    nested(): boolean {
      let nested = !!this.maxHeight;
      // 暂时仅使用平铺布局
      // 嵌套布局还需要进一步提升渲染性能
      nested = false;
      return nested;
    },
  },
  watch: {
    data(list) {
      this.rebuild(list);
    },
    value(nVal) {
      this.store.replaceChecked(nVal);
    },
    expanded(nVal) {
      this.store.replaceExpanded(nVal);
    },
    actived(nVal) {
      this.store.replaceActived(nVal);
    },
  },
  methods: {
    // 创建单个 tree 节点
    renderItem(node: TreeNode) {
      const { nested, treeScope, $proxyScope } = this;
      const treeItem = (
        <TreeItem
          key={node.value}
          node={node}
          nested={nested}
          treeScope={treeScope}
          proxyScope={$proxyScope}
          onClick={this.handleClick}
          onChange={this.handleChange}
        />
      );
      return treeItem;
    },
    // 刷新树的视图状态
    refresh() {
      const { store, nested } = this;
      let nodes = [];
      if (nested) {
        // 渲染为嵌套结构
        nodes = store.getChildren();
      } else {
        // 渲染为平铺列表
        nodes = store.getNodes();
      }
      // 默认取全部可显示节点
      this.renderTreeNodeViews(nodes);
    },
    // 记录要渲染的节点
    renderTreeNodeViews(nodes: TreeNode[]) {
      const { store, $cacheMap } = this;
      this.treeNodeViews = nodes.map((node: TreeNode) => {
        // 如果节点已经存在，则使用缓存节点
        let nodeView = $cacheMap.get(node.value);
        // 如果节点未曾创建，则临时创建
        if (!nodeView && node.visible) {
          // 初次仅渲染可显示的节点
          // 不存在节点视图，则创建该节点视图并插入到当前位置
          nodeView = this.renderItem(node);
          $cacheMap.set(node.value, nodeView);
        }
        return nodeView;
      });

      // 更新缓存后，被删除的节点要移除掉，避免内存泄露
      this.$nextTick(() => {
        $cacheMap.forEach((view: VNode, value: string) => {
          if (!store.getNode(value)) {
            $cacheMap.delete(value);
          }
        });
      });
    },
    // 同步 Store 选项
    updateStoreConfig() {
      const { store } = this;
      if (!store) return;
      // 统一更新选项，然后在 store 统一识别属性更新
      const storeProps = pick(this, [
        'keys',
        'expandAll',
        'expandLevel',
        'expandMutex',
        'expandParent',
        'activable',
        'activeMultiple',
        'disabled',
        'checkable',
        'checkStrictly',
        'load',
        'lazy',
        'valueMode',
        'filter',
      ]);
      store.setConfig(storeProps);
    },
    updateExpanded() {
      const { store, expanded, expandParent } = this;
      // 初始化展开状态
      // 校验是否自动展开父节点
      if (Array.isArray(expanded)) {
        const expandedMap = new Map();
        expanded.forEach((val) => {
          expandedMap.set(val, true);
          if (expandParent) {
            const node = store.getNode(val);
            node.getParents().forEach((tn: TypeTreeNodeModel) => {
              expandedMap.set(tn.value, true);
            });
          }
        });
        const expandedArr = Array.from(expandedMap.keys());
        store.setExpanded(expandedArr);
      }
    },
    // 初始化树结构
    build() {
      let list = this.data;
      const {
        actived, value, valueMode, filter,
      } = this;

      const store = new TreeStore({
        valueMode: valueMode as TypeValueMode,
        filter,
        onLoad: (info: TypeEventState) => {
          this.handleLoad(info);
        },
        onUpdate: () => {
          this.refresh();
        },
      });

      // 初始化数据
      this.store = store;
      this.updateStoreConfig();

      if (!Array.isArray(list)) {
        list = [];
      }
      store.append(list);

      // 刷新节点，必须在配置选中之前执行
      // 这样选中态联动判断才能找到父节点
      store.refreshNodes();

      // 初始化选中状态
      if (Array.isArray(value)) {
        store.setChecked(value);
      }

      // 更新节点展开状态
      this.updateExpanded();

      // 初始化激活状态
      if (Array.isArray(actived)) {
        store.setActived(actived);
      }

      // 树的数据初始化之后，需要立即进行一次视图刷新
      this.refresh();
    },
    rebuild(list: TdTreeProps['data']) {
      this.$cacheMap.clear();
      const { store, value, actived } = this;
      store.reload(list);
      // 初始化选中状态
      if (Array.isArray(value)) {
        store.setChecked(value);
      }
      // 更新展开状态
      this.updateExpanded();
      // 初始化激活状态
      if (Array.isArray(actived)) {
        store.setActived(actived);
      }
      // 刷新节点状态
      store.refreshState();
    },
    toggleActived(item: TypeTargetNode): TreeNodeValue[] {
      const node = getNode(this.store, item);
      return this.setActived(node, !node.isActived());
    },
    setActived(item: TypeTargetNode, isActived: boolean) {
      const node = getNode(this.store, item);
      const actived = node.setActived(isActived);
      const { $mouseEvent } = this;
      const ctx = {
        node: node.getModel(),
        e: $mouseEvent,
      };
      emitEvent<Parameters<TypeTdTreeProps['onActive']>>(this, 'active', actived, ctx);
      return actived;
    },
    toggleExpanded(item: TypeTargetNode): TreeNodeValue[] {
      const node = getNode(this.store, item);
      return this.setExpanded(node, !node.isExpanded());
    },
    setExpanded(item: TypeTargetNode, isExpanded: boolean): TreeNodeValue[] {
      const node = getNode(this.store, item);
      const expanded = node.setExpanded(isExpanded);
      const { $mouseEvent } = this;
      const ctx = {
        node: node.getModel(),
        e: $mouseEvent,
      };
      emitEvent<Parameters<TypeTdTreeProps['onExpand']>>(this, 'expand', expanded, ctx);
      return expanded;
    },
    toggleChecked(item: TypeTargetNode): TreeNodeValue[] {
      const node = getNode(this.store, item);
      return this.setChecked(node, !node.isChecked());
    },
    setChecked(item: TypeTargetNode, isChecked: boolean): TreeNodeValue[] {
      const node = getNode(this.store, item);
      const checked = node.setChecked(isChecked);
      const ctx = {
        node: node.getModel(),
      };
      emitEvent<Parameters<TypeTdTreeProps['onChange']>>(this, 'change', checked, ctx);
      return checked;
    },
    handleLoad(info: TypeEventState): void {
      const { node } = info;
      const ctx = {
        node: node.getModel(),
      };
      const {
        value, expanded, actived, store,
      } = this;
      if (value && value.length > 0) {
        store.replaceChecked(value);
      }
      if (expanded && expanded.length > 0) {
        store.replaceExpanded(expanded);
      }
      if (actived && actived.length > 0) {
        store.replaceActived(actived);
      }
      emitEvent<Parameters<TypeTdTreeProps['onLoad']>>(this, 'load', ctx);
    },
    handleClick(state: TypeEventState): void {
      const { expandOnClickNode } = this;
      const { mouseEvent, event, node } = state;
      if (!node || this.disabled || node.disabled) {
        return;
      }

      this.$mouseEvent = mouseEvent;

      let shouldExpand = expandOnClickNode;
      let shouldActive = true;
      ['trigger', 'ignore'].forEach((markName) => {
        const mark = getMark(markName, event.target as HTMLElement, event.currentTarget as HTMLElement);
        const markValue = mark?.value || '';
        if (markValue.indexOf('expand') >= 0) {
          if (markName === 'trigger') {
            shouldExpand = true;
          } else if (markName === 'ignore') {
            shouldExpand = false;
          }
        }
        if (markValue.indexOf('active') >= 0) {
          if (markName === 'ignore') {
            shouldActive = false;
          }
        }
      });

      if (shouldExpand) {
        this.toggleExpanded(node);
      }
      if (shouldActive) {
        this.toggleActived(node);
      }

      const ctx = {
        node: node.getModel(),
        e: mouseEvent,
      };
      emitEvent<Parameters<TypeTdTreeProps['onClick']>>(this, 'click', ctx);

      this.$mouseEvent = null;
    },
    handleChange(state: TypeEventState): void {
      const { disabled } = this;
      const { node } = state;
      if (!node || disabled || node.disabled) {
        return;
      }
      this.toggleChecked(node);
    },
    updateTreeScope(): void {
      const { treeScope } = this;
      const scopedProps = pick(this, ['checkProps', 'disableCheck', 'empty', 'icon', 'label', 'line', 'operations']);
      Object.assign(treeScope, scopedProps);
    },

    // -------- 公共方法 start --------
    setItem(value: TreeNodeValue, options: TreeNodeState): void {
      const node: TreeNode = this.store.getNode(value);
      const spec = options;
      const keys = Object.keys(spec);
      if (node && spec) {
        ['expanded', 'actived', 'checked'].forEach((name) => {
          if (keys.includes(name)) {
            this[`set${upperFirst(name)}`](node, spec[name]);
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
      let pathNodes = [];
      if (node) {
        pathNodes = node.getPath().map((node: TreeNode) => node.getModel());
      }
      return pathNodes;
    },
    // -------- 公共方法 end --------
  },
  created() {
    this.$cacheMap = new Map();
    this.$mouseEvent = null;
    this.$proxyScope = {};
    this.updateTreeScope();

    this.build();
  },
  render(): VNode {
    const { classList, $proxyScope, treeNodeViews } = this;

    // 用于性能调试
    // console.log('tree render');

    // 一些选项的变化，要传递到子节点去
    this.updateStoreConfig();
    this.updateTreeScope();

    // 更新 scopedSlots
    $proxyScope.scopedSlots = this.$scopedSlots;

    // 空数据判定
    let emptyNode: TNodeReturnValue = null;
    if (treeNodeViews.length <= 0) {
      const useLocale = !this.empty && !this.$scopedSlots.empty;
      const emptyContent = useLocale ? this.t(this.global.empty) : renderTNodeJSX(this, 'empty');
      emptyNode = <div class={CLASS_NAMES.treeEmpty}>{emptyContent}</div>;
    }

    // 构造列表
    const treeNodeList = (
      <transition-group
        tag="div"
        class={CLASS_NAMES.treeList}
        enter-active-class={CLASS_NAMES.treeNodeEnter}
        leave-active-class={CLASS_NAMES.treeNodeLeave}
      >
        {treeNodeViews}
      </transition-group>
    );

    const treeNode = <div class={classList}>{emptyNode || treeNodeList}</div>;
    return treeNode;
  },
});
