import Vue, { VNode, VueConstructor } from 'vue';
import { computed } from '@vue/composition-api';
import { prefix } from '../config';
import props from './props';
import ripple from '../utils/ripple';
import StarFilled from './star-filled-icon';

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
  },

  inject: {
    rate: { default: undefined },
  },

  render(): VNode {
    // 星星展示的样式
    let className = '';
    const starStyle = computed(() => {
      if (this.index <= this.count) {
        return (className = `${name}-star-icon`);
      }
      return (className = `${name}-star-gray`);
    });

    const onFocus = (e: { stopPropagation: () => void }, index: number) => {
      // 只读状态
      if (this.readonly) {
        e.stopPropagation();
        return;
      }
      this.$emit('onFocus', index);
    };

    return (
      <span
        class={className}
        onclick={(e: { stopPropagation: () => void }) => onFocus(e, this.index)}
        onMouseover={(e: { stopPropagation: () => void }) => onFocus(e, this.index)}
      >
        {/* 实心星星的svg */}
        <StarFilled class={starStyle.value} style={{ fontSize: `${this.size}px` }} />
      </span>
    );
  },
});
