import {
  computed, defineComponent, ref, SetupContext, toRefs,
} from '@vue/composition-api';
import Popup from '../popup';
import props from './props';
import { TdSelectInputProps } from './type';
import useSingle from './useSingle';
import useMultiple from './useMultiple';
import useOverlayInnerStyle from './useOverlayInnerStyle';
import { useConfig } from '../config-provider/useConfig';

export default defineComponent({
  name: 'TSelectInput',

  props: {
    ...props,
    updateScrollTop: {
      type: Function,
    },
  },

  setup(props: TdSelectInputProps, context: SetupContext) {
    const selectInputRef = ref();
    const selectInputWrapRef = ref();
    const { classPrefix } = useConfig('classPrefix');

    const {
      multiple, value, popupVisible, borderless,
    } = toRefs(props);

    const { commonInputProps, onInnerClear, renderSelectSingle } = useSingle(props, context);
    const { renderSelectMultiple } = useMultiple(props, context);
    const { tOverlayInnerStyle, innerPopupVisible, onInnerPopupVisibleChange } = useOverlayInnerStyle(props);

    const popupClasses = computed(() => [
      {
        [`${classPrefix.value}-select-input--borderless`]: borderless.value,
        [`${classPrefix.value}-select-input--multiple`]: multiple.value,
        [`${classPrefix.value}-select-input--popup-visible`]: popupVisible.value ?? innerPopupVisible.value,
        [`${classPrefix.value}-select-input--empty`]: value.value instanceof Array ? !value.value.length : !value.value,
      },
    ]);

    return {
      selectInputWrapRef,
      innerPopupVisible,
      commonInputProps,
      tOverlayInnerStyle,
      selectInputRef,
      popupClasses,
      onInnerClear,
      renderSelectSingle,
      renderSelectMultiple,
      onInnerPopupVisibleChange,
      classPrefix,
    };
  },

  render(h) {
    // 浮层显示的受控与非受控
    const visibleProps = { visible: this.popupVisible ?? this.innerPopupVisible };

    const mainContent = (
      <Popup
        ref="selectInputRef"
        class={this.popupClasses}
        trigger={this.popupProps?.trigger || 'click'}
        placement="bottom-left"
        visible={this.popupVisible ?? this.innerPopupVisible}
        content={this.panel}
        scopedSlots={{ ...this.$scopedSlots, content: this.$scopedSlots.panel }}
        hideEmptyPopup={true}
        key={this.multiple ? 'multiple' : 'single'}
        disabled={this.disabled}
        on={{
          'visible-change': this.onInnerPopupVisibleChange,
        }}
        props={{ ...this.popupProps, overlayInnerStyle: this.tOverlayInnerStyle }}
        updateScrollTop={this.updateScrollTop}
      >
        {this.multiple
          ? this.renderSelectMultiple(
            {
              commonInputProps: this.commonInputProps,
              onInnerClear: this.onInnerClear,
              popupVisible: visibleProps.visible,
            },
            h,
          )
          : this.renderSelectSingle(h, visibleProps.visible)}
      </Popup>
    );

    if (!this.tips) return mainContent;

    return (
      <div ref="selectInputWrapRef" class={`${this.classPrefix}-select-input__wrap`}>
        {mainContent}
        <div class={`${this.classPrefix}-input__tips ${this.classPrefix}-input__tips--${this.status || 'normal'}`}>
          {this.tips}
        </div>
      </div>
    );
  },
});
