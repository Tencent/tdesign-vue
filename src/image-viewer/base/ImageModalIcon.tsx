import { computed, defineComponent, PropType } from '@vue/composition-api';
import { usePrefixClass } from '../../hooks/useConfig';
import { TNode } from '../../common';
import { useTNodeJSX } from '../../hooks/tnode';

const propHandler = {
  type: Function as PropType<(e: MouseEvent) => void>,
  default() {
    return () => {};
  },
};

export default defineComponent({
  name: 'TImageModalIcon',
  props: {
    disabled: Boolean,
    clickHandler: propHandler,
    label: String,
    icon: Function as PropType<TNode>,
  },
  setup(props) {
    const classPrefix = usePrefixClass();
    const renderTNodeJSX = useTNodeJSX();
    const wrapClass = computed(() => [
      `${classPrefix.value}-image-viewer__modal-icon`,
      {
        [`${classPrefix.value}-is-disabled`]: props.disabled,
      },
    ]);

    return {
      wrapClass,
      classPrefix,
      renderTNodeJSX,
    };
  },
  render() {
    return (
      <div class={this.wrapClass} onClick={this.clickHandler}>
        {this.renderTNodeJSX('icon')}
        {this.label && <span class={`${this.classPrefix}-image-viewer__modal-icon-label`}>{this.label}</span>}
      </div>
    );
  },
});
