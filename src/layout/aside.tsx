import Vue, { VueConstructor } from 'vue';
import { prefix } from '../config';
import props from './aside-props';
import Layout from './layout';

export interface AsideInstance extends Vue {
  layout: InstanceType<typeof Layout>;
}

export default (Vue as VueConstructor<AsideInstance>).extend({
  name: 'TAside',
  props: { ...props },
  data() {
    return {};
  },
  inject: {
    layout: {
      default: undefined,
    },
  },
  mounted() {
    this.layout.$emit('aside-mounted');
  },
  destroyed() {
    this.layout.$emit('aside-unmonuted');
  },
  methods: {
    renderContent() {
      return this.$scopedSlots.default ? this.$scopedSlots.default(null) : '';
    },
  },

  computed: {},

  watch: {},

  render() {
    const styles = this.width ? {
      width: this.width,
    } : {};
    return (
      <aside class={`${prefix}-layout--sider`} style={styles}>
        {this.renderContent()}
      </aside>
    );
  },
});
