import Vue from 'vue';
import { prefix } from '../config';
import props from './header-props';

export default Vue.extend({
  name: 'THeader',

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
      <header class={`${prefix}-layout--header`} style={styles}>
        {this.renderContent()}
      </header>
    );
  },
});
