/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { InputProps } from '../input';
import { TNode } from '../common';

export interface TdInputNumberProps {
  /**
   * 文本内容位置，居左/居中/居右
   */
  align?: 'left' | 'center' | 'right';
  /**
   * 宽度随内容自适应
   * @default false
   */
  autoWidth?: boolean;
  /**
   * [小数位数](https://en.wiktionary.org/wiki/decimal_place)
   */
  decimalPlaces?: number;
  /**
   * 禁用组件
   * @default false
   */
  disabled?: boolean;
  /**
   * 指定输入框展示值的格式。如果组件包含参数 `decimalPlaces`，参数会包含小数位数格式化之后的数据 `context.fixedNumber`
   */
  format?: (value: InputNumberValue, context?: { fixedNumber?: InputNumberValue }) => InputNumberValue;
  /**
   * 透传 Input 输入框组件全部属性
   */
  inputProps?: InputProps;
  /**
   * 是否作为大数使用。JS 支持的最大数字位数是 16 位，超过 16 位的数字需作为字符串大数处理。此时，数据类型必须保持为字符串，否则会丢失数据
   * @default false
   */
  largeNumber?: boolean;
  /**
   * 最大值。如果是大数，请传入字符串
   * @default Infinity
   */
  max?: InputNumberValue;
  /**
   * 最小值。如果是大数，请传入字符串
   * @default -Infinity
   */
  min?: InputNumberValue;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 只读状态
   * @default false
   */
  readonly?: boolean;
  /**
   * 组件尺寸
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 文本框状态
   */
  status?: 'success' | 'warning' | 'error';
  /**
   * 数值改变步数，可以是小数。如果是大数，请保证数据类型为字符串
   * @default 1
   */
  step?: InputNumberValue;
  /**
   * 按钮布局
   * @default row
   */
  theme?: 'column' | 'row' | 'normal';
  /**
   * 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式
   */
  tips?: string | TNode;
  /**
   * 值
   */
  value?: InputNumberValue;
  /**
   * 值，非受控属性
   */
  defaultValue?: InputNumberValue;
  /**
   * 失去焦点时触发
   */
  onBlur?: (value: InputNumberValue, context: { e: FocusEvent }) => void;
  /**
   * 值变化时触发
   */
  onChange?: (value: InputNumberValue, context: ChangeContext) => void;
  /**
   * 回车键按下时触发
   */
  onEnter?: (value: InputNumberValue, context: { e: KeyboardEvent }) => void;
  /**
   * 获取焦点时触发
   */
  onFocus?: (value: InputNumberValue, context: { e: FocusEvent }) => void;
  /**
   * 键盘按下时触发
   */
  onKeydown?: (value: InputNumberValue, context: { e: KeyboardEvent }) => void;
  /**
   * 按下字符键时触发（keydown -> keypress -> keyup）
   */
  onKeypress?: (value: InputNumberValue, context: { e: KeyboardEvent }) => void;
  /**
   * 释放键盘时触发
   */
  onKeyup?: (value: InputNumberValue, context: { e: KeyboardEvent }) => void;
  /**
   * 最大值或最小值校验结束后触发，`exceed-maximum` 表示超出最大值，`below-minimum` 表示小于最小值
   */
  onValidate?: (context: { error?: 'exceed-maximum' | 'below-minimum' }) => void;
}

export type InputNumberValue = number | string;

export interface ChangeContext {
  type: ChangeSource;
  e: InputEvent | MouseEvent | FocusEvent | KeyboardEvent;
}

export type ChangeSource = 'add' | 'reduce' | 'input' | 'blur' | 'enter' | '';
