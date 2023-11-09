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
import {
  CascaderValue, TreeKeysType, TdSelectInputProps, TdCascaderProps,
} from './interface';
import { useConfig, usePrefixClass, useCommonClassName } from '../hooks/useConfig';
import { PopupVisibleChangeContext } from '../popup';
import { InputValue } from '../input';

import { closeIconClickEffect, handleRemoveTagEffect } from './core/effect';
import { getPanels, getSingleContent, getMultipleContent } from './core/helper';
import { getFakeArrowIconClass } from './core/className';
import useFormDisabled from '../hooks/useFormDisabled';
import { TagInputValue } from '../tag-input';
import { renderTNodeJSX } from '../utils/render-tnode';

const DEFAULT_KEYS = {
  label: 'label',
  value: 'value',
  children: 'children',
};

export default defineComponent({
  name: 'TCascader',

  props: { ...props },

  setup(props, { emit }) {
    const COMPONENT_NAME = usePrefixClass('cascader');
    const classPrefix = usePrefixClass();
    const { STATUS } = useCommonClassName();
    const overlayClassName = usePrefixClass('cascader__popup');
    const { global } = useConfig('cascader');

    // 全局状态的上下文
    const { innerValue, cascaderContext, isFilterable } = useCascaderContext(props);

    const displayValue = computed(() => props.multiple ? getMultipleContent(cascaderContext.value) : getSingleContent(cascaderContext.value));

    const panels = computed(() => getPanels(cascaderContext.value.treeNodes));

    const inputPlaceholder = computed(
      () => (cascaderContext.value.visible && !props.multiple && getSingleContent(cascaderContext.value))
        || (props.placeholder ?? global.value.placeholder),
    );

    const { formDisabled } = useFormDisabled();
    const isDisabled = computed(() => formDisabled.value || cascaderContext.value.disabled);

    return {
      COMPONENT_NAME,
      overlayClassName,
      panels,
      innerValue,
      displayValue,
      inputPlaceholder,
      isFilterable,
      isDisabled,
      STATUS,
      classPrefix,
      cascaderContext,
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
      isDisabled,
      STATUS,
      classPrefix,
      cascaderContext,
      emit,
    } = this;

    const renderSuffixIcon = () => {
      const suffixIcon = renderTNodeJSX(this, 'suffixIcon');
      if (suffixIcon) return suffixIcon;
      const { visible } = cascaderContext;
      return (
        <FakeArrow
          overlayClassName={getFakeArrowIconClass(classPrefix, STATUS, cascaderContext)}
          isActive={visible}
          disabled={isDisabled}
        />
      );
    };

    const renderCollapsedItems = () => {
      const cascaderValue = this.innerValue || [];
      const keys = (this.keys as TreeKeysType) || DEFAULT_KEYS;
      const value = Array.isArray(cascaderValue) ? cascaderValue : [cascaderValue];
      const cascaderOptions = value.map((item) => {
        const tmpValue = typeof item === 'object' ? item[keys.value] : item;
        if (tmpValue === undefined) return null;
        return cascaderContext.treeStore.getNode(tmpValue).data;
      });
      return renderTNodeJSX(this, 'collapsedItems', {
        params: {
          value: cascaderOptions,
          collapsedSelectedItems: cascaderOptions.slice(0, this.minCollapsedNum),
          count: value.length - this.minCollapsedNum,
        },
      });
    };

    const {
      setVisible, visible, inputVal, setInputVal,
    } = cascaderContext;

    const slots = this.$scopedSlots;

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
            collapsedItems: renderCollapsedItems,
            label: this.label,
            suffix: this.suffix,
            tag: this.tag,
            readonly: this.readonly,
            disabled: isDisabled,
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
              overlayClassName: [
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
            onTagChange: (val: TagInputValue, ctx: SelectInputChangeContext) => {
              // 按 enter 键不处理
              if (ctx.trigger === 'enter') return;
              handleRemoveTagEffect(cascaderContext, ctx.index, this.onRemove);
              (this.selectInputProps as TdSelectInputProps)?.onTagChange?.(val, ctx);
            },
            onPopupVisibleChange: (val: boolean, context: PopupVisibleChangeContext) => {
              if (this.disabled) return;
              setVisible(val, context);
              (this.selectInputProps as TdSelectInputProps)?.onPopupVisibleChange?.(val, context);
            },
            onBlur: (val: CascaderValue, context: SelectInputFocusContext) => {
              const ctx = { value: cascaderContext.value, inputValue: context.inputValue || '', e: context.e };
              this.onBlur?.(ctx);
              emit('blur', ctx);
              (this.selectInputProps as TdSelectInputProps)?.onBlur?.(val, context);
            },
            onFocus: (val: CascaderValue, context: SelectInputFocusContext) => {
              const ctx = { value: cascaderContext.value, e: context.e };
              this.onFocus?.(ctx);
              emit('focus', ctx);
              (this.selectInputProps as TdSelectInputProps)?.onFocus?.(val, context);
            },
            onClear: (context: { e: MouseEvent }) => {
              closeIconClickEffect(cascaderContext);
              (this.selectInputProps as TdSelectInputProps)?.onClear?.(context);
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
              option={this.option}
              empty={this.empty}
              trigger={this.trigger}
              loading={this.loading}
              loadingText={this.loadingText}
              cascaderContext={cascaderContext}
              scopedSlots={{ option: slots.option, empty: slots.empty, loadingText: slots.loadingText }}
            />
          ),
          tips: slots.tips,
          tag: slots.tag,
          suffix: slots.suffix,
          label: slots.label,
        }}
      />
    );
  },
});
