import Vue, { VueConstructor } from 'vue';
import props from './tab-panel-props';
import { renderContent } from '../utils/render-tnode';
import Tabs from './tabs';
import { updateElement } from '../hooks/useDestroyOnClose';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('tab-panel');

export type TabPanelParentInstance = InstanceType<typeof Tabs>;
export interface TabPanel extends Vue {
  parent?: TabPanelParentInstance;
}

export default mixins(Vue as VueConstructor<TabPanel>, classPrefixMixins).extend({
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
    // 父元素为 display: none 时，需要更新子元素，避免 Dialog 前套 Table 组件时，固定列等特性失效
    if (!this.destroyOnHide) {
      const timer = setTimeout(() => {
        updateElement(this);
        clearTimeout(timer);
      }, 0);
    }
  },

  render() {
    const { destroyOnHide, active } = this;
    if (destroyOnHide && !active) return null;
    return (
      <div class={this.componentName} v-show={active}>
        {renderContent(this, 'default', 'panel')}
      </div>
    );
  },
});
