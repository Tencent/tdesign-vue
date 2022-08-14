import { VNode } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import props from './list-item-meta-props';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('list-item__meta');

export default mixins(classPrefixMixins).extend({
  name: 'TListItemMeta',
  props,
  methods: {
    renderAvatar() {
      if (this.avatar || this.$scopedSlots.avatar) {
        console.warn('`avatar` is going to be deprecated, please use `image` instead');
      }
      const thumbnail = renderContent(this, 'avatar', 'image');
      if (!thumbnail) return;
      if (typeof thumbnail === 'string') {
        return (
          <div class={`${this.componentName}-avatar`}>
            <img src={thumbnail}></img>
          </div>
        );
      }
      return <div class={`${this.componentName}-avatar`}>{thumbnail}</div>;
    },
  },
  render(): VNode {
    const propsTitleContent = renderTNodeJSX(this, 'title');
    const propsDescriptionContent = renderTNodeJSX(this, 'description');

    const listItemMetaContent: ScopedSlotReturnValue = [
      this.renderAvatar(),
      <div class={`${this.componentName}-content`}>
        {propsTitleContent && <h3 class={`${this.componentName}-title`}>{propsTitleContent}</h3>}
        {propsDescriptionContent && <p class={`${this.componentName}-description`}>{propsDescriptionContent}</p>}
      </div>,
    ];

    return <div class={this.componentName}>{listItemMetaContent}</div>;
  },
});
