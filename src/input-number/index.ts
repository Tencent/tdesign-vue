import _InputNumber from './input-number';
import setInstallFn from '../utils/setInstallFn';
import mapProps from '../utils/map-props';
import { TdInputNumberProps } from '../../types/input-number/TdInputNumberProps';

const InputNumber = mapProps(['value'])(_InputNumber);
setInstallFn('InputNumber', InputNumber);

export type InputNumberProps = TdInputNumberProps;
export * from '../../types/input-number/TdInputNumberProps';
export { InputNumber };
export default InputNumber;
