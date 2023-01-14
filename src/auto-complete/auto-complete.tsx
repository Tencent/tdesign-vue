import {
  computed, ref, defineComponent, toRefs, nextTick,
} from '@vue/composition-api';
import props from './props';
import { TdAutoCompleteProps } from './type';
import Input, { InputProps, TdInputProps } from '../input';
import Popup, { PopupProps } from '../popup';
import useCommonClassName from '../hooks/useCommonClassName';
import AutoCompleteOptionList from './option-list';
import useVModel from '../hooks/useVModel';
import { useConfig } from '../config-provider/useConfig';
import { ClassName } from '../common';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';

export default defineComponent({
  name: 'TAutoComplete',

  props,

  setup(props: TdAutoCompleteProps, { emit }) {
    const { value } = toRefs(props);
    const [tValue, setTValue] = useVModel(value, props.defaultValue, props.onChange);
    const { classPrefix, sizeClassNames } = useCommonClassName();
    const { global } = useConfig('input');

    const popupVisible = ref();
    const optionListRef = ref();

    const getOverlayStyle = (trigger: HTMLElement, popupElement: HTMLElement) => {
      const triggerWidth = trigger.getBoundingClientRect().width || trigger.offsetWidth || trigger.clientWidth;
      const popupWidth = popupElement.getBoundingClientRect().width || popupElement.offsetWidth || popupElement.clientWidth;
      return {
        width: triggerWidth >= popupWidth ? `${triggerWidth}px` : 'auto',
        ...props.popupProps?.overlayInnerStyle,
      };
    };

    const classes = computed(() => [`${classPrefix.value}-auto-complete`]);
    const popupClasses = computed(() => {
      let classes: ClassName = [`${classPrefix.value}-select__dropdown`];
      if (props.popupProps?.overlayClassName) {
        classes = classes.concat(props.popupProps.overlayClassName);
      }
      return classes;
    });
    const popupInnerClasses = computed(() => {
      let classes: ClassName = [`${classPrefix.value}-select__dropdown-inner`];
      if (props.popupProps?.overlayInnerClassName) {
        classes = classes.concat(props.popupProps.overlayInnerClassName);
      }
      return classes;
    });

    const onInputChange: TdInputProps['onChange'] = (value, context) => {
      setTValue(value, context);
    };

    const innerInputProps = computed(() => {
      const tProps: InputProps = {
        value: tValue.value,
        size: props.size,
        ...props.inputProps,
      };
      return tProps;
    });

    const onInnerFocus: InputProps['onFocus'] = (value, context) => {
      popupVisible.value = true;
      emit('focus', { ...context, value });
      props.onFocus?.({ ...context, value });
      nextTick(() => {
        optionListRef.value?.addKeyboardListener();
      });
    };

    const onInnerBlur: InputProps['onBlur'] = (value, context) => {
      emit('blur', { ...context, value });
      props.onBlur?.({ ...context, value });
    };

    const onInnerCompositionend: InputProps['onCompositionend'] = (value, context) => {
      emit('compositionend', { ...context, value });
      props.onCompositionend?.({ ...context, value });
    };

    const onInnerCompositionstart: InputProps['onCompositionstart'] = (value, context) => {
      emit('compositionstart', { ...context, value });
      props.onCompositionstart?.({ ...context, value });
    };

    const onInnerEnter: InputProps['onEnter'] = (value, context) => {
      emit('enter', { ...context, value });
      props.onEnter?.({ ...context, value });
    };

    const onInnerClear: InputProps['onClear'] = (context) => {
      emit('clear', context);
      props.onClear?.(context);
    };

    const inputListeners = computed(() => ({
      change: onInputChange,
      focus: onInnerFocus,
      blur: onInnerBlur,
      compositionend: onInnerCompositionend,
      compositionstart: onInnerCompositionstart,
      enter: onInnerEnter,
      clear: onInnerClear,
    }));

    const onInnerSelect: TdAutoCompleteProps['onSelect'] = (value, context) => {
      if (props.readonly || props.disabled) return;
      popupVisible.value = false;
      setTValue(value, context);
      emit('select', value, context);
      props.onSelect?.(value, context);
    };

    const onPopupVisibleChange: PopupProps['onVisibleChange'] = (visible, { trigger }) => {
      if (trigger !== 'trigger-element-click') {
        popupVisible.value = visible;
      }
    };

    return {
      global,
      classes,
      classPrefix,
      popupClasses,
      popupInnerClasses,
      sizeClassNames,
      innerInputProps,
      inputListeners,
      tValue,
      popupVisible,
      optionListRef,
      onPopupVisibleChange,
      getOverlayStyle,
      onInnerSelect,
    };
  },

  render() {
    // 触发元素
    const triggerNode = renderContent(this, 'default', 'triggerElement') || (
      <Input
        placeholder={this.placeholder ?? this.global.placeholder}
        on={this.inputListeners}
        tips={this.tips}
        status={this.status}
        readonly={this.readonly}
        disabled={this.disabled}
        autofocus={this.autofocus}
        clearable={this.clearable}
        props={this.innerInputProps}
        scopedSlots={this.$scopedSlots}
      />
    );
    // 联想词列表
    const listContent = (
      <AutoCompleteOptionList
        ref="optionListRef"
        value={this.tValue}
        options={this.options}
        size={this.size}
        sizeClassNames={this.sizeClassNames}
        onSelect={this.onInnerSelect}
        popupVisible={this.popupVisible}
        highlightKeyword={this.highlightKeyword}
        filterable={this.filterable}
        filter={this.filter}
        scopedSlots={{
          option: this.$scopedSlots.option,
        }}
      />
    );
    const topContent = renderTNodeJSX(this, 'panelTopContent');
    const bottomContent = renderTNodeJSX(this, 'panelBottomContent');
    const panelContent = topContent || this.options?.length || bottomContent ? (
        <div class={`${this.classPrefix}-autocomplete__panel`}>
          {topContent}
          {listContent}
          {bottomContent}
        </div>
    ) : null;
    const popupProps = {
      ...this.popupProps,
      overlayInnerStyle: this.getOverlayStyle,
      overlayInnerClassName: this.popupInnerClasses,
      overlayClassName: this.popupClasses,
    };
    return (
      <div class={this.classes}>
        {panelContent && (
          <Popup
            visible={this.popupVisible}
            on={{ 'visible-change': this.onPopupVisibleChange }}
            trigger="focus"
            placement="bottom-left"
            hideEmptyPopup={true}
            content={panelContent ? () => panelContent : null}
            props={popupProps}
          >
            {triggerNode}
          </Popup>
        )}
        {!panelContent && triggerNode}
      </div>
    );
  },
});
