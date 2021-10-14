import Vue from 'vue';
import { renderContent } from '../utils/render-tnode';
import props from './tab-panel-props';

export default Vue.extend({
  name: 'TTabPanel',

  props: { ...props },

  computed: {
    active(): boolean {
      const { value } = this.$parent as any;
      return this.value === value;
    },
  },

  render() {
    const { destroyOnHide, active } = this;
    if (!destroyOnHide && !active) return null;
    return (
      <div
        class="t-tab-panel"
        v-show={active}
      >
        {renderContent(this, 'default', 'panel')}
      </div>
    );
  },
});
