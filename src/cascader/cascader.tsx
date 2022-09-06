import { defineComponent, computed } from '@vue/composition-api';
import omit from 'lodash/omit';
import Panel from './components/Panel';
import SelectInput, {
  SelectInputChangeContext,
  SelectInputFocusContext,
  SelectInputValueChangeContext,
} from '../select-input';
import FakeArrow from '../common-components/fake-arrow';
import props from './props';

import { useCascaderContext } from './hooks';
import { CascaderValue, TdSelectInputProps, TdCascaderProps } from './interface';
import { useConfig, usePrefixClass, useCommonClassName } from '../hooks/useConfig';
import { PopupVisibleChangeContext } from '../popup';
import { InputValue } from '../input';

import { closeIconClickEffect, handleRemoveTagEffect } from './core/effect';
import { getPanels, getSingleContent, getMultipleContent } from './core/helper';
import { getFakeArrowIconClass } from './core/className';

export default defineComponent({
  name: 'TCascader',

  props: { ...props },

  setup(props, { slots, emit }) {
    const COMPONENT_NAME = usePrefixClass('cascader');
    const classPrefix = usePrefixClass();
    const { STATUS } = useCommonClassName();
    const overlayClassName = usePrefixClass('cascader__popup');
    const { global } = useConfig('cascader');

    // 全局状态的上下文
    const { cascaderContext, isFilterable } = useCascaderContext(props);

    const displayValue = computed(() => props.multiple ? getMultipleContent(cascaderContext.value) : getSingleContent(cascaderContext.value));

    const panels = computed(() => getPanels(cascaderContext.value.treeNodes));

    const inputPlaceholder = computed(
      () => (cascaderContext.value.visible && !props.multiple && getSingleContent(cascaderContext.value))
        || (props.placeholder ?? global.value.placeholder),
    );

    return {
      COMPONENT_NAME,
      overlayClassName,
      panels,
      displayValue,
      inputPlaceholder,
      isFilterable,
      STATUS,
      classPrefix,
      cascaderContext,
      slots,
      emit,
    };
  },
  render() {
    const {
      COMPONENT_NAME,
      overlayClassName,
      panels,
      displayValue,
      inputPlaceholder,
      isFilterable,
      STATUS,
      classPrefix,
      cascaderContext,
      slots,
      emit,
    } = this;
    const renderSuffixIcon = () => {
      const { visible, disabled } = cascaderContext;
      return (
        <FakeArrow
          overlayClassName={getFakeArrowIconClass(classPrefix, STATUS, cascaderContext)}
          isActive={visible}
          disabled={disabled}
        />
      );
    };

    const {
      setVisible, visible, inputVal, setInputVal,
    } = cascaderContext;

    return (
      <SelectInput
        class={COMPONENT_NAME}
        {...{
          props: {
            value: displayValue,
            inputValue: visible ? inputVal : '',
            popupVisible: visible,
            keys: this.keys,
            allowInput: isFilterable,
            minCollapsedNum: this.minCollapsedNum,
            collapsedItems: this.collapsedItems,
            readonly: this.readonly,
            disabled: this.disabled,
            clearable: this.clearable,
            placeholder: inputPlaceholder,
            multiple: this.multiple,
            loading: this.loading,
            status: this.status,
            tips: this.tips,
            suffixIcon: () => renderSuffixIcon(),
            popupProps: {
              ...(this.popupProps as TdCascaderProps['popupProps']),
              overlayInnerStyle: panels.length && !this.loading ? { width: 'auto' } : '',
              overlayInnerClassName: [
                overlayClassName,
                (this.popupProps as TdCascaderProps['popupProps'])?.overlayClassName,
              ],
            },
            inputProps: { size: this.size, ...(this.inputProps as TdCascaderProps['inputProps']) },
            tagInputProps: { size: this.size, ...(this.tagInputProps as TdCascaderProps['tagInputProps']) },
            tagProps: { ...(this.tagProps as TdCascaderProps['tagProps']) },
            onInputChange: (value: InputValue, ctx: SelectInputValueChangeContext) => {
              if (!this.isFilterable) return;
              setInputVal(`${value}`);
              (this?.selectInputProps as TdSelectInputProps)?.onInputChange?.(value, ctx);
            },
            onTagChange: (val: CascaderValue, ctx: SelectInputChangeContext) => {
              // 按 enter 键不处理
              if (ctx.trigger === 'enter') return;
              handleRemoveTagEffect(cascaderContext, ctx.index, this.onRemove);
              (this?.selectInputProps as TdSelectInputProps)?.onTagChange?.(val, ctx);
            },
            onPopupVisibleChange: (val: boolean, context: PopupVisibleChangeContext) => {
              if (this.disabled) return;
              setVisible(val, context);
              (this?.selectInputProps as TdSelectInputProps)?.onPopupVisibleChange?.(val, context);
            },
            onBlur: (val: CascaderValue, context: SelectInputFocusContext) => {
              const ctx = { value: cascaderContext.value, e: context.e };
              this.onBlur?.(ctx);
              emit('blur', ctx);
              (this?.selectInputProps as TdSelectInputProps)?.onBlur?.(val, context);
            },
            onFocus: (val: CascaderValue, context: SelectInputFocusContext) => {
              const ctx = { value: cascaderContext.value, e: context.e };
              this.onFocus?.(ctx);
              emit('focus', ctx);
              (this?.selectInputProps as TdSelectInputProps)?.onFocus?.(val, context);
            },
            onClear: (context: { e: MouseEvent }) => {
              closeIconClickEffect(cascaderContext);
              (this?.selectInputProps as TdSelectInputProps)?.onClear?.(context);
            },
            ...omit(this.selectInputProps as TdSelectInputProps, [
              'onTagChange',
              'onInputChange',
              'onPopupVisibleChange',
              'onBlur',
              'onFocus',
              'onClear',
            ]),
          },
        }}
        scopedSlots={{
          panel: () => (
            <Panel
              empty={this.empty}
              trigger={this.trigger}
              loading={this.loading}
              loadingText={this.loadingText}
              cascaderContext={cascaderContext}
              scopedSlots={{ empty: slots.empty, loadingText: slots.loadingText }}
            />
          ),
          collapsedItems: slots.collapsedItems,
        }}
      />
    );
  },
});
