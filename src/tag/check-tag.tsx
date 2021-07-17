import Vue from 'vue';
import config from '../config';
import props from '../../types/check-tag/props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { TNodeReturnValue } from '../../types/common';

const { prefix } = config;
const name = `${prefix}-tag`;

export default Vue.extend({
  name: `${prefix}-check-tag`,
  props: { ...props },
  computed: {
    tagClass(): Array<any> {
      return [
        `${name}`,
        `${name}--check`,
        `${name}--default`,
        {
          [`${name}--checked`]: !this.disabled && this.checked,
          [`${prefix}-is-disabled`]: this.disabled,
          [`${name}--disabled`]: this.disabled,
        },
      ];
    },
  },
  methods: {
    handleClick(e: MouseEvent): void {
      if (!this.disabled) {
        this.$emit('click', { e });
        this.$emit('change', !this.checked);
        if (typeof this.onClick === 'function') this.onClick({ e });
        if (typeof this.onChange === 'function') this.onChange(!this.checked);
      }
    },
  },
  render() {
    // 标签内容
    const tagContent: TNodeReturnValue = renderTNodeJSX(this, 'default') || renderTNodeJSX(this, 'content');

    return (
      <span class={this.tagClass} onClick={this.handleClick}>
        {tagContent}
      </span>
    );
  },
});
