import pick from 'lodash/pick';
import { SetupContext } from '@vue/composition-api';
import TreeStore from '../../_common/js/tree/tree-store';
import {
  TypeTreeProps, TypeValueMode, TypeEventState, TypeTreeNodeModel,
} from '../interface';

export default function useTreeStore(props: TypeTreeProps, context: SetupContext) {
  const {
    actived, value, valueMode, filter, keys,
  } = props;

  const store = new TreeStore({
    valueMode: valueMode as TypeValueMode,
    filter,
  });

  // 同步 Store 选项
  const updateStoreConfig = () => {
    // 统一更新选项，然后在 store 统一识别属性更新
    // 注意: keys 属性比较特殊，不应该在实例化之后再次变更
    const storeProps = pick(props, [
      'expandAll',
      'expandLevel',
      'expandMutex',
      'expandParent',
      'activable',
      'activeMultiple',
      'disabled',
      'checkable',
      'draggable',
      'checkStrictly',
      'load',
      'lazy',
      'valueMode',
      'filter',
    ]);
    store.setConfig(storeProps);
  };

  const updateExpanded = () => {
    const { expanded, expandParent } = props;
    if (!Array.isArray(expanded)) return;
    // 初始化展开状态
    // 校验是否自动展开父节点
    const expandedMap = new Map();
    expanded.forEach((val) => {
      expandedMap.set(val, true);
      if (expandParent) {
        const node = store.getNode(val);
        if (node) {
          node
            .getModel()
            .getParents()
            .forEach((tn: TypeTreeNodeModel) => {
              expandedMap.set(tn.value, true);
            });
        }
      }
    });
    const expandedArr = Array.from(expandedMap.keys());
    store.setExpanded(expandedArr);
  };

  const handleLoad = (info: TypeEventState) => {
    const { node } = info;
    const evtCtx = {
      node: node.getModel(),
    };
    const { value, expanded, actived } = props;
    if (value && value.length > 0) {
      store.replaceChecked(value);
    }
    if (expanded && expanded.length > 0) {
      store.replaceExpanded(expanded);
    }
    if (actived && actived.length > 0) {
      store.replaceActived(actived);
    }
    if (props?.onLoad) {
      props?.onLoad(evtCtx);
    }
    context.emit('load', evtCtx);
  };

  const rebuild = (list: TypeTreeProps['data']) => {
    const { value, actived } = props;
    store.reload(list || []);
    // 初始化选中状态
    if (Array.isArray(value)) {
      store.setChecked(value);
    }
    // 更新展开状态
    updateExpanded();
    // 初始化激活状态
    if (Array.isArray(actived)) {
      store.setActived(actived);
    }
    // 刷新节点状态
    store.refreshState();
  };

  // keys 属性比较特殊，不应该在实例化之后再次变更
  store.setConfig({
    keys,
  });
  updateStoreConfig();
  store.append(props.data || []);

  // 刷新节点，必须在配置选中之前执行
  // 这样选中态联动判断才能找到父节点
  store.refreshNodes();

  // 初始化选中状态
  if (Array.isArray(value)) {
    store.setChecked(value);
  }

  // 更新节点展开状态
  updateExpanded();

  // 初始化激活状态
  if (Array.isArray(actived)) {
    store.setActived(actived);
  }

  store.emitter.on('load', handleLoad);

  return {
    store,
    rebuild,
    updateStoreConfig,
    updateExpanded,
  };
}
