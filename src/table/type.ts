/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { PaginationProps, PageInfo } from '../pagination';
import { PopupProps } from '../popup';
import { CheckboxProps } from '../checkbox';
import { RadioProps } from '../radio';
import { InputProps } from '../input';
import { TNode, OptionData, SizeEnum, ClassName } from '../common';

export interface TdBaseTableProps<T extends TableRowData = TableRowData> {
  /**
   * 是否显示表格边框
   * @default false
   */
  bordered?: boolean;
  /**
   * 列配置，泛型 T 指表格数据类型
   * @default []
   */
  columns?: Array<BaseTableCol<T>>;
  /**
   * 数据源，泛型 T 指表格数据类型
   * @default []
   */
  data?: Array<T>;
  /**
   * 是否禁用本地数据排序。当 `data` 数据长度超过分页大小时，会自动进行本地数据排序。如果 `disabledDataSort` 设置为 true，则无论何时，都不会进行本地排序
   * @default false
   */
  disableDataSort?: boolean;
  /**
   * 空表格呈现样式
   * @default ''
   */
  empty?: string | TNode;
  /**
   * 首行内容
   */
  firstFullRow?: string | TNode;
  /**
   * 表格高度，超出后会出现滚动条。示例：100,  '30%',  '300px'。值为数字类型，会自动加上单位 px。如果不是绝对固定表格高度，建议使用 `maxHeight`
   * @default 'auto'
   */
  height?: string | number;
  /**
   * 是否显示鼠标悬浮状态
   * @default false
   */
  hover?: boolean;
  /**
   * 尾行内容
   */
  lastFullRow?: string | TNode;
  /**
   * 加载中状态。值为 true 会显示默认加载中样式，可以通过 Function 和 插槽 自定义加载状态呈现内容和样式
   * @default false
   */
  loading?: boolean | TNode;
  /**
   * 表格最大高度，超出后会出现滚动条。示例：100, '30%', '300px'。值为数字类型，会自动加上单位 px
   */
  maxHeight?: string | number;
  /**
   * 分页配置，值为空则不显示。具体 API 参考分页组件
   */
  pagination?: PaginationProps;
  /**
   * 行类名，泛型 T 指表格数据类型
   */
  rowClassName?: ClassName | ((params: { row: T; rowIndex: number }) => ClassName);
  /**
   * 使用 rowKey 唯一标识一行数据
   * @default ''
   */
  rowKey: string;
  /**
   * 用于自定义合并单元格，泛型 T 指表格数据类型
   */
  rowspanAndColspan?: (params: RowspanAndColspanParams<T>) => RowspanColspan;
  /**
   * 懒加载和虚拟滚动
   */
  scroll?: TableScroll;
  /**
   * 表格尺寸
   * @default medium
   */
  size?: SizeEnum;
  /**
   * 是否显示斑马纹
   * @default false
   */
  stripe?: boolean;
  /**
   * 表格布局方式
   * @default fixed
   */
  tableLayout?: 'auto' | 'fixed';
  /**
   * 表格顶部内容，可以用于自定义列设置等
   */
  topContent?: string | TNode;
  /**
   * 行内容上下方向对齐
   * @default middle
   */
  verticalAlign?: 'top' | 'middle' | 'bottom';
  /**
   * 单元格点击时触发
   */
  onCellClick?: (context: BaseTableCellEventContext<T>) => void;
  /**
   * 分页发生变化时触发。参数 newDataSource 表示分页后的数据。本地数据进行分页时，newDataSource 和源数据 data 会不一样。泛型 T 指表格数据类型
   */
  onPageChange?: (pageInfo: PageInfo, newDataSource: Array<T>) => void;
  /**
   * 行点击时触发，泛型 T 指表格数据类型
   */
  onRowClick?: (context: RowEventContext<T>) => void;
  /**
   * 行双击时触发，泛型 T 指表格数据类型
   */
  onRowDbClick?: (context: RowEventContext<T>) => void;
  /**
   * 鼠标悬浮到行时触发，泛型 T 指表格数据类型
   */
  onRowHover?: (context: RowEventContext<T>) => void;
  /**
   * 鼠标在表格行按下时触发，泛型 T 指表格数据类型
   */
  onRowMousedown?: (context: RowEventContext<T>) => void;
  /**
   * 鼠标在表格行进入时触发，泛型 T 指表格数据类型
   */
  onRowMouseenter?: (context: RowEventContext<T>) => void;
  /**
   * 鼠标在表格行离开时触发，泛型 T 指表格数据类型
   */
  onRowMouseleave?: (context: RowEventContext<T>) => void;
  /**
   * 鼠标在表格行按下又弹起时触发，泛型 T 指表格数据类型
   */
  onRowMouseup?: (context: RowEventContext<T>) => void;
  /**
   * 表格内容横向滚动时触发
   */
  onScrollX?: (params: { e: WheelEvent }) => void;
  /**
   * 表格内容纵向滚动时触发。当内容超出高度(height)或最大高度(max-height)时，会出现纵向滚动条
   */
  onScrollY?: (params: { e: WheelEvent }) => void;
}

