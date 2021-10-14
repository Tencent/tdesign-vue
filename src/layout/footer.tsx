import Vue from 'vue';
import { prefix } from '../config';
import props from './footer-props';

export default Vue.extend({
  name: 'TFooter',

  props: { ...props },

  data() {
    return {};
  },

  methods: {
    renderContent() {
      return this.$scopedSlots.default ? this.$scopedSlots.default(null) : '';
    },
  },

  computed: {},

  watch: {},

  render() {
    const styles = this.height ? {
      height: this.height,
    } : {};
    return (
      <footer class={`${prefix}-layout--footer`} style={styles}>
        {this.renderContent()}
      </footer>
    );
  },
});
