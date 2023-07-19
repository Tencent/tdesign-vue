import _CheckboxGroup from './group';
import _Checkbox from './checkbox';
import withInstall from '../utils/withInstall';
import { TdCheckboxProps, TdCheckboxGroupProps } from './type';

import './style';

export type CheckboxProps = TdCheckboxProps;
export type CheckboxGroupProps = TdCheckboxGroupProps;
export * from './type';

export const Checkbox = withInstall(_Checkbox);

export const CheckboxGroup = withInstall(_CheckboxGroup);

export default Checkbox;
