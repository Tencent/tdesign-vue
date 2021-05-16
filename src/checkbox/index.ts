import _Checkbox from './checkbox';
import _Group from './group';
import mapProps from '../utils/map-props';
import setInstallFn from '../utils/setInstallFn';
import { TdCheckboxProps } from '../../types/checkbox/TdCheckboxProps';

const Checkbox = mapProps(['checked'], { model: { prop: 'checked', event: 'change' } })(_Checkbox);
const CheckboxGroup = mapProps(['value'], { model: { prop: 'value', event: 'change' } })(_Group);

setInstallFn('Checkbox', Checkbox);
setInstallFn('CheckboxGroup', CheckboxGroup);

export type CheckboxProps = TdCheckboxProps;
export * from '../../types/checkbox/TdCheckboxProps';
export { Checkbox, CheckboxGroup };
export default Checkbox;
