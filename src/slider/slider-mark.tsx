import Vue, { PropType } from 'vue';
import { prefix } from '../config';
import { TdSliderProps } from './type';

export default Vue.extend({
  name: 'TSliderMark',
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
      <div class={`${prefix}-slider__mark-text`} onClick={this.changeValue}>
        {label}
      </div>
    );
  },
});
