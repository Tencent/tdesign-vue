import Vue, { VNode } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { prefix } from '../config';
import props from './list-item-meta-props';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';

const name = `${prefix}-list-item__meta`;

export default Vue.extend({
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
          <div class={`${name}-avatar`}>
            <img src={thumbnail}></img>
          </div>
        );
      }
      return <div class={`${name}-avatar`}>{thumbnail}</div>;
    },
  },
  render(): VNode {
    const propsTitleContent = renderTNodeJSX(this, 'title');
    const propsDescriptionContent = renderTNodeJSX(this, 'description');

    const listItemMetaContent: ScopedSlotReturnValue = [
      this.renderAvatar(),
      <div class={`${name}-content`}>
        {propsTitleContent && <h3 class={`${name}-title`}>{propsTitleContent}</h3>}
        {propsDescriptionContent && <p class={`${name}-description`}>{propsDescriptionContent}</p>}
      </div>,
    ];

    return <div class={name}>{listItemMetaContent}</div>;
  },
});
