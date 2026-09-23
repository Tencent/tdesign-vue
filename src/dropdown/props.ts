/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TdDropdownProps } from '../dropdown/type';
import { PropType } from 'vue';

export default {
  /** 多层级操作时，是否需要点击菜单项来展开下一层级菜单。默认为 true，表示点击菜单项展开下一层级菜单；设置为 false 表示 hover 菜单项展开下一层级菜单 */
  direction: {
    type: String as PropType<TdDropdownProps['direction']>,
    validator(val: TdDropdownProps['direction']): boolean {
      if (!val) return true;
      return ['left', 'right'].includes(val);
    },
  },
  /** 是否禁用组件 */
  disabled: Boolean,
  /** 点击菜单项后是否隐藏下拉菜单 */
  hideAfterItemClick: {
    type: Boolean,
    default: true,
  },
  /** 弹窗的最大高度，单位：px */
  maxColumnWidth: {
    type: [String, Number] as PropType<TdDropdownProps['maxColumnWidth']>,
    default: 100,
  },
  /** 弹窗的最大高度，单位：px */
  maxHeight: {
    type: [String, Number] as PropType<TdDropdownProps['maxHeight']>,
    default: 300,
  },
  /** 弹窗的最小宽度，单位：px */
  minColumnWidth: {
    type: [String, Number] as PropType<TdDropdownProps['minColumnWidth']>,
    default: 10,
  },
  /** 下拉操作项 */
  options: {
    type: Array as PropType<TdDropdownProps['options']>,
    default: () => [] as TdDropdownProps['options'],
  },
  /** 面板内的底部内容 */
  panelBottomContent: {
    type: [String, Function] as PropType<TdDropdownProps['panelBottomContent']>,
  },
  /** 面板内的顶部内容 */
  panelTopContent: {
    type: [String, Function] as PropType<TdDropdownProps['panelTopContent']>,
  },
  /** 触发下拉的呈现方式 */
  trigger: {
    type: String as PropType<TdDropdownProps['trigger']>,
    default: 'hover' as TdDropdownProps['trigger'],
    validator(val: TdDropdownProps['trigger']): boolean {
      if (!val) return true;
      return ['hover', 'click', 'focus'].includes(val);
    },
  },
  /** 下拉操作项点击时触发 */
  onClick: Function as PropType<TdDropdownProps['onClick']>,
  /** 鼠标悬浮下拉操作项时触发 */
  onHover: Function as PropType<TdDropdownProps['onHover']>,
};
