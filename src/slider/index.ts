import _Slider from './slider';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';
import { TdSliderProps, SliderMarks as _SliderMarks, SliderValue as _SliderValue } from './type';

import './style';

export const Slider = withInstall(
  mapProps(['value'], {
    model: { prop: 'value', event: 'change' },
  })(_Slider),
);

export * from './type';
export type SliderProps = TdSliderProps;
export type SliderMarks = _SliderMarks;
export type SliderValue = _SliderValue;
export default Slider;
