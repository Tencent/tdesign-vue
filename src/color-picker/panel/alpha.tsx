import { computed, defineComponent, PropType } from '@vue/composition-api';
import ColorSlider from './slider';
import { Color } from '../utils';
import { useBaseClassName } from '../hooks';
import { TdColorHandler } from '../interfaces';

export default defineComponent({
  name: 'AlphaSlider',
  components: {
    ColorSlider,
  },
  inheritAttrs: false,
  props: {
    color: {
      type: Object as PropType<Color>,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    handleChange: {
      type: Function as PropType<TdColorHandler>,
      default: () => () => {},
    },
  },
  setup(props) {
    const baseClassName = useBaseClassName();
    const handleValueChange = (v: number, isDragEnd?: boolean) => {
      props.handleChange(v / 100, isDragEnd);
    };
    const railStyle = computed(() => ({
      background: `linear-gradient(to right, rgba(0, 0, 0, 0), ${props.color.rgb})`,
    }));
    return {
      baseClassName,
      railStyle,
      handleValueChange,
    };
  },
  render() {
    const { baseClassName } = this;
    return (
      <color-slider
        class={[`${baseClassName}__alpha`, `${baseClassName}--bg-alpha`]}
        color={this.color}
        value={this.color.alpha * 100}
        handleChange={this.handleValueChange}
        rail-style={this.railStyle}
        max-value={100}
        disabled={this.disabled}
      />
    );
  },
});
