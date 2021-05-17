import PaginationBase from './pagination.vue';
import setInstallFn from '../utils/setInstallFn';
import mapProps from '../utils/map-props';
import { TdPaginationProps } from '../../types/pagination/TdPaginationProps';

// 支持非受控属性 defaultCurrent 和 defaultSize
const Pagination = mapProps(
  ['current', 'pageSize'],
  { model: { prop: 'current', event: 'current-change' } },
)(PaginationBase);

setInstallFn('Pagination', Pagination);

export type PaginationProps = TdPaginationProps;

export * from '../../types/pagination/TdPaginationProps';
export { Pagination };
export default Pagination;
