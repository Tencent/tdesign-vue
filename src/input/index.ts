
import _Input from './input';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdInputProps } from './type';

export * from './type';
export type InputProps = TdInputProps;

export const Input = withInstall('Input', mapProps(['value'])(_Input));
export default Input;
