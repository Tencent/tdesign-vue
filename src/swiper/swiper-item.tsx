import Vue, { VNode } from 'vue';
import { prefix } from '../config';

const name = `${prefix}-swiper-item`;

export default Vue.extend({
  name,
  render(): VNode {
    return (
      <div>
        { this.$slots.default }
      </div>
    );
  },
});
