import _Input from './input';
import mapProps from '../utils/map-props';
import setInstallFn from '../utils/setInstallFn';
import { TdInputProps } from '../../types/input/TdInputProps';

const Input = mapProps(['value'])(_Input);

setInstallFn('Input', Input);

export type InputProps = TdInputProps;
export * from '../../types/input/TdInputProps';
export { Input };
export default Input;
