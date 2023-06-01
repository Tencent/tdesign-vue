import { defineComponent } from 'vue';
import props from './menu-group-props';
import { usePrefixClass } from '../hooks/useConfig';

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
        <div class={`${this.classPrefix}-menu-group__title`}>{this.title}</div>
        {this.$slots.default}
      </div>
    );
  },
});
