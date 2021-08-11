import { Ref } from '@vue/composition-api';
import { VNodeChildren } from 'vue';
import { MenuValue } from './type';

export interface TdMenuItem {
  value: MenuValue;
  label: VNodeChildren;
}
export interface TdMenuInterface {
  activeIndexValue: Ref<MenuValue>;
  expandedArray?: Ref<MenuValue[]>;
  mode: Ref<string>;
  theme?: Ref<string>;
  isHead: boolean;
  select: (val: MenuValue) => void;
  open?: (val: MenuValue) => boolean;
  selectSubMenu?: (items: TdMenuItem[]) => void;
}

export interface TdSubMenuInterface {
  hasIcon?: boolean;
  addMenuItem?: (item: TdMenuItem) => void;
}
