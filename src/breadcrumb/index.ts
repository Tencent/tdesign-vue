import Breadcrumb from './breadcrumb';
import setInstallFn from '../utils/setInstallFn';
import { TdBreadcrumbProps, TdBreadcrumbItemProps } from '../../types/breadcrumb/TdBreadcrumbProps';

setInstallFn('Breadcrumb', Breadcrumb);

export type BreadcrumbItemProps = TdBreadcrumbItemProps;
export type BreadcrumbProps = TdBreadcrumbProps;
export * from '../../types/breadcrumb/TdBreadcrumbProps';
export { Breadcrumb };
export default Breadcrumb;
