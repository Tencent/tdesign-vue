import Vue from 'vue';

export default Vue.extend({
  name: 'TContent',

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
