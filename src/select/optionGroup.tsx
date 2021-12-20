import Vue, { VNode, VueConstructor } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { renderTNodeJSX } from '../utils/render-tnode';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import props from './option-group-props';
import { ClassName } from '../common';

const name = `${prefix}-option-group`;

export interface Select extends Vue {
  tSelect: {
    size: string;
  };
}

export default (Vue as VueConstructor<Select>).extend({
  name: 'TOptionGroup',
  props: { ...props },
  inject: {
    tSelect: {
      default: undefined,
    },
  },
  computed: {
    classes(): ClassName {
      return [
        name,
        {
          [CLASSNAMES.SIZE[this.tSelect.size]]: this.tSelect && this.tSelect.size,
          [`${name}__divider`]: this.divider,
        },
      ];
    },
  },
  render(): VNode {
    const children: ScopedSlotReturnValue = renderTNodeJSX(this, 'default');
    return (
      <li class={this.classes}>
        <div class={`${name}-header`}>{ this.label }</div>
        <ul>{children}</ul>
      </li>
    );
  },
});
