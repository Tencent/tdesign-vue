import _Menu from './menu';
import _HeadMenu from './head-menu';
import _Submenu from './submenu';
import _MenuItem from './menu-item';
import _MenuGroup from './menu-group';
import withInstall from '../utils/withInstall';
import mapProps from '../utils/map-props';
import {
  TdMenuProps, TdHeadMenuProps, TdSubmenuProps, TdMenuItemProps,
} from './type';

import './style';

export * from './type';
export type MenuProps = TdMenuProps;
export type HeadMenuProps = TdHeadMenuProps;
export type SubmenuProps = TdSubmenuProps;
export type MenuItemProps = TdMenuItemProps;

export const Menu = withInstall(
  mapProps(
    [
      {
        name: 'value',
        event: ['change', 'update:value'],
      },
      {
        name: 'expanded',
        event: ['expand', 'update:expanded'],
      },
    ],
    {
      model: { prop: 'value', event: 'change' },
    },
  )(_Menu),
);

export const HeadMenu = withInstall(
  mapProps(
    [
      {
        name: 'value',
        event: ['change', 'update:value'],
      },
      {
        name: 'expanded',
        event: ['expand', 'update:expanded'],
      },
    ],
    {
      model: { prop: 'value', event: 'change' },
    },
  )(_HeadMenu),
);

export const Submenu = withInstall(_Submenu);
export const MenuItem = withInstall(_MenuItem);
export const MenuGroup = withInstall(_MenuGroup);
