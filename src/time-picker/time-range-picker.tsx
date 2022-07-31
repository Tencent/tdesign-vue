import {
  defineComponent, ref, toRefs, watch, computed,
} from '@vue/composition-api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimeIcon } from 'tdesign-icons-vue';

import { RangeInputPopup, RangeInputPosition } from '../range-input';
import TimePickerPanel from './panel/time-picker-panel';

import { TIME_PICKER_EMPTY } from '../_common/js/time-picker/const';
import { formatInputValue, validateInputValue } from '../_common/js/time-picker/utils';

// interfaces
import props from './time-range-picker-props';
import { TimeRangeValue } from './interface';

// hooks
import useVModel from '../hooks/useVModel';
import { useConfig, usePrefixClass } from '../hooks/useConfig';

dayjs.extend(customParseFormat);

export default defineComponent({
  name: 'TTimeRangePicker',

  props: {
    ...props,
    rangeInputProps: Object,
    popupProps: Object,
  },

  setup(props) {
    const componentName = usePrefixClass('time-range-picker');
    const { global } = useConfig('timePicker');
    const { classPrefix } = useConfig('classPrefix');

    const currentPanelIdx = ref(undefined);
    const currentValue = ref<Array<string>>(TIME_PICKER_EMPTY);
    const isShowPanel = ref(false);

    const inputClasses = computed(() => [
      `${componentName.value}__group`,
      {
        [`${classPrefix.value}-is-focused`]: isShowPanel.value,
      },
    ]);
    const { value, format } = toRefs(props);
    const [innerValue, setInnerValue] = useVModel(value, props.defaultValue, props.onChange, 'change');

    const handleShowPopup = (visible: boolean, context: any) => {
      // 输入框点击不关闭面板
      if (context.trigger === 'trigger-element-click') {
        isShowPanel.value = true;
        return;
      }
      isShowPanel.value = visible;
    };

    const handleClear = (context: { e: MouseEvent }) => {
      const { e } = context;
      e.stopPropagation();
      currentValue.value = TIME_PICKER_EMPTY;
      setInnerValue(null);
    };

    const handleClick = ({ position }: { position: 'first' | 'second' }) => {
      currentPanelIdx.value = position === 'first' ? 0 : 1;
    };

    const handleTimeChange = (newValue: string) => {
      if (currentPanelIdx.value === 0) {
        currentValue.value = [newValue, currentValue.value[1] ?? newValue];
      } else {
        currentValue.value = [currentValue.value[0] ?? newValue, newValue];
      }
    };

    const handleInputBlur = (value: TimeRangeValue, { e }: { e: FocusEvent }) => {
      if (props.allowInput) {
        const isValidTime = validateInputValue(currentValue.value[currentPanelIdx.value], format.value);
        if (isValidTime) {
          const formattedVal = formatInputValue(currentValue.value[currentPanelIdx.value], format.value);
          currentPanelIdx.value === 0
            ? (currentValue.value = [formattedVal, currentValue.value[1] ?? formattedVal])
            : (currentValue.value = [currentValue.value[0] ?? formattedVal, formattedVal]);
        }
      }
      props.onBlur?.({ value, e });
    };

    const handleInputChange = (
      inputVal: TimeRangeValue,
      { e, position }: { e: InputEvent; position: RangeInputPosition },
    ) => {
      currentValue.value = inputVal;
      props.onInput?.({ value: innerValue.value, e, position: position === 'first' ? 'start' : 'end' });
    };

    const handleClickConfirm = () => {
      const isValidTime = !currentValue.value.find((v) => !validateInputValue(v, format.value));
      if (isValidTime) setInnerValue(currentValue.value);
      isShowPanel.value = false;
    };

    const handleFocus = (value: TimeRangeValue, { e, position }: { e: FocusEvent; position: RangeInputPosition }) => {
      props.onFocus?.({ value, e, position: position === 'first' ? 'start' : 'end' });
    };

    watch(
      () => isShowPanel.value,
      () => {
        currentValue.value = isShowPanel.value ? innerValue.value ?? TIME_PICKER_EMPTY : TIME_PICKER_EMPTY;
        if (!isShowPanel.value) currentPanelIdx.value = undefined;
      },
    );
    return {
      global,
      componentName,
      currentValue,
      currentPanelIdx,
      inputClasses,
      innerValue,
      isShowPanel,
      handleInputChange,
      handleShowPopup,
      handleClear,
      handleFocus,
      handleClickConfirm,
      handleClick,
      handleInputBlur,
      handleTimeChange,
    };
  },
  render() {
    return (
      <div class={this.componentName}>
        <RangeInputPopup
          {...{
            props: {
              onInputChange: this.handleInputChange,
              disabled: this.disabled,
              popupVisible: this.isShowPanel,
              inputValue: this.isShowPanel ? this.currentValue : this.innerValue ?? TIME_PICKER_EMPTY,
              popupProps: {
                overlayStyle: {
                  width: 'auto',
                },
                onVisibleChange: this.handleShowPopup,
                ...this.popupProps,
              },
              rangeInputProps: {
                size: this.size,
                clearable: this.clearable,
                class: this.inputClasses,
                // value: this.isShowPanel ? this.currentValue : this.innerValue ?? undefined,
                placeholder: this.placeholder || [this.global.placeholder, this.global.placeholder],
                suffixIcon: () => <TimeIcon />,
                onClear: this.handleClear,
                onClick: this.handleClick,
                onFocus: this.handleFocus,
                onBlur: this.handleInputBlur,
                readonly: !this.allowInput,
                activeIndex: this.currentPanelIdx,
                ...this.rangeInputProps,
              },
              panel: () => (
                <TimePickerPanel
                  {...{
                    props: {
                      steps: this.steps,
                      format: this.format,
                      isShowPanel: this.isShowPanel,
                      disableTime: this.disableTime,
                      hideDisabledTime: this.hideDisabledTime,
                      isFooterDisplay: true,
                      value: this.currentValue[this.currentPanelIdx || 0],
                      onChange: this.handleTimeChange,
                      handleConfirmClick: this.handleClickConfirm,
                      position: this.currentPanelIdx === 0 ? 'start' : 'end',
                    },
                  }}
                />
              ),
            },
          }}
        />
      </div>
    );
  },
});