export interface BaseTableCol<T extends TableRowData = TableRowData> {
  /**
   * 列横向对齐方式
   * @default left
   */
  align?: 'left' | 'right' | 'center';
  /**
   * 透传 HTML 属性到列元素
   */
  attrs?: object;
  /**
   * 自定义单元格渲染。值类型为 Function 表示以函数形式渲染单元格。值类型为 string 表示使用插槽渲染，插槽名称为 cell 的值。默认使用 colKey 作为插槽名称。优先级高于 render。泛型 T 指表格数据类型
   */
  cell?: string | TNode<BaseTableCellParams<T>>;
  /**
   * 用于多级表头，泛型 T 指表格数据类型
   */
  children?: Array<BaseTableCol<T>>;
  /**
   * 列类名，值类型是 Function 使用返回值作为列类名；值类型不为 Function 时，值用于整列类名（含表头）。泛型 T 指表格数据类型
   */
  className?: ClassName | ((context: CellData<T>) => ClassName);
  /**
   * 渲染列所需字段
   * @default ''
   */
  colKey?: string;
  /**
   * 内容超出时，是否显示省略号。值为 `true`，则浮层默认显示单元格内容；值类型为 `Function` 则显示自定义内容；值类型为 `Object`，则自动透传属性到 Popup 组件
   * @default false
   */
  ellipsis?: boolean | TNode<BaseTableCellParams<T>> | PopupProps;
  /**
   * 固定列显示位置
   * @default left
   */
  fixed?: 'left' | 'right';
  /**
   * 列最小宽度
   */
  minWidth?: string | number;
  /**
   * 自定义表头或单元格，泛型 T 指表格数据类型
   */
  render?: TNode<BaseTableRenderParams<T>>;
  /**
   * 自定义表头渲染。值类型为 Function 表示以函数形式渲染表头。值类型为 string 表示使用插槽渲染，插槽名称为 title 的值。优先级高于 render
   */
  title?: string | TNode<{ col: BaseTableCol; colIndex: number }>;
  /**
   * 列宽
   */
  width?: string | number;
}

