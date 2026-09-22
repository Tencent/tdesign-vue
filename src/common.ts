/* eslint-disable max-classes-per-file */

/**
 * 组件类名
 */
export interface TNodeReturnValue {
  [key: string]: any;
}

export interface TScroll {
  /**
   * 用于虚拟滚动的行高
   */
  rowHeight?: number;
  /**
   * 用于虚拟滚动的可视区域高度，会根据 rowHeight 进行调整，无需特殊设置
   */
  bufferSize?: number;
  /**
   * 滚动加载类型，有两种：懒加载和虚拟滚动。<br />值为 `lazy` ，表示滚动时会进行懒加载，非可视区域内的内容将不会默认渲染，直到该内容可见时，才会进行渲染，并且已渲染的内容滚动到不可见时，不会被销毁；<br />值为`virtual`时，表示会进行虚拟滚动，无论滚动条滚动到哪个位置，同一时刻，仅渲染该可视区域内的内容，当需要展示的数据量较大时，建议开启该特性
   */
  type: 'lazy' | 'virtual';
  /**
   * 表示除横向可视区域外，额外渲染的列数，避免快速横向滚动过程中，新出现的列来不及渲染从而出现空白。仅在列虚拟滚动生效时使用
   * @default 5
   */
  colBufferSize?: number;
  /**
   * 启动横向（列）虚拟滚动的列数阈值。仅当 `scroll.type` 为 `virtual`、`table-layout` 为 `fixed` 且不存在多级表头时，
   * 列数超过该阈值才会开启列虚拟滚动，避免与多级表头 colspan 计算冲突
   * @default 30
   */
  colThreshold?: number;
}

/**
 * 组件尺寸
 */
export type Size = 'small' | 'medium' | 'large' | 'large' | 'medium' | 'small';
