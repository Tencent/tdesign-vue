import _Group from './group';
import _Checkbox from './checkbox';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdCheckboxProps } from './type';

export type CheckboxProps = TdCheckboxProps;
export * from './type';

export const Checkbox = withInstall('Checkbox', mapProps(['checked'], {
  model: { prop: 'checked', event: 'change' },
})(_Checkbox));
export const CheckboxGroup = withInstall('CheckboxGroup', mapProps(['value'], {
  model: { prop: 'value', event: 'change' },
})(_Group));
export default Checkbox;
