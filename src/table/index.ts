import _BaseTable from './base-table/index';
import _PrimaryTable from './primary-table/index';
import _EnhancedTable from './enhanced-table/index';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdBaseTableProps, TdPrimaryTableProps } from './type';

import './style';

const TPrimaryTable = mapProps([
  {
    name: 'expandedRowKeys',
    event: ['expand-change', 'update:expandedRowKeys'],
  },
  {
    name: 'selectedRowKeys',
    event: ['select-change', 'update:selectedRowKeys'],
  },
  {
    name: 'sort',
    event: ['sort-change', 'update:sort'],
  },
  {
    name: 'filterValue',
    event: ['filter-change', 'update:filterValue'],
  },
])(_PrimaryTable);

export type BaseTableProps = TdBaseTableProps;
export type PrimaryTableProps = TdPrimaryTableProps;
export * from './type';

export const BaseTable = withInstall(_BaseTable);
export const PrimaryTable = withInstall(TPrimaryTable);
export const EnhancedTable = withInstall(_EnhancedTable);
export const Table = withInstall(TPrimaryTable);

export default Table;
