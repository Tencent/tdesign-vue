import Vue, { VueConstructor } from 'vue';
import { prefix } from '../config';
import props from './aside-props';
import Layout from './layout';
import { renderTNodeJSX } from '../utils/render-tnode';

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
    this.layout.hasSider = true;
  },

  destroyed() {
    this.layout.hasSider = false;
  },

  render() {
    const styles = this.width ? { width: this.width } : {};
    return (
      <aside class={`${prefix}-layout__sider`} style={styles}>
        {renderTNodeJSX(this, 'default')}
      </aside>
    );
  },
});
