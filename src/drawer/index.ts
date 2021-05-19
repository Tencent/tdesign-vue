import _Drawer from './drawer';
import withInstall from '../utils/withInstall';
import { TdDrawerProps } from '../../types/drawer/TdDrawerProps';

export * from '../../types/drawer/TdDrawerProps';
export type DrawerProps = TdDrawerProps;

export const Drawer = withInstall('Drawer', _Drawer);
export default Drawer;
