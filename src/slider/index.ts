import _Slider from './slider';
import withInstall from '../utils/withInstall';
import { TdSliderProps, Marks, SliderValue as _SliderValue } from './type';

import './style';

export const Slider = withInstall('Slider', _Slider);
export type SliderProps = TdSliderProps;
export type SliderMarks = Marks;
export type SliderValue = _SliderValue;
export default Slider;
