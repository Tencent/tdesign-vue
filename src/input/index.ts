
import _Input from './input';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdInputProps } from '../../types/input/TdInputProps';

export * from '../../types/input/TdInputProps';
export type InputProps = TdInputProps;

export const Input = withInstall('Input', mapProps(['value'])(_Input));
export default Input;
