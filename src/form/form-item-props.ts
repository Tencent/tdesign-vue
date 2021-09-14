/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * updated at 2021-09-11 21:51:53
 * */

import { TdFormItemProps } from '../form/type';
import { PropType } from 'vue';

export default {
  /** label 原生属性 */
  for: {
    type: String,
    default: '',
  },
  /** 表单项说明内容 */
  help: {
    type: String,
    default: '',
  },
  /** 字段标签名称 */
  label: {
    type: [String, Function] as PropType<TdFormItemProps['label']>,
    default: '',
  },
  /** 表单字段标签对齐方式：左对齐、右对齐、顶部对齐。默认使用 Form 的对齐方式，优先级高于 Form.labelAlign */
  labelAlign: {
    type: String as PropType<TdFormItemProps['labelAlign']>,
    validator(val: TdFormItemProps['labelAlign']): boolean {
      return ['left', 'right', 'top'].includes(val);
    },
  },
  /** 表单字段名称 */
  name: {
    type: String,
    default: '',
  },
  /** 表单字段校验规则 */
  rules: {
    type: Array as PropType<TdFormItemProps['rules']>,
    default: (): TdFormItemProps['rules'] => [],
  },
  /** 校验状态图标。优先级高级 Form 的 statusIcon */
  statusIcon: {
    type: [Boolean, Function] as PropType<TdFormItemProps['statusIcon']>,
    default: undefined,
  },
};
