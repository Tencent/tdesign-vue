import { VNode } from 'vue';
import props from './list-item-props';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('list-item');

export default mixins(classPrefixMixins).extend({
  name: 'TListItem',
  props,
  methods: {
    handleClick(e: MouseEvent): void {
      this.$emit('click', { e });
      this.onClick?.({ e });
    },
  },
  render(): VNode {
    const content = renderContent(this, 'default', 'content');
    const propsActionContent = renderTNodeJSX(this, 'action');

    return (
      <li class={this.componentName} onClick={this.handleClick}>
        <div class={`${this.componentName}-main`}>
          <div class={`${this.componentName}__content`}>{content}</div>
          {propsActionContent && <li class={`${this.componentName}__action`}>{propsActionContent}</li>}
        </div>
      </li>
    );
  },
});
