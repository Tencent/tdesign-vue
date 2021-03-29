import Vue from 'vue';
import { prefix } from '../config';

const name = `${prefix}-content`;

export default Vue.extend({
  name,

  props: {},

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
    return (
      <main class="t-layout--content">
        {this.renderContent()}
      </main>
    );
  },
});
