import _Addon from './addon';
import _Input from './input';
import _InputGroup from './input-group.vue';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdInputProps } from './type';

import './style';

export * from './type';
export type InputProps = TdInputProps;

export const Addon = withInstall('Addon', _Addon);
export const Input = withInstall('Input', mapProps(['value'])(_Input));
export const InputGroup = withInstall('InputGroup', _InputGroup);

export default Input;
