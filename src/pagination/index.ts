import PaginationBase from './pagination';
import _PaginationMini from './pagination-mini';
import withInstall from '../utils/withInstall';
import mapProps from '../utils/map-props';
import { TdPaginationProps } from './type';

import './style';

export type PaginationProps = TdPaginationProps;
export * from './type';

// 支持非受控属性 defaultCurrent 和 defaultPageSize
export const Pagination = withInstall(
  mapProps(['current', 'pageSize'], { model: { prop: 'current', event: 'current-change' } })(PaginationBase),
);

export const PaginationMini = withInstall(_PaginationMini);

export default Pagination;
