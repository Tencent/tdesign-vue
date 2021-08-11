/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * updated at 2021-07-17 18:09:07
 * */

import { PropType } from 'vue';
import { TdFormItemProps } from './type';

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
