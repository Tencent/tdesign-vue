import { defineComponent } from 'vue';
import props from './menu-group-props';
import { usePrefixClass } from '../hooks/useConfig';
import { renderTNodeJSX } from '../utils/render-tnode';

export default defineComponent({
  name: 'TMenuGroup',
  props,
  setup() {
    const classPrefix = usePrefixClass();
    return {
      classPrefix,
    };
  },
  render() {
    return (
      <div class={`${this.classPrefix}-menu-group`}>
        <div class={`${this.classPrefix}-menu-group__title`}>{renderTNodeJSX(this, 'title')}</div>
        {this.$slots.default}
      </div>
    );
  },
});
