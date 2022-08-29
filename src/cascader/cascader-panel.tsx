import { defineComponent } from '@vue/composition-api';
import Panel from './components/Panel';
import props from './props';

import { useCascaderContext } from './hooks';
import { TreeNode } from './interface';

export default defineComponent({
  name: 'TCascaderPanel',

  props: { ...props },

  setup(props, { slots, emit }) {
    const { cascaderContext } = useCascaderContext(props);

    const onClick = (value: string, node: TreeNode) => {
      emit('click', value, node);
    };

    return {
      cascaderContext,
      slots,
      onClick,
    };
  },
  render() {
    return (
      <Panel
        empty={this.empty}
        trigger={this.trigger}
        cascaderContext={this.cascaderContext}
        scopedSlots={{ empty: this.slots.empty }}
        onClick={this.onClick}
      />
    );
  },
});
