/* eslint-disable */
/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

export interface TdDropdownProps {
  /**
   * 多层级操作时，是否需要点击菜单项来展开下一层级菜单。默认为 true，表示点击菜单项展开下一层级菜单；设置为 false 表示 hover 菜单项展开下一层级菜单
   * @default true
   */
  direction?: 'left' | 'right';
  /**
   * 是否禁用组件
   * @default false
   */
  disabled?: boolean;
  /**
   * 点击菜单项后是否隐藏下拉菜单
   * @default true
   */
  hideAfterItemClick?: boolean;
  /**
   * 弹窗的最大高度，单位：px
   * @default 300
   */
  maxColumnWidth?: string | number;
  /**
   * 弹窗的最大高度，单位：px
   * @default 300
   */
  maxHeight?: string | number;
  /**
   * 弹窗的最小宽度，单位：px
   * @default 10
   */
  minColumnWidth?: string | number;
  /**
   * 下拉操作项
   */
  options: Array<DropdownOption>;
  /**
   * 面板内的底部内容
   */
  panelBottomContent?: string | TNode;
  /**
   * 面板内的顶部内容
   */
  panelTopContent?: string | TNode;
  /**
   * 触发下拉的呈现方式
   * @default hover
   */
  trigger?: 'hover' | 'click' | 'focus';
  /**
   * 下拉操作项点击时触发
   */
  onClick?: (dropdownItem: DropdownOption, context: { e: MouseEvent }) => void;
  /**
   * 鼠标悬浮下拉操作项时触发
   */
  onHover?: (dropdownItem: DropdownOption, context: { e: MouseEvent }) => void;
}

export interface TdDropdownItemProps {
  /**
   * 是否高亮当前操作项
   * @default false
   */
  active?: boolean;
  /**
   * 下拉操作项内容
   * @default ''
   */
  content?: string | TNode;
  /**
   * 是否禁用操作项
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否显示操作项之间的分隔线（分隔线默认在下方）
   * @default false
   */
  divider?: boolean;
  /**
   * 组件前置图标
   */
  prefixIcon?: TNode;
  /**
   * 下拉菜单选项主题
   * @default default
   */
  theme?: DropdownItemTheme;
  /**
   * 下拉操作项唯一标识
   */
  value?: string | number | { [key: string]: any };
  /**
   * 点击时触发
   */
  onClick?: (dropdownItem: DropdownOption, context: { e: MouseEvent }) => void;
  /**
   * 鼠标悬浮时触发
   */
  onHover?: (dropdownItem: DropdownOption, context: { e: MouseEvent }) => void;
}

export type DropdownOption = { [key: string]: any } | DropdownOptionItem;

export type DropdownItemTheme = 'default' | 'success' | 'warning' | 'error';

export interface DropdownOptionItem {
  /**
   * 是否高亮当前操作项
   * @default false
   */
  active?: boolean;
  /**
   * 下拉操作项内容
   */
  content?: string | TNode;
  /**
   * 是否禁用操作项
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否显示操作项之间的分隔线（分隔线默认在下方）
   * @default false
   */
  divider?: boolean;
  /**
   * 下拉操作项唯一标识
   */
  value?: string | number | { [key: string]: any };
  /**
   * 点击时触发
   */
  onClick?: (dropdownItem: DropdownOption, context: { e: MouseEvent }) => void;
  /**
   * 鼠标悬浮时触发
   */
  onHover?: (dropdownItem: DropdownOption, context: { e: MouseEvent }) => void;
}
