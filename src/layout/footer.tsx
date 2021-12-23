import Vue from 'vue';
import { prefix } from '../config';
import props from './footer-props';
import { renderTNodeJSX } from '../utils/render-tnode';

export default Vue.extend({
  name: 'TFooter',

  props: { ...props },

  methods: {
    renderContent() {
      return this.$scopedSlots.default ? this.$scopedSlots.default(null) : '';
    },
  },

  render() {
    const styles = this.height
      ? {
        height: this.height,
      }
      : {};
    return (
      <footer class={`${prefix}-layout__footer`} style={styles}>
        {renderTNodeJSX(this, 'default')}
      </footer>
    );
  },
});
