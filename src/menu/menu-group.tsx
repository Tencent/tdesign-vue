import { defineComponent } from '@vue/composition-api';
import { prefix } from '../config';
import props from './menu-group-props';

export default defineComponent({
  name: 'TMenuGroup',
  props,
  render() {
    return (
      <div class={`${prefix}-menu-group`}>
        <div class={`${prefix}-menu-group__title`}>
          {this.title}
        </div>
        {this.$slots.default}
      </div>
    );
  },
});
