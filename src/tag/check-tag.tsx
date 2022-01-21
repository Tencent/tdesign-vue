import Vue from 'vue';
import { prefix } from '../config';
import props from './check-tag-props';
import { renderContent } from '../utils/render-tnode';
import { TNodeReturnValue } from '../common';
import CLASSNAMES from '../utils/classnames';
import { TdCheckTagProps } from './type';
import { emitEvent } from '../utils/event';

const name = `${prefix}-tag`;

export default Vue.extend({
  name: 'TCheckTag',
  props: { ...props },
  computed: {
    tagClass(): Array<any> {
      return [
        `${name}`,
        `${name}--check`,
        `${name}--default`,
        CLASSNAMES.SIZE[this.size],
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
        emitEvent<Parameters<TdCheckTagProps['onClick']>>(this, 'click', { e });
        emitEvent<Parameters<TdCheckTagProps['onChange']>>(this, 'change', !this.checked);
      }
    },
  },
  render() {
    // 标签内容
    const tagContent: TNodeReturnValue = renderContent(this, 'default', 'content');

    return (
      <span class={this.tagClass} onClick={this.handleClick}>
        {tagContent}
      </span>
    );
  },
});
