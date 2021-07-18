import _Select from './select';
import _Option from './option';
import _OptionGroup from './optionGroup';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdSelectProps, TdOptionProps, TdOptionGroupProps } from './type';

export type SelectProps = TdSelectProps;
export type OptionProps = TdOptionProps;
export type OptionGroupProps = TdOptionGroupProps;
export * from './type';

export const Select = withInstall('Select', mapProps(['value'], {
  model: { prop: 'value', event: 'change' },
})(_Select));
export const Option = withInstall('Option', _Option);
export const OptionGroup = withInstall('OptionGroup', _OptionGroup);
