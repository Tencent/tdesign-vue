import _CheckboxGroup from './group';
import _Checkbox from './checkbox';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdCheckboxProps, TdCheckboxGroupProps } from './type';

import './style';

export type CheckboxProps = TdCheckboxProps;
export type CheckboxGroupProps = TdCheckboxGroupProps;
export * from './type';

export const Checkbox = withInstall(mapProps(['checked'], {
  model: { prop: 'checked', event: 'change' },
})(_Checkbox));

export const CheckboxGroup = withInstall(mapProps(['value'], {
  model: { prop: 'value', event: 'change' },
})(_CheckboxGroup));

export default Checkbox;
