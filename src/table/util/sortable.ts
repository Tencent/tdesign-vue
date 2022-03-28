// 拖拽排序api

import Sortable, { SortableOptions } from 'sortablejs';

type TargetDom = HTMLElement | Element | null;

export default function setSortableConfig(target: TargetDom, options: SortableOptions) {
  if (!target) {
    return;
  }
  return new Sortable(target as any, { ...options });
}
