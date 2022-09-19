import pick from 'lodash/pick';
import { TdTreeProps } from '../type';

export interface TypeTreeScope {
  checkProps?: TdTreeProps['checkProps'];
  disableCheck?: TdTreeProps['disableCheck'];
  empty?: TdTreeProps['empty'];
  icon?: TdTreeProps['icon'];
  label?: TdTreeProps['label'];
  line?: TdTreeProps['line'];
  operations?: TdTreeProps['operations'];
}

export interface TypeTreeCache {
  nodesMap: Map<string, any>;
  mouseEvent?: Event;
  scope: TypeTreeScope;
}

// 提供缓存对象
export default function useCache(props: TdTreeProps) {
  const cache: TypeTreeCache = {
    // 缓存渲染节点
    nodesMap: new Map(),
    // 缓存点击事件
    mouseEvent: null,
    // 缓存与节点共享的关联对象
    scope: {},
  };

  const updateTreeScope = () => {
    const { scope } = cache;
    const scopedProps = pick(props, ['checkProps', 'disableCheck', 'empty', 'icon', 'label', 'line', 'operations']);
    Object.assign(scope, scopedProps);
  };

  updateTreeScope();

  return {
    cache,
    updateTreeScope,
  };
}
