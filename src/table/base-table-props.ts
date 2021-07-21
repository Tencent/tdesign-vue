/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * updated at 2021-07-17 18:09:07
 * */

import { TdBaseTableProps } from '../table/type';
import { PropType } from 'vue';

export default {
  /** 是否显示表格边框 */
  bordered: Boolean,
  /** 列配置 */
  columns: {
    type: Array as PropType<TdBaseTableProps['columns']>,
    default: (): TdBaseTableProps['columns'] => [],
  },
  /** 数据源 */
  data: {
    type: Array as PropType<TdBaseTableProps['data']>,
    default: (): TdBaseTableProps['data'] => [],
  },
  /** 空表格呈现样式 */
  empty: {
    type: [String, Function] as PropType<TdBaseTableProps['empty']>,
    default: '',
  },
  /** 展开行内容，可自定义 */
  expandedRow: {
    type: [String, Function] as PropType<TdBaseTableProps['expandedRow']>,
  },
  /** 表格高度，超出后会出现滚动条。示例：100,  '30%',  '300px'。值为数字类型，会自动加上单位 px */
  height: {
    type: [String, Number] as PropType<TdBaseTableProps['height']>,
    default: 'auto',
  },
  /** 是否显示鼠标悬浮状态 */
  hover: Boolean,
  /** 加载中状态。值为 true 会显示默认加载中样式，可以通过 Function 和 插槽 自定义加载状态呈现内容和样式 */
  loading: {
    type: [Boolean, Function] as PropType<TdBaseTableProps['loading']>,
    default: false,
  },
  /** 表格最大高度，超出后会出现滚动条。示例：100, '30%', '300px'。值为数字类型，会自动加上单位 px */
  maxHeight: {
    type: [String, Number] as PropType<TdBaseTableProps['maxHeight']>,
  },
  /** 分页配置，值为空则不显示。具体 API 参考分页组件 */
  pagination: {
    type: Object as PropType<TdBaseTableProps['pagination']>,
  },
  /** 数据源 */
  rowClassName: {
    type: [String, Function] as PropType<TdBaseTableProps['rowClassName']>,
  },
  /** 使用 rowKey 唯一标识一行数据 */
  rowKey: {
    type: String,
    default: '',
    required: true,
  },
  /** 用于自定义合并单元格 */
  rowspanAndColspan: {
    type: Function as PropType<TdBaseTableProps['rowspanAndColspan']>,
  },
  /** 表格尺寸 */
  size: {
    type: String as PropType<TdBaseTableProps['size']>,
    default: 'medium' as TdBaseTableProps['size'],
    validator(val: TdBaseTableProps['size']): boolean {
      return ['small', 'medium', 'large'].includes(val);
    },
  },
  /** 是否显示斑马纹 */
  stripe: Boolean,
  /** 表格布局方式 */
  tableLayout: {
    type: String as PropType<TdBaseTableProps['tableLayout']>,
    default: 'fixed' as TdBaseTableProps['tableLayout'],
    validator(val: TdBaseTableProps['tableLayout']): boolean {
      return ['auto', 'fixed'].includes(val);
    },
  },
  /** 行内容上下方向对齐 */
  verticalAlign: {
    type: String as PropType<TdBaseTableProps['verticalAlign']>,
    default: 'middle' as TdBaseTableProps['verticalAlign'],
    validator(val: TdBaseTableProps['verticalAlign']): boolean {
      return ['top', 'middle', 'bottom'].includes(val);
    },
  },
  /** 分页发生变化时触发。参数 newDataSource 表示分页后的数据。本地数据进行分页时，newDataSource 和源数据 data 会不一样 */
  onPageChange: Function as PropType<TdBaseTableProps['onPageChange']>,
  /** 行点击时触发 */
  onRowClick: Function as PropType<TdBaseTableProps['onRowClick']>,
  /** 行双击时触发 */
  onRowDbClick: Function as PropType<TdBaseTableProps['onRowDbClick']>,
  /** null */
  onRowHover: Function as PropType<TdBaseTableProps['onRowHover']>,
  /** null */
  onRowMousedown: Function as PropType<TdBaseTableProps['onRowMousedown']>,
  /** null */
  onRowMouseup: Function as PropType<TdBaseTableProps['onRowMouseup']>,
  /** 表格内容横向滚动时触发 */
  onScrollX: Function as PropType<TdBaseTableProps['onScrollX']>,
  /** 表格内容纵向滚动时触发。当内容超出高度(height)或最大高度(max-height)时，会出现纵向滚动条 */
  onScrollY: Function as PropType<TdBaseTableProps['onScrollY']>,
};