export interface TdPrimaryTableProps<T extends TableRowData = TableRowData>
  extends Omit<TdBaseTableProps<T>, 'columns'> {
  /**
   * 异步加载状态。值为 `loading` 显示默认文字 “正在加载中，请稍后”，值为 `loading-more` 显示“点击加载更多”，值为其他，表示完全自定义异步加载区域内容
   */
  asyncLoading?: 'loading' | 'load-more' | TNode;
  /**
   * 【开发中】自定义显示列控制器，值为空不会显示。`columnController.fields` 表示只允许用户对数组里面的列进行显示或隐藏的控制，`columnController.displayType` 是指字段呈现方式：`fixed-width` 表示固定宽度，每行固定数量，横向和纵向均对齐；`auto-width` 表示宽度随列标题数量自由显示，横向铺满，纵向不要求对齐
   */
  columnController?: TableColumnController;
  /**
   * 列配置，泛型 T 指表格数据类型
   * @default []
   */
  columns?: Array<PrimaryTableCol<T>>;
  /**
   * 是否开始拖拽排序，会显示拖拽图标
   * @default false
   */
  dragSort?: boolean;
  /**
   * 展开行内容，泛型 T 指表格数据类型
   */
  expandedRow?: TNode<{ row: T; index: number }>;
  /**
   * 展开行
   * @default []
   */
  expandedRowKeys?: Array<string | number>;
  /**
   * 展开行，非受控属性
   * @default []
   */
  defaultExpandedRowKeys?: Array<string | number>;
  /**
   * 用于控制是否显示「展开图标列」，值为 false 则不会显示。可以精确到某一行是否显示，还可以自定义展开图标内容，示例：`(h, { index }) => index === 0 ? false : <icon class='custom-icon' />`。expandedRow 存在时，该参数有效
   * @default true
   */
  expandIcon?: TNode<ExpandArrowRenderParams<T>>;
  /**
   * 是否允许点击行展开
   */
  expandOnRowClick?: boolean;
  /**
   * 自定义过滤图标
   */
  filterIcon?: TNode;
  /**
   * 自定义过滤状态行及清空筛选等
   */
  filterRow?: string | TNode;
  /**
   * 过滤数据的值
   */
  filterValue?: FilterValue;
  /**
   * 过滤数据的值，非受控属性
   */
  defaultFilterValue?: FilterValue;
  /**
   * 是否支持多列排序
   * @default false
   */
  multipleSort?: boolean;
  /**
   * 选中的行，控制属性
   */
  selectedRowKeys?: Array<string | number>;
  /**
   * 选中的行，控制属性，非受控属性
   */
  defaultSelectedRowKeys?: Array<string | number>;
  /**
   * 【讨论中-待定】是否显示为通过拖拽图标进行排序
   * @default false
   */
  showDragCol?: boolean;
  /**
   * 排序控制。sortBy 排序字段；descending 是否进行降序排列。值为数组时，表示正进行多字段排序。当 `data` 数据长度超过分页大小时，会自动对本地数据 `data` 进行排序，如果不希望对于 `data` 进行排序，可以设置 `disableDatasort = true`
   */
  sort?: TableSort;
  /**
   * 排序控制。sortBy 排序字段；descending 是否进行降序排列。值为数组时，表示正进行多字段排序。当 `data` 数据长度超过分页大小时，会自动对本地数据 `data` 进行排序，如果不希望对于 `data` 进行排序，可以设置 `disableDatasort = true`，非受控属性
   */
  defaultSort?: TableSort;
  /**
   * 允许表格行拖拽时排序
   * @default false
   */
  sortOnRowDraggable?: boolean;
  /**
   * 异步加载区域被点击时触发
   */
  onAsyncLoadingClick?: (context: { status: 'loading' | 'load-more' }) => void;
  /**
   * 单元格点击时触发
   */
  onCellClick?: (context: PrimaryTableCellEventContext<T>) => void;
  /**
   * 分页、排序、过滤等内容变化时触发，泛型 T 指表格数据类型
   */
  onChange?: (data: TableChangeData, context: TableChangeContext<Array<T>>) => void;
  /**
   * 表格数据发生变化时触发，比如：本地排序方法 sorter
   */
  onDataChange?: (data: Array<T>) => void;
  /**
   * 拖拽排序时触发
   */
  onDragSort?: (context: DragSortContext<T>) => void;
  /**
   * 展开行发生变化时触发，泛型 T 指表格数据类型
   */
  onExpandChange?: (expandedRowKeys: Array<string | number>, options: ExpandOptions<T>) => void;
  /**
   * 过滤参数发生变化时触发，泛型 T 指表格数据类型
   */
  onFilterChange?: (filterValue: FilterValue, context: { col?: PrimaryTableCol<T> }) => void;
  /**
   * 选中行发生变化时触发，泛型 T 指表格数据类型。两个参数，第一个参数为选中行 keys，第二个参数为更多参数，具体如下：`type = uncheck` 表示当前行操作为「取消行选中」；`type = check` 表示当前行操作为「行选中」； `currentRowKey` 表示当前操作行的 rowKey 值； `currentRowData` 表示当前操作行的行数据
   */
  onSelectChange?: (selectedRowKeys: Array<string | number>, options: SelectOptions<T>) => void;
  /**
   * 排序发生变化时触发。其中 sortBy 表示当前排序的字段，sortType 表示排序的方式，currentDataSource 表示 sorter 排序后的结果，col 表示列配置。sort 值类型为数组时表示多字段排序
   */
  onSortChange?: (sort: TableSort, options: SortOptions<T>) => void;
}

