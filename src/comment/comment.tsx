import { VNode } from 'vue';
import { ScopedSlotReturnValue, ScopedSlotReturnArray } from 'vue/types/vnode';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';

const classPrefixMixins = getClassPrefixMixins('comment');

export default mixins(classPrefixMixins).extend({
  name: 'TComment',
  props,
  methods: {
    renderReply() {
      const reply = renderTNodeJSX(this, 'reply');
      return reply ? <div class={`${this.componentName}__reply`}>{reply}</div> : null;
    },
    renderActions() {
      const actions: ScopedSlotReturnArray = renderTNodeJSX(this, 'actions');
      return actions && actions.length ? (
        <ul class={`${this.componentName}__actions`}>
          {actions.map((action: ScopedSlotReturnValue, index: number) => (
            <li key={`action-${index}`}>{action}</li>
          ))}
        </ul>
      ) : null;
    },

    renderQuote() {
      const quote = renderTNodeJSX(this, 'quote');
      return quote ? <div class={`${this.componentName}__quote`}>{quote}</div> : null;
    },

    renderAuthorDatetime() {
      const author = renderTNodeJSX(this, 'author');
      const datetime = renderTNodeJSX(this, 'datetime');

      return (
        (author || datetime) && (
          <div class={`${this.componentName}__author`}>
            {author && <span class={`${this.componentName}__name`}>{author}</span>}
            {datetime && <span class={`${this.componentName}__time`}>{datetime}</span>}
          </div>
        )
      );
    },

    renderContent() {
      return (
        <div class={`${this.componentName}__content`}>
          {this.renderAuthorDatetime()}
          <div class={`${this.componentName}__detail`}>{renderTNodeJSX(this, 'content')}</div>
          {this.renderQuote()}
          {this.renderActions()}
        </div>
      );
    },

    renderAvatar() {
      const avatar = renderTNodeJSX(this, 'avatar');
      return avatar ? (
        <div class={`${this.componentName}__avatar`}>
          {typeof avatar === 'string' ? (
            <img src={avatar} alt="" class={`${this.componentName}__avatar-image`} />
          ) : (
            avatar
          )}
        </div>
      ) : null;
    },
  },

  render(): VNode {
    return (
      <div class={this.componentName}>
        <div class={`${this.componentName}__inner`}>
          {this.renderAvatar()}
          {this.renderContent()}
        </div>
        {this.renderReply()}
      </div>
    );
  },
});
