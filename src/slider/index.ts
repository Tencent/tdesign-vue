import Slider from './slider';
// import Slider from './slider.vue';

import SliderButton from './button.vue';
import withInstall from '../utils/withInstall';

withInstall('Slider', Slider);
withInstall('SliderButton', SliderButton);
export { Slider, SliderButton };
export default Slider;
