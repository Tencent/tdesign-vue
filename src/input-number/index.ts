import _InputNumber from './input-number';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdInputNumberProps } from './type';

import './style';

export type InputNumberProps = TdInputNumberProps;
export * from './type';

export const InputNumber = withInstall(mapProps(['value'])(_InputNumber));
export default InputNumber;
