import Drawer from './drawer';
import setInstallFn from '../utils/setInstallFn';
import { TdDrawerProps } from '../../types/drawer/TdDrawerProps';

setInstallFn('Drawer', Drawer);

export type DrawerProps = TdDrawerProps;
export * from '../../types/drawer/TdDrawerProps';
export { Drawer };
export default Drawer;
