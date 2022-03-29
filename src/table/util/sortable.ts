// 拖拽排序api

import Sortable, { SortableOptions } from 'sortablejs';
import { TargetDom } from '../interface';

export default function setSortableConfig(target: TargetDom, options: SortableOptions) {
  if (!target) {
    return;
  }
  return new Sortable(target as any, { ...options });
}
