/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * updated at 2021-07-17 18:09:07
 * */

import { TdTooltipProps } from './type';
import { PropType } from 'vue';

export default {
  /** 用于设置显示几秒之后消失 */
  duration: {
    type: Number,
    default: 3000,
  },
  /** 是否显示小箭头 */
  showArrow: {
    type: Boolean,
    default: true,
  },
  /** 文字提示风格 */
  theme: {
    type: String as PropType<TdTooltipProps['theme']>,
    default: 'default' as TdTooltipProps['theme'],
    validator(val: TdTooltipProps['theme']): boolean {
      return ['default', 'primary', 'success', 'danger', 'warning'].includes(val);
    },
  },
};
