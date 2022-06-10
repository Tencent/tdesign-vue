import VueCompositionAPI from '@vue/composition-api';
import _Select from './select';
import _Option from './option';
import _OptionGroup from './optionGroup';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdSelectProps, TdOptionProps, TdOptionGroupProps } from './type';

import './style';

export type SelectProps = TdSelectProps;
export type OptionProps = TdOptionProps;
export type OptionGroupProps = TdOptionGroupProps;
export * from './type';

export const Select = withInstall(
  mapProps(['value'], {
    model: { prop: 'value', event: 'change' },
  })(_Select),
  VueCompositionAPI,
);

export const Option = withInstall(_Option, VueCompositionAPI);

export const OptionGroup = withInstall(_OptionGroup, VueCompositionAPI);
