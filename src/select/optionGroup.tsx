import Vue, { VNode, VueConstructor } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { renderTNodeJSX } from '../utils/render-tnode';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import props from './option-group-props';
import { ClassName } from '../common';
import { TdOptionProps } from './type';

const name = `${prefix}-select-option-group`;

export interface Select extends Vue {
  tSelect: {
    size: string;
    displayOptions: Array<TdOptionProps>;
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
  watch: {
    'tSelect.displayOptions': function () {
      this.childrenChange();
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    childrenChange() {
      this.visible = this.$children
        && Array.isArray(this.$children)
        && this.$children.some((option) => (option as any).show === true);
    },
  },
  render(): VNode {
    const children: ScopedSlotReturnValue = renderTNodeJSX(this, 'default');
    return (
      <li v-show={this.visible} class={this.classes}>
        <div class={`${name}__header`}>{this.label}</div>
        <ul>{children}</ul>
      </li>
    );
  },
});
