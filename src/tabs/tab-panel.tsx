import Vue from 'vue';
import props from './tab-panel-props';
import { renderContent } from '../utils/render-tnode';
import { prefix } from '../config';

export default Vue.extend({
  name: 'TTabPanel',

  props: { ...props },

  computed: {
    active(): boolean {
      const { value } = this.$parent as any;
      return this.value === value;
    },
  },

  updated() {
    (this.$parent as any)?.updatePanels?.({ force: true });
  },

  render() {
    const { destroyOnHide, active } = this;
    if (destroyOnHide && !active) return null;
    return (
      <div
        class={`${prefix}-tab-panel`}
        v-show={active}
      >
        {renderContent(this, 'default', 'panel')}
      </div>
    );
  },
});
