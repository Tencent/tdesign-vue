import Vue, { VueConstructor } from 'vue';
import props from './aside-props';
import Layout from './layout';
import { renderTNodeJSX } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('aside');

export interface AsideInstance extends Vue {
  layout: InstanceType<typeof Layout>;
}

export default mixins(Vue as VueConstructor<AsideInstance>, classPrefixMixins).extend({
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
      <aside class={`${this.classPrefix}-layout__sider`} style={styles}>
        {renderTNodeJSX(this, 'default')}
      </aside>
    );
  },
});