export interface PrimaryTableCol<T extends TableRowData = TableRowData>
  extends Omit<BaseTableCol, 'cell' | 'title' | 'render'> {
  /**
   * 【开发中】是否允许用户选择是否显示当前列，表格属性 `showColumnController` 为真时有效
   * @default true
   */
  addToColumnController?: boolean;
  /**
   * 自定义单元格渲染。值类型为 Function 表示以函数形式渲染单元格。值类型为 string 表示使用插槽渲染，插槽名称为 cell 的值。默认使用 colKey 作为插槽名称。优先级高于 render。泛型 T 指表格数据类型
   */
  cell?: string | TNode<PrimaryTableCellParams<T>>;
  /**
   * 透传参数，colKey 值为 row-select 时，配置有效。具体定义参考 Checkbox 组件 和 Radio 组件。泛型 T 指表格数据类型
   */
  checkProps?: CheckProps<T>;
  /**
   * 是否禁用行选中，colKey 值为 row-select 时，配置有效
   */
  disabled?: (options: { row: T; rowIndex: number }) => boolean;
  /**
   * 过滤规则，支持多选(multiple)、单选(single)、输入框(input) 等三种形式。想要自定义过滤组件，可通过 `filter.component` 实现，自定义过滤组件需要包含参数 value 和事件 change
   */
  filter?: TableColumnFilter;
  /**
   * 自定义表头或单元格，泛型 T 指表格数据类型
   */
  render?: TNode<PrimaryTableRenderParams<T>>;
  /**
   * 该列是否支持排序。值为 true 表示该列支持排序；值类型为函数，表示对本地数据 `data` 进行排序。泛型 T 指表格数据类型
   * @default false
   */
  sorter?: boolean | SorterFun<T>;
  /**
   * 当前列支持排序的方式，desc 表示当前列只能进行降序排列；asc 表示当前列只能进行升序排列；all 表示当前列既可升序排列，又可以降序排列
   * @default all
   */
  sortType?: SortType;
  /**
   * 自定义表头渲染。值类型为 Function 表示以函数形式渲染表头。值类型为 string 表示使用插槽渲染，插槽名称为 title 的值。优先级高于 render
   */
  title?: string | TNode<{ col: PrimaryTableCol; colIndex: number }>;
  /**
   * 行选中有两种模式：单选和多选。`colKey` 值为 `row-select` 时，表示当前列选中项， `type=single/multiple` 有效
   * @default single
   */
  type?: 'single' | 'multiple';
}

