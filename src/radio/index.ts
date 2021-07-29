import _Radio from './radio';
import _Group from './group';
import _RadioButton from './radio-button';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdRadioProps, TdRadioGroupProps } from './type';

import './style/';

export type RadioProps = TdRadioProps;
export type RadioGroupProps = TdRadioGroupProps;
export * from './type';

export const Radio = withInstall('Radio', mapProps(['checked'], {
  model: { prop: 'checked', event: 'change' },
})(_Radio));
export const RadioGroup = withInstall('RadioGroup', mapProps(['value'], {
  model: { prop: 'value', event: 'change' },
})(_Group));
export const RadioButton = withInstall('RadioButton', _RadioButton);

export default Radio;
