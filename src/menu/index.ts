import VueCompositionAPI from '@vue/composition-api';

import _Menu from './menu';
import _HeadMenu from './head-menu';
import _Submenu from './submenu';
import _MenuItem from './menu-item';
import _MenuGroup from './menu-group';
import withInstall from '../utils/withInstall';
import { TdMenuProps, TdHeadMenuProps, TdSubmenuProps, TdMenuItemProps } from './type';

export * from './type';
export type MenuProps = TdMenuProps;
export type HeadMenuProps = TdHeadMenuProps;
export type SubmenuProps = TdSubmenuProps;
export type MenuItemProps = TdMenuItemProps;

export const Menu = withInstall('Menu', _Menu, VueCompositionAPI);
export const HeadMenu = withInstall('HeadMenu', _HeadMenu, VueCompositionAPI);
export const Submenu = withInstall('Submenu', _Submenu, VueCompositionAPI);
export const MenuItem = withInstall('MenuItem', _MenuItem, VueCompositionAPI);
export const MenuGroup = withInstall('MenuGroup', _MenuGroup, VueCompositionAPI);
