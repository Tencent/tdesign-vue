import { defineComponent } from '@vue/composition-api';
import ColorSlider from './slider';
import { useBaseClassName } from '../hooks';
import baseProps from './base-props';

export default defineComponent({
  name: 'HueSlider',
  components: {
    ColorSlider,
  },
  inheritAttrs: false,
  props: {
    ...baseProps,
  },
  setup() {
    const baseClassName = useBaseClassName();
    return {
      baseClassName,
    };
  },
  render() {
    return (
      <color-slider
        class={`${this.baseClassName}__hue`}
        color={this.color}
        value={this.color.hue}
        handleChange={this.handleChange}
        disabled={this.disabled}
      />
    );
  },
});
