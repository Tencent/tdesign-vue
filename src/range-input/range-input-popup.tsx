import { defineComponent, computed } from '@vue/composition-api';
import Popup from '../popup';
import { usePrefixClass } from '../hooks/useConfig';
import RangeInput from './range-input';
import props from './range-input-popup-props';
import useOverlayStyle from '../select-input/useOverlayStyle';

export default defineComponent({
  name: 'TRangeInputPopup',
  props,

  setup(props) {
    const COMPONENT_NAME = usePrefixClass('range-input-popup');

    const { tOverlayStyle, innerPopupVisible, onInnerPopupVisibleChange } = useOverlayStyle(props);

    const popupClasses = computed(() => [
      COMPONENT_NAME.value,
      {
        [`${COMPONENT_NAME.value}--visible`]: props.popupVisible || innerPopupVisible.value,
      },
    ]);

    return {
      COMPONENT_NAME,
      tOverlayStyle,
      innerPopupVisible,
      onInnerPopupVisibleChange,
      popupClasses,
    };
  },

  render() {
    const {
      tOverlayStyle, innerPopupVisible, onInnerPopupVisibleChange, popupClasses,
    } = this;

    return (
      <div class={popupClasses}>
        <Popup
          hideEmptyPopup
          content={this.panel}
          trigger="click"
          placement="bottom-left"
          visible={this.popupVisible || innerPopupVisible}
          {...{
            props: {
              disabled: this.disabled,
              overlayStyle: tOverlayStyle,
              onVisibleChange: onInnerPopupVisibleChange,
              ...(this.popupProps as Object),
            },
          }}
        >
          <RangeInput
            {...{
              props: {
                value: this.inputValue,
                onChange: this.onInputChange,
                disabled: this.disabled,
                ...(this.rangeInputProps as Object),
              },
            }}
          />
        </Popup>
      </div>
    );
  },
});
