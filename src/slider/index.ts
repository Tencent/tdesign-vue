import _Slider from './slider';
import withInstall from '../utils/withInstall';
import { TdSliderProps, SliderMarks as _SliderMarks, SliderValue as _SliderValue } from './type';

import './style';

export const Slider = withInstall(_Slider);

export * from './type';
export type SliderProps = TdSliderProps;
export type SliderMarks = _SliderMarks;
export type SliderValue = _SliderValue;
export default Slider;
