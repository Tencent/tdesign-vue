import {
  computed, defineComponent, ref, toRefs, watch,
} from '@vue/composition-api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimeIcon } from 'tdesign-icons-vue';

import TimePickerPanel from './panel/time-picker-panel';
import TSelectInput from '../select-input';
import { formatInputValue, validateInputValue } from '../_common/js/time-picker/utils';

// hooks
import useVModel from '../hooks/useVModel';
import { useConfig, usePrefixClass } from '../hooks/useConfig';

import props from './props';

dayjs.extend(customParseFormat);

export default defineComponent({
  name: 'TTimePicker',
  props: { ...props },
  setup(props, ctx) {
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
      if (visible) {
        props.onOpen?.(context);
        ctx.emit('open', context);
      } else {
        props.onClose?.(context);
        ctx.emit('close', context);
      }
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
      ctx.emit('blur', { value, e });
    };

    const handleClickConfirm = () => {
      const isValidTime = validateInputValue(currentValue.value, props.format);
      if (isValidTime) setInnerValue(currentValue.value);
      isShowPanel.value = false;
    };

    const handlePanelChange = (v: string) => {
      currentValue.value = v;
    };

    const handleOnFocus = (context: { value: string; e: FocusEvent }) => {
      props.onFocus?.(context);
      ctx.emit('focus', context);
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
      currentValue,
    };
  },
  render() {
    return (
      <div class={this.componentName}>
        <TSelectInput
          {...{
            props: {
              onFocus: this.handleOnFocus,
              onClear: this.handleClear,
              onBlur: this.handleInputBlur,
              onInputChange: this.handleInputChange,
              disabled: this.disabled,
              clearable: this.clearable,
              allowInput: this.allowInput,
              class: this.inputClasses,
              suffixIcon: () => <TimeIcon />,
              popupVisible: this.isShowPanel,
              placeholder: !this.innerValue ? this.placeholder || this.global.placeholder : undefined,
              value: this.isShowPanel ? this.currentValue : this.innerValue ?? undefined,
              inputValue: this.isShowPanel ? this.currentValue : this.innerValue ?? undefined,
              inputProps: this.inputProps,
              panel: () => (
                <TimePickerPanel
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
              ),
              popupProps: {
                overlayStyle: { width: 'auto' },
                onVisibleChange: this.handleShowPopup,
                ...(this.popupProps as object),
              },
            },
          }}
        />
      </div>
    );
  },
});
