import { defineComponent, PropType, computed } from '@vue/composition-api';
import dayjs from 'dayjs';
import { usePrefixClass } from '../../hooks/useConfig';
import type { TdDatePickerProps } from '../type';

import TDateHeader from '../base/Header';
import TDateTable from '../base/Table';
import TTimePickerPanel from '../../time-picker/panel/time-picker-panel';
import { getDefaultFormat } from '../hooks/useFormat';

export default defineComponent({
  name: 'TPanelContent',
  props: {
    mode: String as PropType<TdDatePickerProps['mode']>,
    format: String as PropType<TdDatePickerProps['format']>,
    enableTimePicker: Boolean as PropType<TdDatePickerProps['enableTimePicker']>,
    timePickerProps: {
      type: Object as PropType<TdDatePickerProps['timePickerProps']>,
      default: () => ({}),
    },
    value: [String, Number, Array, Date],
    year: Number,
    month: Number,
    tableData: Array,
    time: String,
    popupVisible: Boolean,
    firstDayOfWeek: Number,
    partial: String,
    onYearChange: Function,
    onMonthChange: Function,
    onJumperClick: Function,
    onCellMouseEnter: Function,
    onCellClick: Function,
    onCellMouseLeave: Function,
    onTimePickerChange: Function,
  },
  setup(props) {
    const COMPONENT_NAME = usePrefixClass('date-picker__panel');

    const { timeFormat } = getDefaultFormat({
      mode: props.mode,
      format: props.format,
      enableTimePicker: props.enableTimePicker,
    });

    const defaultTimeValue = computed(() => dayjs().format(timeFormat));

    return { COMPONENT_NAME, defaultTimeValue, timeFormat };
  },
  render() {
    const { COMPONENT_NAME, defaultTimeValue, timeFormat } = this;

    return (
      <div class={`${COMPONENT_NAME}-content`}>
        <div class={`${COMPONENT_NAME}-${this.mode}`}>
          <TDateHeader
            {...{
              props: {
                mode: this.mode,
                year: this.year,
                month: this.month,
                onMonthChange: (val: number) => this.onMonthChange?.(val, { partial: this.partial }),
                onYearChange: (val: number) => this.onYearChange?.(val, { partial: this.partial }),
                onJumperClick: ({ trigger }: { trigger: string }) => this.onJumperClick?.({ trigger, partial: this.partial }),
              },
            }}
          />

          <TDateTable
            {...{
              props: {
                mode: this.mode,
                data: this.tableData,
                time: this.time,
                value: this.value,
                format: this.format,
                firstDayOfWeek: this.firstDayOfWeek,
                onCellClick: (date: Date, { e }: { e: MouseEvent }) => this.onCellClick?.(date, { e, partial: this.partial }),
                onCellMouseEnter: (date: Date) => this.onCellMouseEnter?.(date, { partial: this.partial }),
                onCellMouseLeave: this.onCellMouseLeave,
              },
            }}
          />
        </div>

        {this.enableTimePicker && (
          <div class={`${COMPONENT_NAME}-time`}>
            <div class={`${COMPONENT_NAME}-time-viewer`}>{this.time || defaultTimeValue}</div>
            <TTimePickerPanel
              {...{
                key: this.partial,
                props: {
                  format: timeFormat,
                  value: this.time,
                  onChange: this.onTimePickerChange,
                  isShowPanel: this.popupVisible,
                  ...this.timePickerProps,
                },
              }}
            />
          </div>
        )}
      </div>
    );
  },
});
