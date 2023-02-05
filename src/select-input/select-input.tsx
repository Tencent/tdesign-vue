import {
  computed, defineComponent, ref, SetupContext, toRefs,
} from '@vue/composition-api';
import Popup, { PopupVisibleChangeContext } from '../popup';
import props from './props';
import { TdSelectInputProps } from './type';
import useSingle from './useSingle';
import useMultiple from './useMultiple';
import useOverlayInnerStyle from './useOverlayInnerStyle';
import { useConfig } from '../config-provider/useConfig';
import { renderTNodeJSX } from '../utils/render-tnode';

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
    const { classPrefix } = useConfig('classPrefix');

    const {
      multiple, value, popupVisible, borderless,
    } = toRefs(props);

    const {
      commonInputProps, singleInputValue, onInnerClear, renderSelectSingle,
    } = useSingle(props, context);
    const { multipleInputValue, renderSelectMultiple } = useMultiple(props, context);
    const { tOverlayInnerStyle, innerPopupVisible, onInnerPopupVisibleChange } = useOverlayInnerStyle(props, {
      afterHidePopup: onInnerBlur,
    });

    // SelectInput.blur is not equal to Input or TagInput, example: click popup panel.
    // if trigger blur on click popup panel, filter data of tree select can not be checked.
    function onInnerBlur(ctx: PopupVisibleChangeContext) {
      const inputValue = props.multiple ? multipleInputValue.value : singleInputValue.value;
      const params: Parameters<TdSelectInputProps['onBlur']>[1] = { e: ctx.e, inputValue };
      props.onBlur?.(props.value, params);
      context.emit('blur', props.value, params);
    }

    const classes = computed(() => [
      `${classPrefix.value}-select-input`,
      {
        [`${classPrefix.value}-select-input--borderless`]: borderless.value,
        [`${classPrefix.value}-select-input--multiple`]: multiple.value,
        [`${classPrefix.value}-select-input--popup-visible`]: popupVisible.value ?? innerPopupVisible.value,
        [`${classPrefix.value}-select-input--empty`]: value.value instanceof Array ? !value.value.length : !value.value,
      },
    ]);

    return {
      selectInputRef,
      innerPopupVisible,
      commonInputProps,
      tOverlayInnerStyle,
      classes,
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
        ref="selectInputPopupRef"
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

    const tipsNode = renderTNodeJSX(this, 'tips');
    return (
      <div ref="selectInputRef" class={this.classes}>
        {mainContent}
        {tipsNode && (
          <div class={`${this.classPrefix}-input__tips ${this.classPrefix}-input__tips--${this.status || 'normal'}`}>
            {tipsNode}
          </div>
        )}
      </div>
    );
  },
});
