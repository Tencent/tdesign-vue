import {
  computed, defineComponent, ref, SetupContext, toRefs,
} from '@vue/composition-api';
import Popup from '../popup';
import { prefix } from '../config';
import props from './props';
import { TdSelectInputProps } from './type';
import useSingle from './useSingle';
import useMultiple from './useMultiple';
import useOverlayStyle from './useOverlayStyle';

const BASE_CLASS_BORDERLESS = `${prefix}-select-input--borderless`;
const BASE_CLASS_MULTIPLE = `${prefix}-select-input--multiple`;
const BASE_CLASS_POPUP_VISIBLE = `${prefix}-select-input--popup-visible`;
const BASE_CLASS_EMPTY = `${prefix}-select-input--empty`;

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
    const {
      multiple, value, popupVisible, borderless,
    } = toRefs(props);

    const { commonInputProps, onInnerClear, renderSelectSingle } = useSingle(props, context);
    const { renderSelectMultiple } = useMultiple(props, context);
    const { tOverlayStyle, innerPopupVisible, onInnerPopupVisibleChange } = useOverlayStyle(props);

    const popupClasses = computed(() => [
      {
        [BASE_CLASS_BORDERLESS]: borderless.value,
        [BASE_CLASS_MULTIPLE]: multiple.value,
        [BASE_CLASS_POPUP_VISIBLE]: popupVisible.value ?? innerPopupVisible.value,
        [BASE_CLASS_EMPTY]: value.value instanceof Array ? !value.value.length : !value.value,
      },
    ]);

    return {
      selectInputWrapRef,
      innerPopupVisible,
      commonInputProps,
      tOverlayStyle,
      selectInputRef,
      popupClasses,
      onInnerClear,
      renderSelectSingle,
      renderSelectMultiple,
      onInnerPopupVisibleChange,
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
        disabled={this.disabled}
        on={{
          'visible-change': this.onInnerPopupVisibleChange,
        }}
        props={{ ...this.popupProps, overlayStyle: this.tOverlayStyle }}
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
      <div ref="selectInputWrapRef" class={`${prefix}-select-input__wrap`}>
        {mainContent}
        <div class={`${prefix}-input__tips ${prefix}-input__tips--${this.status || 'normal'}`}>{this.tips}</div>
      </div>
    );
  },
});
