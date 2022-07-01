import {
  computed, defineComponent, ref, toRefs, inject,
} from '@vue/composition-api';
import Vue from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import props from './option-group-props';
import { ClassName } from '../common';
import { TdOptionProps, TdOptionGroupProps } from './type';
import { useTNodeJSX } from '../hooks/tnode';

const name = `${prefix}-select-option-group`;

export interface Select extends Vue {
  tSelect: {
    size: string;
    displayOptions: Array<TdOptionProps>;
  };
}

export default defineComponent({
  name: 'TOptionGroup',
  props: { ...props },
  setup(props: TdOptionGroupProps) {
    const { divider } = toRefs(props);
    const ulRef = ref<HTMLElement>(null);
    const tSelect: any = inject('tSelect');
    const classes = computed<ClassName>(() => [
      name,
      {
        [CLASSNAMES.SIZE[tSelect.size]]: tSelect && tSelect.size,
        [`${name}__divider`]: divider,
      },
    ]);
    return {
      classes,
      ulRef,
    };
  },
  render() {
    const renderTNode = useTNodeJSX();
    const children: ScopedSlotReturnValue = renderTNode('default');
    return (
      <li class={this.classes}>
        <div class={`${name}__header`}>{this.label}</div>
        <ul class={`${prefix}-select__list`} ref="ulRef">
          {children}
        </ul>
      </li>
    );
  },
});