export interface TdEnhancedTableProps<T extends TableRowData = TableRowData> {
  /**
   * 树形结构相关配置。`tree.indent` 表示树结点缩进距离，单位：px，默认为 24px。`tree.treeNodeColumnIndex` 表示树结点在第几列渲染，默认为 0 ，第一列。`tree.childrenKey` 表示树形结构子节点字段，默认为 children。`tree.checkStrictly` 表示树形结构的行选中（多选），父子行选中是否独立，默认独立，值为 true
   */
  tree?: TableTreeConfig;
}

/** 组件实例方法 */
export interface EnhancedTableInstanceFunctions<T extends TableRowData = TableRowData> {
  /**
   * 树形结构中，用于获取行数据所有信息。泛型 `T` 表示行数据类型
   */
  getData: (key: TableRowValue) => TableRowState<T>;
  /**
   * 树形结构中，移除指定节点
   */
  remove: (key: TableRowValue) => void;
  /**
   * 树形结构中，用于更新行数据。泛型 `T` 表示行数据类型
   */
  setData: (key: TableRowValue, newRowData: T) => void;
}

export interface TableRowState<T extends TableRowData = TableRowData> {
  /**
   * 表格行是否禁用选中
   * @default false
   */
  disabled?: boolean;
  /**
   * 当前节点展开的子节点数量
   */
  expandChildrenLength?: number;
  /**
   * 表格行是否展开
   * @default false
   */
  expanded: boolean;
  /**
   * 当前节点层级
   */
  level?: number;
  /**
   * 父节点
   */
  parent?: TableRowState<T>;
  /**
   * 当前节点路径
   */
  path?: TableRowState<T>[];
  /**
   * 原始表格行数据
   */
  row: T;
  /**
   * 表格行下标
   */
  rowIndex: number;
}

export interface TableColumnFilter {
  /**
   * 用于自定义筛选器，只要保证自定义筛选器包含 value 属性 和 change 事件，即可像内置筛选器一样正常使用
   */
  component?: TNode;
  /**
   * 用于配置当前筛选器可选值有哪些，仅当 `filter.type` 等于 `single` 或 `multiple` 时有效
   */
  list?: Array<OptionData>;
  /**
   * 用于透传筛选器属性，可以对筛选器进行任何原组件支持的属性配置
   */
  props?: FilterProps;
  /**
   * 重置时设置的值，示例：'' 或 []
   */
  resetValue?: any;
  /**
   * 是否显示重置和确认。值为真，过滤事件（filter-change）会在确定时触发；值为假，则数据变化时会立即触发过滤事件
   * @default false
   */
  showConfirmAndReset?: boolean;
  /**
   * 用于设置筛选器类型：单选按钮筛选器、复选框筛选器、输入框筛选器
   * @default ''
   */
  type?: FilterType;
}

export interface TableScroll {
  /**
   * 表示表格除可视区域外，额外渲染的行数，避免表格快速滚动过程中，新出现的内容来不及渲染从而出现空白
   * @default 20
   */
  bufferSize?: number;
  /**
   * 表示表格每行内容是否同一个固定高度，仅在 `scroll.type` 为 `virtual` 时有效，该属性设置为 `true` 时，可用于简化虚拟滚动内部计算逻辑，提升性能，此时则需要明确指定 `scroll.rowHeight` 属性的值
   * @default false
   */
  isFixedRowHeight?: boolean;
  /**
   * 表格的行高，不会给`<tr>`元素添加样式高度，仅作为滚动时的行高参考。`scroll.type` 为 `lazy` 时，`rowHeight` 用于给未渲染的行节点指定一个初始高度，该属性默认会设置为表格第一行的行高（滚动加载行数量 = 滚动距离 / rowHeight）；`scroll.type` 为 `virtual` 时，`rowHeight` 用于估算每行的大致高度，从而决定应该渲染哪些行，请尽量将该属性设置为表格每行平均高度，从而使得表格滚动过程更加平滑
   */
  rowHeight?: number;
  /**
   * 表格滚动加载类型，有两种：懒加载和虚拟滚动。值为 `lazy` ，表示表格滚动时会进行懒加载，非可视区域内的表格内容将不会默认渲染，直到该内容可见时，才会进行渲染，并且已渲染的内容滚动到不可见时，不会被销毁；<br />值为`virtual`时，表示表格会进行虚拟滚动，无论滚动条滚动到哪个位置，同一时刻，表格仅渲染该可视区域内的表格内容，当表格需要展示的数据量较大时，建议开启该特性
   */
  type: 'lazy' | 'virtual';
}

