import VueCompositionAPI from '@vue/composition-api';

import _BaseTable from './base-table';
import _PrimaryTable from './primary-table';
import _EnhancedTable from './enhanced-table';
import withInstall from '../utils/withInstall';

import './style';

export * from './type';
export * from './interface';

export const BaseTable = withInstall(_BaseTable, VueCompositionAPI);
export const PrimaryTable = withInstall(_PrimaryTable, VueCompositionAPI);
export const EnhancedTable = withInstall(_EnhancedTable, VueCompositionAPI);
export const Table = withInstall({ ..._PrimaryTable, name: 'TTable' }, VueCompositionAPI);

export default Table;
