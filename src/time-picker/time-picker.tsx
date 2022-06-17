import {
  computed, defineComponent, ref, toRefs, watch,
} from '@vue/composition-api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimeIcon } from 'tdesign-icons-vue';

import TimePickerPanel from './panel/time-picker-panel';
import TSelectInput from '../select-input';
import { formatInputValue, validateInputValue } from '../_common/js/time-picker/utils';

import props from './props';

// hooks
import useVModel from '../hooks/useVModel';
import { useConfig, usePrefixClass } from '../hooks/useConfig';

dayjs.extend(customParseFormat);

export default defineComponent({
  name: 'TTimePicker',

  props: { ...props },

  setup(props) {
    const { classPrefix } = useConfig('classPrefix');
    const componentName = usePrefixClass('time-picker');

    const currentValue = ref('');
    const isShowPanel = ref(false);
    const { global } = useConfig('timePicker');

    const { value } = toRefs(props);
    const [innerValue, setInnerValue] = useVModel(value, props.defaultValue, props.onChange, 'change');

    const inputClasses = computed(() => [
      `${componentName.value}__group`,
      {
        [`${classPrefix.value}-is-focused`]: isShowPanel.value,
      },
    ]);

    const handleShowPopup = (visible: boolean, context: { e: MouseEvent }) => {
      isShowPanel.value = visible;
      visible ? props.onOpen?.(context) : props.onClose?.(context); // trigger on-open and on-close
    };

    const handleClear = (context: { e: MouseEvent }) => {
      const { e } = context;
      e.stopPropagation();
      currentValue.value = null;
      setInnerValue(null);
    };

    const handleInputChange = (value: string) => {
      currentValue.value = value;
    };

    const handleInputBlur = (value: string, { e }: { e: FocusEvent }) => {
      if (props.allowInput) {
        const isValidTime = validateInputValue(currentValue.value, props.format);
        if (isValidTime) {
          setInnerValue(formatInputValue(currentValue.value, props.format));
        }
      }
      props.onBlur?.({ value, e });
    };

    const handleClickConfirm = () => {
      const isValidTime = validateInputValue(currentValue.value, props.format);
      if (isValidTime) setInnerValue(currentValue.value);
      isShowPanel.value = false;
    };

    const handlePanelChange = (v: string) => {
      currentValue.value = v;
    };

    const handleOnFocus = (context: {value: string, e: FocusEvent}) => {
      props.onFocus?.(context);
    };

    watch(
      () => isShowPanel.value,
      () => {
        currentValue.value = isShowPanel.value ? innerValue.value ?? '' : '';
      },
    );

    return {
      handleClickConfirm,
      handlePanelChange,
      handleInputBlur,
      handleInputChange,
      handleClear,
      handleShowPopup,
      handleOnFocus,
      inputClasses,
      componentName,
      innerValue,
      isShowPanel,
      global,
    };
  },
  render() {
    return (
      <div class={this.componentName}>
        <TSelectInput
          onFocus={this.handleOnFocus}
          onClear={this.handleClear}
          disabled={this.disabled}
          clearable={this.clearable}
          allowInput={this.allowInput}
          className={this.inputClasses}
          suffixIcon={() => <TimeIcon />}
          popupVisible={this.isShowPanel}
          onInputChange={this.handleInputChange}
          onBlur={this.handleInputBlur}
          placeholder={!this.innerValue ? this.placeholder || this.global.placeholder : undefined}
          value={this.isShowPanel ? this.currentValue : this.innerValue ?? undefined}
          inputValue={this.isShowPanel ? this.currentValue : this.innerValue ?? undefined}
          inputProps={this.inputProps}
          popupProps={{ overlayStyle: { width: 'auto' }, onVisibleChange: this.handleShowPopup, ...(this.popupProps as object) }}
          panel={() => (
            <TimePickerPanel
              steps={this.steps}
              format={this.format}
              value={this.currentValue}
              isFooterDisplay={true}
              isShowPanel={this.isShowPanel}
              disableTime={this.disableTime}
              {...{
                props: {
                  steps: this.steps,
                  format: this.format,
                  value: this.currentValue,
                  isFooterDisplay: true,
                  isShowPanel: this.isShowPanel,
                  disableTime: this.disableTime,
                  onChange: this.handlePanelChange,
                  hideDisabledTime: this.hideDisabledTime,
                  handleConfirmClick: this.handleClickConfirm,
                },
              }}
            />
          )}
        />
      </div>
    );
  },
});
