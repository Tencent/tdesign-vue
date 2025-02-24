import { defineComponent, PropType, computed } from 'vue';
import { isFunction } from 'lodash-es';
import { useConfig, usePrefixClass } from '../../hooks/useConfig';
import TPanelContent from './PanelContent';
import TExtraContent from './ExtraContent';
import { DateMultipleValue, DateValue, TdDatePickerProps } from '../type';
import { getDefaultFormat, parseToDayjs } from '../../_common/js/date-picker/format';
import useTableData from '../hooks/useTableData';
import useDisableDate from '../hooks/useDisableDate';
import { TdTimePickerProps } from '../../time-picker';
import { parseToDateTime } from '../utils';

export default defineComponent({
  name: 'TSinglePanel',
  props: {
    disableDate: [Object, Array, Function] as PropType<TdDatePickerProps['disableDate']>,
    disableTime: Function as PropType<TdDatePickerProps['disableTime']>,
    mode: {
      type: String as PropType<TdDatePickerProps['mode']>,
      default: 'date',
    },
    format: String as PropType<TdDatePickerProps['format']>,
    presetsPlacement: {
      type: String as PropType<TdDatePickerProps['presetsPlacement']>,
      default: 'bottom',
    },
    value: [String, Number, Array, Date] as PropType<TdDatePickerProps['value']>,
    timePickerProps: Object as PropType<TdDatePickerProps['timePickerProps']>,
    presets: Object as PropType<TdDatePickerProps['presets']>,
    enableTimePicker: Boolean,
    firstDayOfWeek: Number,
    year: Number,
    month: Number,
    time: String,
    popupVisible: Boolean,
    multiple: Boolean,
    onPanelClick: Function,
    onCellClick: Function,
    onCellMouseEnter: Function,
    onCellMouseLeave: Function,
    onJumperClick: Function,
    onConfirmClick: Function,
    onPresetClick: Function,
    onYearChange: Function,
    onMonthChange: Function,
    onTimePickerChange: Function,
  },
  setup(props) {
    const COMPONENT_NAME = usePrefixClass('date-picker__panel');
    const { global } = useConfig('datePicker');

    const { format } = getDefaultFormat({
      mode: props.mode,
      format: props.format,
      enableTimePicker: props.enableTimePicker,
    });

    const disableDateOptions = computed(() => useDisableDate({
      format,
      mode: props.mode,
      disableDate: props.disableDate,
    }));

    const disableTime: TdTimePickerProps['disableTime'] = (h: number, m: number, s: number, ms: number) => {
      if (!isFunction(props.disableTime) || !props.value) {
        return {};
      }

      const value = props.multiple ? Date.now() : (props.value as string | Date | number);
      return props.disableTime(parseToDateTime(value, format, [h, m, s, ms]));
    };

    const tableData = computed(() => useTableData({
      value: props.value,
      year: props.year,
      month: props.month,
      mode: props.mode,
      start: props.value
        ? parseToDayjs(
          props.multiple ? (props.value as DateMultipleValue)[0] : (props.value as DateValue),
          format,
        ).toDate()
        : undefined,
      firstDayOfWeek: props.firstDayOfWeek || global.value.firstDayOfWeek,
      multiple: props.multiple,
      ...disableDateOptions.value,
    }));

    const panelContentProps = computed(() => ({
      format,
      value: props.value,
      mode: props.mode,
      year: props.year,
      month: props.month,
      firstDayOfWeek: props.firstDayOfWeek || global.value.firstDayOfWeek,
      tableData: tableData.value,
      popupVisible: props.popupVisible,
      multiple: props.multiple,
      enableTimePicker: props.enableTimePicker,
      timePickerProps: {
        disableTime,
        ...(props.timePickerProps as TdTimePickerProps),
      },
      time: props.time,
      onMonthChange: props.onMonthChange,
      onYearChange: props.onYearChange,
      onJumperClick: props.onJumperClick,
      onCellClick: props.onCellClick,
      onCellMouseEnter: props.onCellMouseEnter,
      onCellMouseLeave: props.onCellMouseLeave,
      onTimePickerChange: props.onTimePickerChange,
    }));

    const extraProps = computed(() => ({
      presets: props.presets,
      enableTimePicker: props.enableTimePicker,
      presetsPlacement: props.presetsPlacement,
      onPresetClick: props.onPresetClick,
      onConfirmClick: props.onConfirmClick,
      selectedValue: props.value,
    }));

    return { COMPONENT_NAME, panelContentProps, extraProps };
  },

  render() {
    const { COMPONENT_NAME, panelContentProps, extraProps } = this;
    return (
      <div
        class={[
          COMPONENT_NAME,
          {
            [`${COMPONENT_NAME}--direction-row`]: ['left', 'right'].includes(this.presetsPlacement),
          },
        ]}
        onClick={(e: MouseEvent) => this.onPanelClick?.({ e })}
      >
        {['top', 'left'].includes(this.presetsPlacement) ? <TExtraContent {...{ props: extraProps }} /> : null}
        <TPanelContent {...{ props: panelContentProps }} />
        {['bottom', 'right'].includes(this.presetsPlacement) ? <TExtraContent {...{ props: extraProps }} /> : null}
      </div>
    );
  },
});
