import { defineComponent } from '@vue/composition-api';
import Panel from './components/Panel';
import props from './props';

import { useCascaderContext } from './hooks';

export default defineComponent({
  name: 'TCascaderPanel',

  props: { ...props },

  setup(props, { slots }) {
    const { cascaderContext } = useCascaderContext(props);

    return {
      cascaderContext,
      slots,
    };
  },
  render() {
    return (
      <Panel
        empty={this.empty}
        trigger={this.trigger}
        cascaderContext={this.cascaderContext}
        scopedSlots={{ empty: this.slots.empty }}
      />
    );
  },
});
