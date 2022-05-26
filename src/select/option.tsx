import {
  computed,
  ref,
  SetupContext,
  toRefs,
  watch,
  onMounted,
  inject,
  onBeforeUnmount,
  defineComponent,
} from '@vue/composition-api';
import Vue from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import get from 'lodash/get';
import { renderContent } from '../utils/render-tnode';
import { scrollSelectedIntoView } from '../utils/dom';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import Ripple from '../utils/ripple';
import { getKeepAnimationMixins } from '../config-provider/config-receiver';
import props from './option-props';
import { TdOptionProps } from './type';
import Checkbox from '../checkbox/index';
import { SelectInstance } from './instance';

const selectName = `${prefix}-select`;
const keepAnimationMixins = getKeepAnimationMixins();
export interface OptionInstance extends Vue {
  tSelect: SelectInstance;
}

export default defineComponent({
  name: 'TOption',
  props: { ...props },
  components: {
    TCheckbox: Checkbox,
  },
  mixins: [keepAnimationMixins],
  directives: { Ripple },
  setup(props: TdOptionProps, context: SetupContext) {
    const isHover = ref(false);
    const formDisabled = ref(undefined);
    const { value, label, disabled } = toRefs(props);

    const tSelect: any = inject('tSelect');

    watch(value, () => {
      tSelect && tSelect.getOptions({ ...context, ...props });
    });

    const tDisabled = computed(() => formDisabled.value || disabled.value);
    const hovering = computed(
      () => tSelect
        && tSelect.visible.value
        && tSelect.hoverOptions.value[tSelect.hoverIndex.value]
        && tSelect.hoverOptions.value[tSelect.hoverIndex.value][tSelect.realValue.value] === value.value,
    );
    watch(hovering, (val) => {
      if (val) {
        const timer = setTimeout(() => {
          scrollSelectedIntoView(tSelect.getOverlayElm(), context.refs.optionNode as HTMLElement);
          clearTimeout(timer);
        }, tSelect.popupOpenTime.value); // 待popup弹出后再滚动到对应位置
      }
    });
    const multiLimitDisabled = computed(() => {
      if (tSelect && tSelect.multiple.value && tSelect.max.value) {
        if (
          tSelect.value.value instanceof Array
          && tSelect.value.value.indexOf(value.value) === -1
          && tSelect.max.value <= tSelect.value.value.length
        ) {
          return true;
        }
      }
      return false;
    });
    const classes = computed(() => [
      `${prefix}-select-option`,
      {
        [CLASSNAMES.STATUS.disabled]: tDisabled.value || multiLimitDisabled.value,
        [CLASSNAMES.STATUS.selected]: selected.value,
        [CLASSNAMES.SIZE[tSelect && tSelect.size.value]]: tSelect && tSelect.value,
        [`${prefix}-select-option__hover`]: hovering.value,
      },
    ]);
    const isCreatedOption = computed(() => tSelect.creatable.value && value.value === tSelect.tInputValue.value);
    const show = computed(() => {
      /**
       * 此属性主要用于slots生成options时显示控制，直传options由select进行显示控制
       * create的option，始终显示
       * canFilter只显示待匹配的选项
       */
      if (!tSelect) return false;
      if (isCreatedOption.value) return true;
      if (tSelect.canFilter.value && tSelect.tInputValue.value !== '') {
        return tSelect.filterOptions.value.some(
          (option: TdOptionProps) => get(option, tSelect.realValue.value) === value.value,
        );
      }
      return true;
    });
    const labelText = computed(() => label.value || value.value);
    const selected = computed(() => {
      let flag = false;
      if (!tSelect) return false;
      if (tSelect.value.value instanceof Array) {
        if (tSelect.labelInValue.value) {
          flag = tSelect.value.value.map((item: any) => get(item, tSelect.realValue.value)).indexOf(value.value) !== -1;
        } else {
          flag = tSelect.value.value.indexOf(value.value) !== -1;
        }
      } else if (typeof tSelect.value.value === 'object') {
        flag = get(tSelect.value.value, tSelect.realValue.value) === value.value;
      } else {
        flag = tSelect.value.value === value.value;
      }
      return flag;
    });
    const select = (e: MouseEvent | KeyboardEvent) => {
      e.stopPropagation();
      if (tDisabled.value || multiLimitDisabled.value) {
        return false;
      }
      // const parent = context.root.$el.parentNode as HTMLElement;
      const parent = context.refs.optionNode as HTMLLIElement;
      if (parent && parent.className.indexOf(`${selectName}__create-option`) !== -1) {
        tSelect && tSelect.createOption(value.value.toString());
      }
      tSelect && tSelect.onOptionClick(value.value, e);
    };
    const mouseEvent = (v: boolean) => {
      isHover.value = v;
    };
    onMounted(() => {
      tSelect && tSelect.getOptions({ ...context, ...props });
    });
    onBeforeUnmount(() => {
      tSelect && tSelect.hasSlotOptions.value && tSelect.destroyOptions(context);
    });
    return {
      selected,
      show,
      mouseEvent,
      select,
      classes,
      tSelect,
      labelText,
      multiLimitDisabled,
    };
  },

  render() {
    const {
      classes, labelText, selected, disabled, multiLimitDisabled, show, tSelect,
    } = this;
    const children: ScopedSlotReturnValue = renderContent(this, 'default', 'content');
    const optionChild = children || labelText;
    return (
      <li
        ref="optionNode"
        v-show={show}
        class={classes}
        onMouseenter={this.mouseEvent.bind(true)}
        onMouseleave={this.mouseEvent.bind(false)}
        onClick={this.select}
        v-ripple={(this.keepAnimation as any).ripple}
      >
        {tSelect && tSelect.multiple.value ? (
          <t-checkbox
            checked={selected}
            disabled={disabled || multiLimitDisabled}
            nativeOnClick={(e: MouseEvent) => {
              e.preventDefault();
            }}
          >
            {optionChild}
          </t-checkbox>
        ) : (
          <span>{optionChild}</span>
        )}
      </li>
    );
  },
});
