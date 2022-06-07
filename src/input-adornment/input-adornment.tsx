import Vue, { VNode, CreateElement } from 'vue';
import { prefix } from '../config';
import { JsxNode } from '../common';
import props from './props';

const name = `${prefix}-input-adornment`;

export default Vue.extend({
  name: 'TInputAdornment',
  props,
  methods: {
    renderAddon(h: CreateElement, type: string, addon: string | Function | undefined): JsxNode {
      let addonNode: JsxNode;
      if (this.$scopedSlots[type]) {
        addonNode = this.$scopedSlots[type](null);
      } else if (typeof addon === 'string') {
        addonNode = addon;
      } else if (typeof addon === 'function') {
        addonNode = addon(h);
      } else {
        addonNode = null;
      }
      return addonNode ? <span class={`${name}__${type}`}>{addonNode}</span> : addonNode;
    },
  },
  render(h: CreateElement) {
    const prepend = this.renderAddon(h, 'prepend', this.prepend);
    const append = this.renderAddon(h, 'append', this.append);
    const defaultSlot: VNode[] = this.$scopedSlots.default ? this.$scopedSlots.default(null) : [null];
    const className = [
      name,
      {
        [`${name}--prepend`]: prepend,
        [`${name}--append`]: append,
      },
    ];

    if (!prepend && !append) {
      return defaultSlot[0];
    }

    return (
      <div class={className}>
        {prepend}
        {defaultSlot[0]}
        {append}
      </div>
    );
  },
});
