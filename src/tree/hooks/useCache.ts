import pick from 'lodash/pick';
import { TypeTreeProps, TypeTreeCache } from '../interface';

// 提供缓存对象
export default function useCache(props: TypeTreeProps) {
  const cache: TypeTreeCache = {
    // 缓存渲染节点
    nodesMap: new Map(),
    // 缓存点击事件
    mouseEvent: null,
    // 缓存与节点共享的关联对象
    scope: {},
    // 缓存 slots 对象
    scopedSlots: {},
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
