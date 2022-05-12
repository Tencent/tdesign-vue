import Vue, { VNode, VueConstructor } from 'vue';
import { computed } from '@vue/composition-api';
import { prefix } from '../config';
import props from './props';
import ripple from '../utils/ripple';
import StarFilled from './star-filled-icon';
import StarIcon from './star-icon';

const name = `${prefix}-rate`;

interface RadioInstance extends Vue {
  rate: any;
}

export default (Vue as VueConstructor<RadioInstance>).extend({
  name: 'TRate',

  props: {
    ...props,
  },

  directives: { ripple },

  components: {
    StarFilled,
    StarIcon,
  },

  inject: {
    rate: { default: undefined },
  },

  render(): VNode {
    let className = '';

    const starStyle = computed(() => {
      if (this.index <= this.count) {
        return (className = `${name}-star-icon`);
      }
      return (className = `${name}-star-gray`);
    });

    const onFocus = (index: number) => {
      this.$emit('onFocus', index);
    };

    return (
      <span class={className} onclick={() => onFocus(this.index)} onMouseover={() => onFocus(this.index)}>
        <StarFilled class={starStyle.value} />
      </span>
    );
  },
});
