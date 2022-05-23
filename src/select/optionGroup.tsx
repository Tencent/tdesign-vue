import {
  computed,
  defineComponent,
  ref,
  SetupContext,
  toRefs,
  watch,
  nextTick,
  getCurrentInstance,
  onMounted,
  onUpdated,
  inject,
} from '@vue/composition-api';
import Vue, { VNode, VueConstructor } from 'vue';
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
  setup(props: TdOptionGroupProps, context: SetupContext) {
    const { divider } = toRefs(props);
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
      visible.value = context.root.$children
        && Array.isArray(context.root.$children)
        && context.root.$children.some((option) => (option as any).show === true);
    };
    watch(tSelect.displayOptions, () => {
      childrenChange();
    });
    return {
      visible,
      classes,
    };
  },
  render() {
    const renderTNode = useTNodeJSX();
    const children: ScopedSlotReturnValue = renderTNode('default');
    return (
      <li v-show={this.visible} class={this.classes}>
        <div class={`${name}__header`}>{this.label}</div>
        <ul>{children}</ul>
      </li>
    );
  },
});