export interface RowspanColspan {
  colspan: number;
  rowspan: number;
}

export interface RowspanAndColspanParams<T> {
  row: T;
  col: BaseTableCol;
  rowIndex: number;
  colIndex: number;
}

export interface BaseTableCellEventContext<T> {
  row: T;
  col: BaseTableCol;
  rowIndex: number;
  colIndex: number;
  e: MouseEvent;
}

export interface RowEventContext<T> {
  row: T;
  index: number;
  e: MouseEvent;
}

export interface TableRowData {
  [key: string]: any;
  children?: TableRowData[];
}

export interface BaseTableCellParams<T> {
  row: T;
  rowIndex: number;
  col: BaseTableCol<T>;
  colIndex: number;
}

export interface CellData<T> extends BaseTableCellParams<T> {
  type: 'th' | 'td';
}

export interface BaseTableRenderParams<T> extends BaseTableCellParams<T> {
  type: RenderType;
}

export type RenderType = 'cell' | 'title';

export type DataType = TableRowData;

export interface TableColumnController {
  fields: string[];
  displayType: 'fixed-width' | 'auto-width';
}

export interface ExpandArrowRenderParams<T> {
  row: T;
  index: number;
}

export type FilterValue = { [key: string]: FilterItemValue };

export type FilterItemValue = string | number | undefined | Array<string | number>;

export type TableSort = SortInfo | Array<SortInfo>;

export interface SortInfo {
  sortBy: string;
  descending: boolean;
}

export interface PrimaryTableCellEventContext<T> {
  row: T;
  col: PrimaryTableCol;
  rowIndex: number;
  colIndex: number;
  e: MouseEvent;
}

export interface TableChangeData {
  sorter?: TableSort;
  filter?: FilterValue;
  pagination?: PaginationProps;
}

export interface TableChangeContext<T> {
  trigger: TableChangeTrigger;
  currentData?: T;
}

export type TableChangeTrigger = 'filter' | 'sorter' | 'pagination';

export interface DragSortContext<T> {
  currentIndex: number;
  current: T;
  targetIndex: number;
  target: T;
}

export interface ExpandOptions<T> {
  expandedRowData: Array<T>;
}

export interface SelectOptions<T> {
  selectedRowData: Array<T>;
  type: 'uncheck' | 'check';
  currentRowKey?: string;
  currentRowData?: T;
}

export interface SortOptions<T> {
  currentDataSource?: Array<T>;
  col: PrimaryTableCol;
}

export interface PrimaryTableCellParams<T> {
  row: T;
  rowIndex: number;
  col: PrimaryTableCol<T>;
  colIndex: number;
}

export type CheckProps<T> =
  | CheckboxProps
  | RadioProps
  | ((options: { row: T; rowIndex: number }) => CheckboxProps | RadioProps);

export interface PrimaryTableRenderParams<T> extends PrimaryTableCellParams<T> {
  type: RenderType;
}

export type SorterFun<T> = (a: T, b: T) => SortNumber;

export type SortNumber = 1 | -1 | 0;

export type SortType = 'desc' | 'asc' | 'all';

export interface TableTreeConfig {
  indent?: number;
  treeNodeColumnIndex?: number;
  childrenKey?: 'children';
  checkStrictly?: boolean;
}

export type TableRowValue = string | number;

export type FilterProps = RadioProps | CheckboxProps | InputProps | { [key: string]: any };

export type FilterType = 'input' | 'single' | 'multiple';
