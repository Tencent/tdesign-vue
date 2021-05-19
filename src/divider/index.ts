import _Divider from './divider';
import withInstall from '../utils/withInstall';
import { TdDividerProps } from '../../types/divider/TdDividerProps';

export type DividerProps = TdDividerProps;
export * from '../../types/divider/TdDividerProps';

export const Divider = withInstall('Divider', _Divider);
export default Divider;
