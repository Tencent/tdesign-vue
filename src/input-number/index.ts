import _InputNumber from './input-number';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdInputNumberProps } from '../../types/input-number/TdInputNumberProps';

export type InputNumberProps = TdInputNumberProps;
export * from '../../types/input-number/TdInputNumberProps';

export const InputNumber = withInstall('InputNumber', mapProps(['value'])(_InputNumber));
export default InputNumber;
