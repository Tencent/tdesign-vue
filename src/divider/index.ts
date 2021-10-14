import _Divider from './divider';
import withInstall from '../utils/withInstall';
import { TdDividerProps } from './type';

import './style';

export type DividerProps = TdDividerProps;
export * from './type';

export const Divider = withInstall(_Divider);
export default Divider;
