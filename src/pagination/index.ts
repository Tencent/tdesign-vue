import PaginationBase from './pagination.vue';
import withInstall from '../utils/withInstall';
import mapProps from '../utils/map-props';
import { TdPaginationProps } from './type';

export * from './type';
export type PaginationProps = TdPaginationProps;

// 支持非受控属性 defaultCurrent 和 defaultSize
export const Pagination = withInstall('Pagination', mapProps(
  ['current', 'pageSize'],
  { model: { prop: 'current', event: 'current-change' } },
)(PaginationBase));
export default Pagination;
