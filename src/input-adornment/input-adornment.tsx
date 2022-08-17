import { VNode, CreateElement } from 'vue';
import { JsxNode } from '../common';
import props from './props';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('input-adornment');

export default mixins(classPrefixMixins).extend({
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
      return addonNode ? <span class={`${this.componentName}__${type}`}>{addonNode}</span> : addonNode;
    },
  },
  render(h: CreateElement) {
    const prepend = this.renderAddon(h, 'prepend', this.prepend);
    const append = this.renderAddon(h, 'append', this.append);
    const defaultSlot: VNode[] = this.$scopedSlots.default ? this.$scopedSlots.default(null) : [null];
    const className = [
      this.componentName,
      {
        [`${this.componentName}--prepend`]: prepend,
        [`${this.componentName}--append`]: append,
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
