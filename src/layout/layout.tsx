import Vue from 'vue';
import { prefix } from '../config';

const name = `${prefix}-layout`;

export default Vue.extend({
  name,

  data() {
    return {
      hasSider: false,
    };
  },

  provide(): any {
    return {
      layout: this,
    };
  },

  created() {
    this.$on('aside-mounted', () => {
      this.hasSider = true;
    });
    this.$on('aside-unmounted', () => {
      this.hasSider = false;
    });
  },

  methods: {
    renderContent() {
      return this.$scopedSlots.default ? this.$scopedSlots.default(null) : '';
    },
  },

  computed: {
    classes(): Array<string|object> {
      return [
        name,
        {
          [`${name}-has-sider`]: this.hasSider,
        },
      ];
    },
  },

  watch: {},

  render() {
    return (
      <section class={this.classes}>
        {this.renderContent()}
      </section>
    );
  },
});
