import Vue from 'vue';
import props from './avatar-group-props';
import { TNodeReturnValue } from '../common';
import Avatar from './avatar';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('avatar');

export default mixins(classPrefixMixins).extend({
  name: 'TAvatarGroup',
  components: {
    Avatar,
  },

  props: {
    ...props,
  },
  provide(): Record<string, any> {
    return {
      avatarGroup: this,
    };
  },

  methods: {
    renderEllipsisAvatar(children: Array<TNodeReturnValue>): Array<TNodeReturnValue> {
      if (children?.length > this.max) {
        const content = this.setEllipsisContent(children);
        const outAvatar = children.slice(0, this.max);
        outAvatar.push(
          <Avatar
            class={`${this.componentName}__collapse`}
            size={this.size}
            icon={this.isIcon() ? this.collapseAvatar : null}
          >
            {content}
          </Avatar>,
        );
        return [outAvatar];
      }
      return [children];
    },
    setEllipsisContent(children: Array<TNodeReturnValue>) {
      let content: any = '';
      if (this.collapseAvatar) {
        if (!this.isIcon()) {
          content = renderContent(this, 'collapseAvatar', 'content');
        }
      } else {
        content = `+${children.length - this.max}`;
      }
      return content;
    },
    isIcon() {
      const content = renderTNodeJSX(this, 'collapseAvatar');
      return content?.context instanceof Vue;
    },
  },
  render() {
    const { $scopedSlots } = this;
    const children: TNodeReturnValue = $scopedSlots.default && $scopedSlots.default(null);
    const { cascading, max } = this.$props;
    const groupClass = [
      `${this.componentName}-group`,
      {
        [`${this.componentName}--offset-right`]: cascading === 'right-up',
        [`${this.componentName}--offset-left`]: cascading === 'left-up',
      },
    ];
    let content = [children];

    if (max && max >= 0) {
      content = [this.renderEllipsisAvatar(children)];
    }
    return <div class={groupClass}>{content}</div>;
  },
});
