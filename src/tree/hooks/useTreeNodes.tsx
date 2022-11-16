import { CreateElement } from 'vue';
import {
  ref, nextTick, SetupContext, Ref,
} from '@vue/composition-api';
import {
  TypeVNode, TreeNodeValue, TypeTreeProps, TypeTreeState, TypeEventState, TypeTargetNode,
} from '../interface';
import TreeItem from '../tree-item';
import TreeNode from '../../_common/js/tree/tree-node';
import { getMark, getNode } from '../util';

export default function useTreeNodes(props: TypeTreeProps, context: SetupContext, state: TypeTreeState) {
  const { cache, store } = state;

  const setExpanded = (item: TypeTargetNode, isExpanded: boolean): TreeNodeValue[] => {
    const node = getNode(store, item);
    const expanded = node.setExpanded(isExpanded);
    const evtCtx = {
      node: node.getModel(),
      e: cache.mouseEvent as MouseEvent,
    };
    if (props?.onExpand) {
      props?.onExpand(expanded, evtCtx);
    }
    context.emit('expand', expanded, evtCtx);
    return expanded;
  };

  const toggleExpanded = (item: TypeTargetNode): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setExpanded(node, !node.isExpanded());
  };

  const setActived = (item: TypeTargetNode, isActived: boolean) => {
    const node = getNode(store, item);
    const actived = node.setActived(isActived);
    const evtCtx = {
      node: node.getModel(),
      e: cache.mouseEvent,
    };
    if (props?.onActive) {
      props?.onActive(actived, evtCtx);
    }
    context.emit('active', actived, evtCtx);
    return actived;
  };

  const toggleActived = (item: TypeTargetNode): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setActived(node, !node.isActived());
  };

  const setChecked = (item: TypeTargetNode, isChecked: boolean): TreeNodeValue[] => {
    const node = getNode(store, item);
    const checked = node.setChecked(isChecked);
    const evtCtx = {
      node: node.getModel(),
    };
    if (props?.onChange) {
      props?.onChange(checked, evtCtx);
    }
    context.emit('change', checked, evtCtx);
    return checked;
  };

  const toggleChecked = (item: TypeTargetNode): TreeNodeValue[] => {
    const node = getNode(store, item);
    return setChecked(node, !node.isChecked());
  };

  const handleClick = (evtState: TypeEventState) => {
    const { mouseEvent, event, node } = evtState;
    if (!node) {
      return;
    }

    cache.mouseEvent = mouseEvent;

    let shouldExpand = props.expandOnClickNode;
    let shouldActive = !props.disabled && !node.disabled;
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
      toggleExpanded(node);
    }

    const evtCtx = {
      node: node.getModel(),
      e: mouseEvent,
    };

    if (shouldActive) {
      toggleActived(node);
      if (props?.onClick) {
        props?.onClick(evtCtx);
      }
      context.emit('click', evtCtx);
    }

    cache.mouseEvent = null;
  };

  const handleChange = (evtState: TypeEventState) => {
    const { disabled } = props;
    const { node } = evtState;
    if (!node || disabled || node.disabled) {
      return;
    }
    toggleChecked(node);
  };

  // 创建单个 tree 节点
  const renderItem = (h: CreateElement, node: TreeNode) => {
    const { cache } = state;
    const { expandOnClickNode } = props;
    const { scope } = cache;

    const treeItem = (
      <TreeItem
        key={node.value}
        node={node}
        treeScope={scope}
        onClick={handleClick}
        onChange={handleChange}
        expandOnClickNode={expandOnClickNode}
      />
    );
    return treeItem;
  };

  const cacheMap = new Map();

  const clearCacheNodes = () => {
    cacheMap.clear();
  };

  const nodes: Ref<TreeNode[]> = ref([]);
  const refresh = () => {
    // 渲染为平铺列表
    nodes.value = store.getNodes();
  };

  const renderTreeNodes = (h: CreateElement) => {
    const treeNodeViews = nodes.value.map((node: TreeNode) => {
      // 如果节点已经存在，则使用缓存节点
      let nodeView = cacheMap.get(node.value);
      // 如果节点未曾创建，则临时创建
      if (!nodeView && node.visible) {
        // 初次仅渲染可显示的节点
        // 不存在节点视图，则创建该节点视图并插入到当前位置
        nodeView = renderItem(h, node);
        cacheMap.set(node.value, nodeView);
      }
      return nodeView;
    });

    // 更新缓存后，被删除的节点要移除掉，避免内存泄露
    nextTick(() => {
      cacheMap.forEach((view: TypeVNode, value: string) => {
        if (!store.getNode(value)) {
          cacheMap.delete(value);
        }
      });
    });

    return treeNodeViews;
  };

  refresh();
  store.emitter.on('update', refresh);

  return {
    setExpanded,
    toggleExpanded,
    setActived,
    toggleActived,
    setChecked,
    toggleChecked,
    clearCacheNodes,
    renderTreeNodes,
  };
}
