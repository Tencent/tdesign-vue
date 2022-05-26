import {
  computed, defineComponent, ref, toRefs, watch, onMounted, inject,
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
    const visible = ref(true);
    const tSelect: any = inject('tSelect');
    const classes = computed<ClassName>(() => [
      name,
      {
        [CLASSNAMES.SIZE[tSelect.size]]: tSelect && tSelect.size,
        [`${name}__divider`]: divider,
      },
    ]);
    const childrenChange = () => {
      visible.value = [...(ulRef.value?.children || [])]?.some((liItem) => (liItem as any).__vue__.show === true);
    };
    onMounted(() => {
      // 首次载入的时候也更新一次
      childrenChange();
    });
    watch(tSelect.displayOptions, () => {
      childrenChange();
    });
    return {
      visible,
      classes,
      ulRef,
    };
  },
  render() {
    const renderTNode = useTNodeJSX();
    const children: ScopedSlotReturnValue = renderTNode('default');
    return (
      <li v-show={this.visible} class={this.classes}>
        <div class={`${name}__header`}>{this.label}</div>
        <ul ref="ulRef">{children}</ul>
      </li>
    );
  },
});
