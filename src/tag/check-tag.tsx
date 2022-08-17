import props from './check-tag-props';
import { renderContent } from '../utils/render-tnode';
import { TNodeReturnValue } from '../common';
import { TdCheckTagProps } from './type';
import { emitEvent } from '../utils/event';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('tag');

export default mixins(classPrefixMixins).extend({
  name: 'TCheckTag',
  props: { ...props },
  computed: {
    tagClass(): Array<any> {
      return [
        `${this.componentName}`,
        `${this.componentName}--check`,
        `${this.componentName}--default`,
        this.commonSizeClassName[this.size],
        {
          [`${this.componentName}--checked`]: !this.disabled && this.checked,
          [`${this.classPrefix}-is-disabled`]: this.disabled,
          [`${this.componentName}--disabled`]: this.disabled,
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
