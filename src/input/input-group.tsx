import Vue, { PropType, VNode } from 'vue';
import { prefix } from '../config';
import { ClassName } from '../common';
import { renderTNodeJSX } from '../utils/render-tnode';

const name = `${prefix}-input-group`;
export default Vue.extend({
  name: 'TInputGroup',
  props: {
    separate: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  computed: {
    classes(): ClassName {
      return [
        name,
        {
          [`${name}--separate`]: this.separate,
        },
      ];
    },
  },
  render(): VNode {
    return (
      <div class={this.classes}>
        {renderTNodeJSX(this, 'default')}
      </div>
    );
  },
});
