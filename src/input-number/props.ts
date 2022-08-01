/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TdInputNumberProps } from './type';
import { PropType } from 'vue';

export default {
  /** 文本内容位置，居左/居中/居右 */
  align: {
    type: String as PropType<TdInputNumberProps['align']>,
    validator(val: TdInputNumberProps['align']): boolean {
      if (!val) return true;
      return ['left', 'center', 'right'].includes(val);
    },
  },
  /** 宽度随内容自适应 */
  autoWidth: Boolean,
  /** [小数位数](https://en.wiktionary.org/wiki/decimal_place) */
  decimalPlaces: {
    type: Number,
    default: undefined,
  },
  /** 禁用组件 */
  disabled: Boolean,
  /** 指定输入框展示值的格式 */
  format: {
    type: Function as PropType<TdInputNumberProps['format']>,
  },
  /** 透传 Input 输入框组件全部属性 */
  inputProps: {
    type: Object as PropType<TdInputNumberProps['inputProps']>,
  },
  /** 是否作为大数使用。JS 支持的最大数字位数是 16 位，超过 16 位的数字需作为字符串大数处理。此时，数据类型必须保持为字符串，否则会丢失数据 */
  largeNumber: Boolean,
  /** 最大值。如果是大数，请传入字符串 */
  max: {
    type: [String, Number] as PropType<TdInputNumberProps['max']>,
    default: Infinity,
  },
  /** 最小值。如果是大数，请传入字符串 */
  min: {
    type: [String, Number] as PropType<TdInputNumberProps['min']>,
    default: -Infinity,
  },
  /** 占位符 */
  placeholder: {
    type: String,
    default: undefined,
  },
  /** 只读状态 */
  readonly: Boolean,
  /** 组件尺寸 */
  size: {
    type: String as PropType<TdInputNumberProps['size']>,
    default: 'medium' as TdInputNumberProps['size'],
    validator(val: TdInputNumberProps['size']): boolean {
      if (!val) return true;
      return ['small', 'medium', 'large'].includes(val);
    },
  },
  /** 文本框状态 */
  status: {
    type: String as PropType<TdInputNumberProps['status']>,
    validator(val: TdInputNumberProps['status']): boolean {
      if (!val) return true;
      return ['success', 'warning', 'error'].includes(val);
    },
  },
  /** 数值改变步数，可以是小数。如果是大数，请保证数据类型为字符串 */
  step: {
    type: [String, Number] as PropType<TdInputNumberProps['step']>,
    default: 1,
  },
  /** 按钮布局 */
  theme: {
    type: String as PropType<TdInputNumberProps['theme']>,
    default: 'row' as TdInputNumberProps['theme'],
    validator(val: TdInputNumberProps['theme']): boolean {
      if (!val) return true;
      return ['column', 'row', 'normal'].includes(val);
    },
  },
  /** 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式 */
  tips: {
    type: [String, Function] as PropType<TdInputNumberProps['tips']>,
  },
  /** 值 */
  value: {
    type: [String, Number] as PropType<TdInputNumberProps['value']>,
    default: undefined,
  },
  /** 值，非受控属性 */
  defaultValue: {
    type: [String, Number] as PropType<TdInputNumberProps['defaultValue']>,
    default: undefined,
  },
  /** 失去焦点时触发 */
  onBlur: Function as PropType<TdInputNumberProps['onBlur']>,
  /** 值变化时触发 */
  onChange: Function as PropType<TdInputNumberProps['onChange']>,
  /** 回车键按下时触发 */
  onEnter: Function as PropType<TdInputNumberProps['onEnter']>,
  /** 获取焦点时触发 */
  onFocus: Function as PropType<TdInputNumberProps['onFocus']>,
  /** 键盘按下时触发 */
  onKeydown: Function as PropType<TdInputNumberProps['onKeydown']>,
  /** 按下字符键时触发（keydown -> keypress -> keyup） */
  onKeypress: Function as PropType<TdInputNumberProps['onKeypress']>,
  /** 释放键盘时触发 */
  onKeyup: Function as PropType<TdInputNumberProps['onKeyup']>,
  /** 最大值或最小值校验结束后触发，`exceed-maximum` 表示超出最大值，`below-minimum` 表示小于最小值 */
  onValidate: Function as PropType<TdInputNumberProps['onValidate']>,
};
