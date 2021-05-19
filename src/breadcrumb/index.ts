import _Breadcrumb from './breadcrumb';
import withInstall from '../utils/withInstall';
import { TdBreadcrumbProps, TdBreadcrumbItemProps } from '../../types/breadcrumb/TdBreadcrumbProps';

export * from '../../types/breadcrumb/TdBreadcrumbProps';
export type BreadcrumbProps = TdBreadcrumbProps;
export type BreadcrumbItemProps = TdBreadcrumbItemProps;

export const Breadcrumb = withInstall('Breadcrumb', _Breadcrumb);
export default Breadcrumb;
