import { CreateElement } from 'vue';
import {
  TdBaseTableProps,
  TableExpandedRowParams,
  TableRowData,
  TdPrimaryTableProps,
  TdEnhancedTableProps,
} from './type';

export interface BaseTableProps extends TdBaseTableProps {
  /**
   * 渲染展开行，非公开属性，请勿在业务中使用
   */
  renderExpandedRow: (h: CreateElement, params: TableExpandedRowParams<TableRowData>) => JSX.Element;
}

export type PrimaryTableProps = TdPrimaryTableProps;
export type EnhancedTableProps = TdEnhancedTableProps;
export type TableProps = PrimaryTableProps;
