import { VNode, CreateElement } from 'vue';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
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
      const isContentNode = isString(addon) || isNumber(addon);

      if (this.$scopedSlots[type]) {
        if (this.$scopedSlots[type](null).length === 1 && this.$scopedSlots[type](null)[0].text) {
          addonNode = <span class={`${this.componentName}__text`}>{this.$scopedSlots[type](null)}</span>;
        } else {
          addonNode = this.$scopedSlots[type](null);
        }
      } else if (typeof addon === 'function') {
        addonNode = addon(h);
      } else {
        addonNode = isContentNode ? <span class={`${this.componentName}__text`}>{addon}</span> : addon;
      }

      return addonNode ? <span class={`${this.componentName}__${type}`}>{addonNode}</span> : addonNode;
    },
  },
  render(h: CreateElement) {
    const prepend = this.renderAddon(h, 'prepend', this.prepend);
    const append = this.renderAddon(h, 'append', this.append);
    const defaultSlot: VNode[] = this.$scopedSlots.default ? this.$scopedSlots.default(null) : [null];

    if (!prepend && !append) {
      return defaultSlot[0];
    }

    return (
      <div class={this.componentName}>
        {prepend}
        {defaultSlot[0]}
        {append}
      </div>
    );
  },
});
