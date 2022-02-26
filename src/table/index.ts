import _BaseTable from './base-table';
import _PrimaryTable from './primary-table';
import _EnhancedTable from './enhanced-table/index';
// import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

import './style';

// const TPrimaryTable = mapProps([
//   {
//     name: 'expandedRowKeys',
//     event: ['expand-change', 'update:expandedRowKeys'],
//   },
//   {
//     name: 'selectedRowKeys',
//     event: ['select-change', 'update:selectedRowKeys'],
//   },
//   {
//     name: 'sort',
//     event: ['sort-change', 'update:sort'],
//   },
//   {
//     name: 'filterValue',
//     event: ['filter-change', 'update:filterValue'],
//   },
// ])(_PrimaryTable);

export * from './type';
export * from './interface';

export const BaseTable = withInstall(_BaseTable);
export const PrimaryTable = withInstall(_PrimaryTable);
export const EnhancedTable = withInstall(_EnhancedTable);
export const Table = withInstall(_PrimaryTable);

export default Table;
