import { defineComponent } from '@vue/composition-api';
import props from './list-item-props';
import { usePrefixClass } from '../hooks/useConfig';
import { renderTNodeJSX } from '../utils/render-tnode';

export default defineComponent({
  name: 'TListItem',
  props,
  setup(props, { emit }) {
    const componentName = usePrefixClass('list-item');

    const handleClick = (e: MouseEvent) => {
      emit('click', { e });
      props.onClick?.({ e });
    };
    return {
      componentName,
      handleClick,
    };
  },
  render() {
    const { componentName, handleClick } = this;
    const propsDefaultContent = renderTNodeJSX(this, 'default');
    const propsContent = renderTNodeJSX(this, 'content');
    const propsActionContent = renderTNodeJSX(this, 'action');

    return (
      <li class={componentName} onClick={handleClick}>
        <div class={`${componentName}-main`}>
          {propsDefaultContent || propsContent}
          {propsActionContent && <li class={`${componentName}__action`}>{propsActionContent}</li>}
        </div>
      </li>
    );
  },
});
