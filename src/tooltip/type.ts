/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * updated at 2021-07-17 18:09:07
 * */

import { PopupProps } from '../popup';

export interface TdTooltipProps extends PopupProps {
  /**
   * 用于设置显示几秒之后消失
   * @default 3000
   */
  duration?: number;
  /**
   * 是否显示小箭头
   * @default true
   */
  showArrow?: boolean;
  /**
   * 文字提示风格
   * @default default
   */
  theme?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
};
