import { TdBaseTableProps, TdPrimaryTableProps } from './type';

export interface BaseTableProps extends TdBaseTableProps {
  /**
   * 渲染展开行，非公开属性
   */
  renderExpandedRow: (params: Parameters<TdPrimaryTableProps['expandedRow']>[1]) => JSX.Element;
}
