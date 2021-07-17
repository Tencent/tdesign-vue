import _Divider from './divider';
import withInstall from '../utils/withInstall';
import { TdDividerProps } from './type';

export type DividerProps = TdDividerProps;
export * from './type';

export const Divider = withInstall('Divider', _Divider);
export default Divider;
