import { defineComponent } from '@vue/composition-api';
import props from './list-item-props';
import { usePrefixClass } from '../hooks/useConfig';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';

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
    const content = renderContent(this, 'default', 'content');
    const propsActionContent = renderTNodeJSX(this, 'action');

    return (
      <li class={componentName} onClick={handleClick}>
        <div class={`${componentName}-main`}>
          <div class={`${componentName}__content`}> {content}</div>
          {propsActionContent && <li class={`${componentName}__action`}>{propsActionContent}</li>}
        </div>
      </li>
    );
  },
});
