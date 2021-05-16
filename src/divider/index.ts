import Divider from './divider';
import setInstallFn from '../utils/setInstallFn';
import { TdDividerProps } from '../../types/divider/TdDividerProps';

setInstallFn('Divider', Divider);

export type DividerProps = TdDividerProps;
export * from '../../types/divider/TdDividerProps';
export default Divider;
export {
  Divider,
};
