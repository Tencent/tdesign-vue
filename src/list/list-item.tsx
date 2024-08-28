import { defineComponent } from '@vue/composition-api';
import props from './props';
import { usePrefixClass } from '../hooks/useConfig';
import { renderTNodeJSX } from '../utils/render-tnode';

export default defineComponent({
  name: 'TListItem',
  props,
  setup() {
    const componentName = usePrefixClass('list-item');

    return {
      componentName,
    };
  },
  render() {
    const { componentName } = this;
    // console.log(this, 'this');
    const propsDefaultContent = renderTNodeJSX(this, 'default');
    const propsContent = renderTNodeJSX(this, 'content');
    const propsActionContent = renderTNodeJSX(this, 'action');

    return (
      <li class={componentName}>
        <div class={`${componentName}-main`}>
          {propsDefaultContent || propsContent}
          {propsActionContent && <li class={`${componentName}__action`}>{propsActionContent}</li>}
        </div>
      </li>
    );
  },
});
