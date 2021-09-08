import Vue, { PropType } from 'vue';
import { prefix } from '../config';
import { TdSliderProps } from './type';

const name = `${prefix}-slider-mark`;
export default Vue.extend({
  name,
  props: {
    mark: {
      type: [Object, Array, String] as PropType<TdSliderProps['marks']>,
    },
    point: {
      type: Number,
    },
  },
  methods: {
    changeValue(event: MouseEvent) {
      event.stopPropagation();
      this.$emit('change-value', this.point);
    },
  },
  render() {
    const label = this.mark;
    return (
      <div class="t-slider__mark-text" onClick={this.changeValue}>
        {label}
      </div>
    );
  },
});
