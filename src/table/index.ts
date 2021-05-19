import _PrimaryTable from './PrimaryTable/index';
import _BaseTable from './BaseTable/index';
import withInstall from '../utils/withInstall';

export const PrimaryTable = withInstall('PrimaryTable', _PrimaryTable);
export const BaseTable = withInstall('BaseTable', _BaseTable);
export const Table = withInstall('Table', _PrimaryTable);
export default PrimaryTable;
