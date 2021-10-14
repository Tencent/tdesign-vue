import _Radio from './radio';
import _RadioGroup from './group';
import _RadioButton from './radio-button';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdRadioProps, TdRadioGroupProps } from './type';

import './style';

export type RadioProps = TdRadioProps;
export type RadioGroupProps = TdRadioGroupProps;
export * from './type';

export const Radio = withInstall(mapProps(['checked'], {
  model: { prop: 'checked', event: 'change' },
})(_Radio));

export const RadioGroup = withInstall(mapProps(['value'], {
  model: { prop: 'value', event: 'change' },
})(_RadioGroup));

export const RadioButton = withInstall(_RadioButton);

export default Radio;
