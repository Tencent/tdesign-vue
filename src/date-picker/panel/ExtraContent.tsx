import { defineComponent, PropType, computed } from '@vue/composition-api';
import TDateFooter from '../base/Footer';
import type { TdDatePickerProps, TdDateRangePickerProps, DateValue } from '../type';

export default defineComponent({
  name: 'TExtraContent',
  props: {
    presets: Object as PropType<TdDatePickerProps['presets'] | TdDateRangePickerProps['presets']>,
    enableTimePicker: Boolean as PropType<TdDatePickerProps['enableTimePicker']>,
    presetsPlacement: String as PropType<TdDatePickerProps['presetsPlacement']>,
    onPresetClick: Function,
    onConfirmClick: Function,
    selectedValue: String as PropType<DateValue>,
  },
  setup(props) {
    const showPanelFooter = computed(() => props.enableTimePicker || props.presets);
    return { showPanelFooter };
  },
  render() {
    const { showPanelFooter } = this;

    return showPanelFooter ? (
      <TDateFooter
        {...{
          props: {
            presets: this.presets,
            onPresetClick: this.onPresetClick,
            enableTimePicker: this.enableTimePicker,
            onConfirmClick: this.onConfirmClick,
            presetsPlacement: this.presetsPlacement,
            selectedValue: this.selectedValue,
          },
        }}
      />
    ) : null;
  },
});
