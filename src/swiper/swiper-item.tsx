import Vue, { VNode } from 'vue';

export default Vue.extend({
  name: 'TSwiperItem',
  render(): VNode {
    return (
      <div>
        { this.$slots.default }
      </div>
    );
  },
});
