import _Slider from './slider';
import withInstall from '../utils/withInstall';
import { TdSliderProps, Marks } from './type';

import './style';

export const Slider = withInstall('Slider', _Slider);
export type SliderProps = TdSliderProps;
export type SliderMarks = Marks;
export { SliderValue } from './type';
export default Slider;
