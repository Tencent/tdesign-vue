import { Ref } from '@vue/composition-api';
import { MenuValue } from './type';
import VMenu from './v-menu';

export type TdOpenType = 'add' | 'remove';
export interface TdMenuInterface {
  activeValue: Ref<MenuValue>;
  activeValues: Ref<MenuValue[]>;
  expandValues?: Ref<MenuValue[]>;
  mode: Ref<string>;
  theme?: Ref<string>;
  isHead: boolean;
  vMenu?: VMenu;
  select: (val: MenuValue) => void;
  open?: (val: MenuValue, type?: TdOpenType) => boolean | void;
}

export interface TdSubMenuInterface {
  value: MenuValue;
  hasIcon?: boolean;
}
