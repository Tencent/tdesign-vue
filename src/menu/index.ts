import _Menu from './menu.vue';
import _HeadMenu from './head-menu.vue';
import _Submenu from './submenu.vue';
import _MenuItem from './menu-item.vue';
import _MenuGroup from './menu-group.vue';
import withInstall from '../utils/withInstall';

// export * from '../../types/menu/TdMenuProps';

export const Menu = withInstall('Menu', _Menu);
export const HeadMenu = withInstall('HeadMenu', _HeadMenu);
export const Submenu = withInstall('Submenu', _Submenu);
export const MenuItem = withInstall('MenuItem', _MenuItem);
export const MenuGroup = withInstall('MenuGroup', _MenuGroup);
