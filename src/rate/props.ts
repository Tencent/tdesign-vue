/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * updated at 2021-11-19 10:44:26
 * */

import { TdRateProps } from './type';
import { PropType } from 'vue';

export default {
  /** 是否允许半选 */
  allowHalf: Boolean,
  /** 评分图标的颜色，样式中默认为 #ED7B2F。一个值表示设置选中高亮的五角星颜色，两个值表示分别设置 选中高亮的五角星颜色 和 未选中暗灰的五角星颜色。示例：['#ED7B2F', '#999999'] */
  color: {
    type: [String, Array] as PropType<TdRateProps['color']>,
    required: false,
  },
  index: {
    type: Number,
    default: 0,
  },
  /** 评分的数量 */
  count: {
    type: Number,
    default: 5,
  },
  /** 是否禁用评分 */
  disabled: Boolean,
  /** 是否是只读评分 */
  readonly: Boolean,
  /** 评分图标的间距 */
  gap: {
    type: Number,
    default: 6,
  },
  /** 是否显示对应的辅助文字 */
  showText: Boolean,
  /** 评分图标的大小，示例：`20` */
  size: {
    type: Number,
    default: 16,
  },
  /** 自定义评分等级对应的辅助文字。组件内置默认值为：['极差', '失望', '一般', '满意', '惊喜']。自定义值示例：['1分', '2分', '3分', '4分', '5分'] */
  texts: {
    type: Array as PropType<TdRateProps['texts']>,
  },
  /** 选择评分的值 */
  value: {
    type: Number,
    default: 0,
    required: true,
  },
  /** 选择评分的值，非受控属性 */
  defaultValue: {
    type: Number,
    default: 0,
    required: false,
  },
  /** 参与评分的人数 */
  personCount: {
    type: Number,
    default: 0,
    required: false,
  },
  /** 评分分数 */
  score: {
    type: Number,
    default: 8.88,
    required: false,
  },
  /** 形状类型，有描边类型和填充类型两种 */
  variant: {
    type: String as PropType<TdRateProps['variant']>,
    default: 'outline' as TdRateProps['variant'],
    validator(val: TdRateProps['variant']): boolean {
      return ['outline', 'filled'].includes(val);
    },
  },
  /** 评分数改变时触发 */
  onChange: Function as PropType<TdRateProps['onChange']>,
};
