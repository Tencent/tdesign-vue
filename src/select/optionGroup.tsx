import {
  computed, defineComponent, ref, toRefs, inject,
} from '@vue/composition-api';
import Vue from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import props from './option-group-props';
import { ClassName } from '../common';
import { TdOptionGroupProps } from './type';
import { useTNodeJSX } from '../hooks/tnode';
import { usePrefixClass, useConfig } from '../config-provider/useConfig';
import useCommonClassName from '../hooks/useCommonClassName';

export interface Select extends Vue {
  tSelect: {
    size: string;
  };
}

export default defineComponent({
  name: 'TOptionGroup',
  props: { ...props },
  setup(props: TdOptionGroupProps) {
    const { divider } = toRefs(props);
    const ulRef = ref<HTMLElement>(null);
    const tSelect: any = inject('tSelect');
    const { sizeClassNames } = useCommonClassName();
    const COMPONENT_NAME = usePrefixClass('select');
    const { classPrefix } = useConfig('classPrefix');

    const classes = computed<ClassName>(() => [
      `${COMPONENT_NAME.value}-option-group`,
      {
        [sizeClassNames[tSelect.size]]: tSelect && tSelect.size,
        [`${COMPONENT_NAME.value}-option-group__divider`]: divider,
      },
    ]);
    return {
      classes,
      ulRef,
      classPrefix,
      componentName: COMPONENT_NAME,
    };
  },
  render() {
    const renderTNode = useTNodeJSX();
    const children: ScopedSlotReturnValue = renderTNode('default');
    return (
      <li class={this.classes}>
        <div class={`${this.componentName}-option-group__header`}>{this.label}</div>
        <ul class={`${this.classPrefix}-select__list`} ref="ulRef">
          {children}
        </ul>
      </li>
    );
  },
});
