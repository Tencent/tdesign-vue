/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * updated at 2021-07-17 18:09:07
 * */

import { PropType } from 'vue';
import { TdDividerProps } from './type';

export default {
  /** 文本位置（仅在水平分割线有效） */
  align: {
    type: String as PropType<TdDividerProps['align']>,
    default: 'center' as TdDividerProps['align'],
    validator(val: TdDividerProps['align']): boolean {
      return ['left', 'right', 'center'].includes(val);
    },
  },
  /** 是否虚线（仅在水平分割线有效） */
  dashed: Boolean,
  /** 分隔线类型有两种：水平和垂直 */
  theme: {
    type: String as PropType<TdDividerProps['theme']>,
    default: 'horizontal' as TdDividerProps['theme'],
    validator(val: TdDividerProps['theme']): boolean {
      return ['horizontal', 'vertical'].includes(val);
    },
  },
};
