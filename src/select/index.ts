import mapProps from '../utils/map-props';
import _Select from './select';
import OptionGroup from './optionGroup';
import Option from './option';
import setInstallFn from '../utils/setInstallFn';
import { TdSelectProps, TdOptionProps, TdOptionGroupProps } from '../../types/select/TdSelectProps';

const Select = mapProps(['value'], { model: { prop: 'value', event: 'change' } })(_Select);

setInstallFn('Select', Select);
setInstallFn('Option', Option);
setInstallFn('OptionGroup', OptionGroup);

export type SelectProps = TdSelectProps;
export type OptionProps = TdOptionProps;
export type OptionGroupProps = TdOptionGroupProps;


export { Select, OptionGroup, Option };
