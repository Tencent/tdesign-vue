import Vue, { VNode } from 'vue';
import { prefix } from '../config';
import props from './list-item-props';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';

const name = `${prefix}-list-item`;

export default Vue.extend({
  name: 'TListItem',
  props,
  render(): VNode {
    const content = renderContent(this, 'default', 'content');
    const propsActionContent = renderTNodeJSX(this, 'action');

    return (
      <li class={name}>
        <div class={`${name}-main`}>
          <div class={`${name}__content`}>{content}</div>
          {propsActionContent && <li class={`${name}__action`}>{propsActionContent}</li>}
        </div>
      </li>
    );
  },
});
