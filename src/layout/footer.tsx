import Vue from 'vue';
import { prefix } from '../config';
import props from '../../types/footer/props';

const name = `${prefix}-footer`;

export default Vue.extend({
  name,

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
      <footer class="t-layout--footer" style={styles}>
        {this.renderContent()}
      </footer>
    );
  },
});
