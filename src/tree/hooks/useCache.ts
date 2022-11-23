import { TypeTreeProps, TypeTreeCache } from '../interface';

// 提供缓存对象
export default function useCache(props: TypeTreeProps) {
  const cache: TypeTreeCache = {
    // 缓存点击事件
    mouseEvent: null,
    // 缓存与节点共享的关联对象
    scope: {
      treeProps: props,
      scopedSlots: {},
    },
  };

  return {
    cache,
  };
}
