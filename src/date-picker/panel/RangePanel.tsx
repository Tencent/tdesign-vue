import { defineComponent, PropType, computed } from '@vue/composition-api';
import dayjs from 'dayjs';
import { useConfig, usePrefixClass } from '../../hooks/useConfig';
import TPanelContent from './PanelContent';
import TExtraContent from './ExtraContent';
import { TdDateRangePickerProps } from '../type';
import useTableData from '../hooks/useTableData';
import useDisableDate from '../hooks/useDisableDate';

export default defineComponent({
  name: 'TRangePanel',
  props: {
    hoverValue: Array as PropType<Array<string>>,
    activeIndex: Number,
    isFirstValueSelected: Boolean,
    disableDate: [Object, Array, Function] as PropType<TdDateRangePickerProps['disableDate']>,
    mode: {
      type: String as PropType<TdDateRangePickerProps['mode']>,
      default: 'date',
    },
    format: String as PropType<TdDateRangePickerProps['format']>,
    presetsPlacement: {
      type: String as PropType<TdDateRangePickerProps['presetsPlacement']>,
      default: 'bottom',
    },
    value: Array as PropType<Array<string>>,
    timePickerProps: Object as PropType<TdDateRangePickerProps['timePickerProps']>,
    presets: Object as PropType<TdDateRangePickerProps['presets']>,
    enableTimePicker: Boolean,
    firstDayOfWeek: Number,
    year: Array as PropType<Array<number>>,
    month: Array as PropType<Array<number>>,
    time: Array as PropType<Array<string>>,
    onClick: Function,
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
    const COMPONENT_NAME = usePrefixClass('date-range-picker__panel');
    const { global } = useConfig('datePicker');

    const disableDateOptions = computed(() => useDisableDate({
      mode: props.mode,
      format: props.format,
      disableDate: props.disableDate,
      start:
          props.isFirstValueSelected && props.activeIndex === 1 ? dayjs(props.value[0] as string).toDate() : undefined,
      end:
          props.isFirstValueSelected && props.activeIndex === 0 ? dayjs(props.value[1] as string).toDate() : undefined,
    }));

    const startTableData = computed(() => useTableData({
      isRange: true,
      start: props.value[0] ? dayjs(props.value[0] as string).toDate() : undefined,
      end: props.value[1] ? dayjs(props.value[1] as string).toDate() : undefined,
      hoverStart: props.hoverValue[0] ? dayjs(props.hoverValue[0] as string).toDate() : undefined,
      hoverEnd: props.hoverValue[1] ? dayjs(props.hoverValue[1] as string).toDate() : undefined,
      year: props.year[0],
      month: props.month[0],
      mode: props.mode,
      firstDayOfWeek: props.firstDayOfWeek || global.value.firstDayOfWeek,
      ...disableDateOptions.value,
    }));

    const endTableData = computed(() => useTableData({
      isRange: true,
      start: props.value[0] ? dayjs(props.value[0] as string).toDate() : undefined,
      end: props.value[1] ? dayjs(props.value[1] as string).toDate() : undefined,
      hoverStart: props.hoverValue[0] ? dayjs(props.hoverValue[0] as string).toDate() : undefined,
      hoverEnd: props.hoverValue[1] ? dayjs(props.hoverValue[1] as string).toDate() : undefined,
      year: props.year[1],
      month: props.month[1],
      mode: props.mode,
      firstDayOfWeek: props.firstDayOfWeek || global.value.firstDayOfWeek,
      ...disableDateOptions.value,
    }));

    const panelContentProps = computed(() => ({
      mode: props.mode,
      format: props.format,
      firstDayOfWeek: props.firstDayOfWeek || global.value.firstDayOfWeek,

      enableTimePicker: props.enableTimePicker,
      timePickerProps: props.timePickerProps,
      onMonthChange: props.onMonthChange,
      onYearChange: props.onYearChange,
      onJumperClick: props.onJumperClick,
      onCellClick: props.onCellClick,
      onCellMouseEnter: props.onCellMouseEnter,
      onCellMouseLeave: props.onCellMouseLeave,
      onTimePickerChange: props.onTimePickerChange,
    }));

    return {
      COMPONENT_NAME, startTableData, endTableData, panelContentProps,
    };
  },
  render() {
    const {
      COMPONENT_NAME, startTableData, endTableData, panelContentProps,
    } = this;
    return (
      <div
        class={[
          COMPONENT_NAME,
          {
            [`${COMPONENT_NAME}--direction-row`]: ['left', 'right'].includes(this.presetsPlacement),
          },
        ]}
        onClick={(e: MouseEvent) => this.onClick?.({ e })}
      >
        {['top', 'left'].includes(this.presetsPlacement) ? (
          <TExtraContent
            presets={this.presets}
            selectedValue={this.value[this.activeIndex]}
            enableTimePicker={this.enableTimePicker}
            onPresetClick={this.onPresetClick}
            onConfirmClick={this.onConfirmClick}
            presetsPlacement={this.presetsPlacement}
          />
        ) : null}
        <div class={`${COMPONENT_NAME}--content-wrapper`}>
          {!this.enableTimePicker ? (
            [
              <TPanelContent
                key="startPanel"
                partial="start"
                year={this.year[0]}
                month={this.month[0]}
                time={this.time[0]}
                tableData={startTableData}
                {...panelContentProps}
              />,
              <TPanelContent
                key="endPanel"
                partial="end"
                year={this.year[1]}
                month={this.month[1]}
                time={this.time[1]}
                tableData={endTableData}
                {...panelContentProps}
              />,
            ]
          ) : (
            <TPanelContent
              key="start"
              partial={this.activeIndex ? 'end' : 'start'}
              year={this.activeIndex ? this.year[1] : this.year[0]}
              month={this.activeIndex ? this.month[1] : this.month[0]}
              time={this.activeIndex ? this.time[1] : this.time[0]}
              tableData={this.activeIndex ? endTableData : startTableData}
              {...panelContentProps}
            />
          )}
        </div>
        {['bottom', 'right'].includes(this.presetsPlacement) ? (
          <TExtraContent
            presets={this.presets}
            selectedValue={this.value[this.activeIndex]}
            enableTimePicker={this.enableTimePicker}
            onPresetClick={this.onPresetClick}
            onConfirmClick={this.onConfirmClick}
            presetsPlacement={this.presetsPlacement}
          />
        ) : null}
      </div>
    );
  },
});
