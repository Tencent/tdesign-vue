import {
  computed,
  ref,
  SetupContext,
  toRefs,
  onMounted,
  inject,
  onBeforeUnmount,
  defineComponent,
  reactive,
} from '@vue/composition-api';
import Vue, { PropType } from 'vue';

import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { renderContent } from '../utils/render-tnode';
import Ripple from '../utils/ripple';
import { getKeepAnimationMixins } from '../config-provider/config-receiver';
import props from './option-props';
import { SelectValue, TdOptionProps } from './type';
import Checkbox from '../checkbox/index';
import { SelectInstance } from './instance';
import useLazyLoad from '../hooks/useLazyLoad';
import { TScroll } from '../common';
import { getNewMultipleValue } from './util';
import { useConfig } from '../config-provider/useConfig';
import useCommonClassName from '../hooks/useCommonClassName';

const keepAnimationMixins = getKeepAnimationMixins();
export interface OptionInstance extends Vue {
  tSelect: SelectInstance;
}

export interface OptionProps extends TdOptionProps {
  panelElement: HTMLElement;
  scroll: TScroll;
  rowIndex: number;
  trs?: Map<number, object>;
  scrollType?: 'lazy' | 'virtual';
  isVirtual: boolean;
  bufferSize: number;
  multiple: Boolean;
  isCreatedOption: Boolean;
  index: Number;
}

export default defineComponent({
  name: 'TOption',
  props: {
    ...props,
    isCreatedOption: Boolean,
    multiple: Boolean,
    rowIndex: Number,
    trs: Map as PropType<OptionProps['trs']>,
    scrollType: String,
    isVirtual: Boolean,
    bufferSize: Number,
    index: Number,
  },
  components: {
    TCheckbox: Checkbox,
  },
  mixins: [keepAnimationMixins],
  directives: { Ripple },
  setup(props: OptionProps, context: SetupContext) {
    const selectProvider: any = inject('tSelect');
    const optionNode = ref(null);
    const { sizeClassNames, statusClassNames } = useCommonClassName();
    const { classPrefix } = useConfig('classPrefix');

    const {
      value, label, disabled, panelElement, scrollType, bufferSize, index, multiple, isCreatedOption,
    } = toRefs(props);

    const { hasLazyLoadHolder = null, tRowHeight = null } = useLazyLoad(
      panelElement,
      optionNode,
      reactive({ type: scrollType, bufferSize, rowIndex: props.rowIndex }),
    );

    const isHover = ref(false);
    const formDisabled = ref(undefined);
    const isDisabled = computed(() => formDisabled.value || disabled.value || selectProvider.isReachMaxLimit.value);
    const isSelected = computed(() => multiple.value
      ? (selectProvider.selectValue.value as SelectValue[])?.includes(props.value)
      : selectProvider.selectValue.value === props.value);
    const mouseEvent = (v: boolean) => {
      isHover.value = v;
    };

    const labelText = computed(() => label.value || value.value);
    const classes = computed(() => [
      `${classPrefix.value}-select-option`,
      sizeClassNames[selectProvider && selectProvider.size.value],
      {
        [statusClassNames.disabled]: isDisabled.value,
        [statusClassNames.selected]: isSelected.value,
        [`${classPrefix.value}-select-option__hover`]:
          (isHover.value || selectProvider.hoverIndex.value === index.value) && !isDisabled.value && !isSelected.value,
      },
    ]);

    const handleClick = (e: MouseEvent | KeyboardEvent) => {
      if (multiple.value || isDisabled.value) return;
      e.stopPropagation();

      if (isCreatedOption.value) {
        selectProvider.handleCreate?.(value.value);
        if (selectProvider.multiple.value) {
          const newValue = getNewMultipleValue(selectProvider.selectValue.value as SelectValue[], value.value);
          selectProvider.handleValueChange(newValue.value, { e, trigger: 'check' }, value.value);
          return;
        }
      }
      selectProvider.handleValueChange(value.value, { e, trigger: 'check' }, value.value);
      selectProvider.handlePopupVisibleChange(false, { e });
    };

    const handleCheckboxClick = (val: boolean, context: { e: MouseEvent | KeyboardEvent }) => {
      const newValue = getNewMultipleValue(selectProvider.selectValue.value as SelectValue[], value.value);
      selectProvider.handleValueChange(
        newValue.value,
        { e: context.e, trigger: val ? 'check' : 'uncheck' },
        value.value,
      );
      if (!selectProvider.reserveKeyword.value) {
        selectProvider.handlerInputChange('');
      }
    };

    // 处理虚拟滚动节点挂载
    onMounted(() => {
      const {
        trs, rowIndex, scrollType, isVirtual,
      } = props;

      if (scrollType === 'virtual') {
        if (isVirtual) {
          trs.set(rowIndex, optionNode.value);
          context.emit('onRowMounted');
        }
      }
    });

    // 处理虚拟滚动节点移除
    onBeforeUnmount(() => {
      if (props.isVirtual) {
        const { trs, rowIndex } = props;
        trs.delete(rowIndex);
      }
    });

    return {
      isHover,
      isSelected,
      mouseEvent,
      classes,
      selectProvider,
      labelText,
      optionNode,
      tRowHeight,
      hasLazyLoadHolder,
      handleClick,
      handleCheckboxClick,
    };
  },

  render() {
    const {
      classes, multiple, labelText, isSelected, disabled, selectProvider, handleCheckboxClick, mouseEvent,
    } = this;
    const children: ScopedSlotReturnValue = renderContent(this, 'default', 'content');
    const optionChild = children || <span>{labelText}</span>;
    if (this.hasLazyLoadHolder) {
      return (
        <li
          ref="optionNode"
          class={classes}
          onMouseenter={() => mouseEvent(true)}
          onMouseleave={() => mouseEvent(false)}
          onClick={this.handleClick}
          v-ripple={(this.keepAnimation as any).ripple}
        >
          {<span style={{ height: `${this.tRowHeight}px`, border: 'none' }}></span>}
        </li>
      );
    }

    return (
      <li
        ref="optionNode"
        class={classes}
        onMouseenter={() => mouseEvent(true)}
        onMouseleave={() => mouseEvent(false)}
        onClick={this.handleClick}
        v-ripple={(this.keepAnimation as any).ripple}
      >
        {multiple ? (
          <t-checkbox
            checked={isSelected}
            disabled={disabled || (!isSelected && selectProvider.isReachMaxLimit.value)}
            onChange={handleCheckboxClick}
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
