import Vue, { VueConstructor } from 'vue';
import props from './tab-panel-props';
import { renderContent } from '../utils/render-tnode';
import { prefix } from '../config';
import Tabs from './tabs';

export interface TabPanel extends Vue {
  parent?: InstanceType<typeof Tabs>;
}

export default (Vue as VueConstructor<TabPanel>).extend({
  name: 'TTabPanel',

  props: { ...props },

  inject: {
    parent: { default: null },
  },

  computed: {
    active(): boolean {
      const { value } = this.parent || {};
      return this.value === value;
    },
  },

  updated() {
    this.parent?.updatePanels?.({ force: true });
  },

  render() {
    const { destroyOnHide, active } = this;
    if (destroyOnHide && !active) return null;
    return (
      <div class={`${prefix}-tab-panel`} v-show={active}>
        {renderContent(this, 'default', 'panel')}
      </div>
    );
  },
});
