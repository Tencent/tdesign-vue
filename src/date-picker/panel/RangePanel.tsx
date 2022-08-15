import { defineComponent, PropType, computed } from '@vue/composition-api';
import { useConfig, usePrefixClass } from '../../hooks/useConfig';
import TPanelContent from './PanelContent';
import TExtraContent from './ExtraContent';
import { TdDateRangePickerProps } from '../type';
import { getDefaultFormat, parseToDayjs } from '../hooks/useFormat';
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
    panelPreselection: Boolean,
    hidePreselection: {
      type: Boolean,
      defaultValue: true,
    },
    popupVisible: Boolean,
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

    const { format } = getDefaultFormat({
      mode: props.mode,
      format: props.format,
      enableTimePicker: props.enableTimePicker,
    });

    // 是否隐藏预选状态,只有 value 有值的时候需要隐藏
    const hidePreselection = !props.panelPreselection && props.value.length === 2;

    const disableDateOptions = computed(() => useDisableDate({
      format,
      mode: props.mode,
      disableDate: props.disableDate,
      start:
          props.isFirstValueSelected && props.activeIndex === 1
            ? new Date(parseToDayjs(props.value[0], format, 'start').toDate().setHours(0, 0, 0))
            : undefined,
      end:
          props.isFirstValueSelected && props.activeIndex === 0
            ? new Date(parseToDayjs(props.value[1], format).toDate().setHours(23, 59, 59))
            : undefined,
    }));

    const startTableData = computed(() => useTableData({
      isRange: true,
      start: props.value[0] ? parseToDayjs(props.value[0] as string, format).toDate() : undefined,
      end: props.value[1] ? parseToDayjs(props.value[1] as string, format).toDate() : undefined,
      hoverStart:
          !hidePreselection && props.hoverValue[0]
            ? parseToDayjs(props.hoverValue[0] as string, format).toDate()
            : undefined,
      hoverEnd:
          !hidePreselection && props.hoverValue[1]
            ? parseToDayjs(props.hoverValue[1] as string, format).toDate()
            : undefined,
      year: props.year[0],
      month: props.month[0],
      mode: props.mode,
      firstDayOfWeek: props.firstDayOfWeek || global.value.firstDayOfWeek,
      ...disableDateOptions.value,
    }));

    const endTableData = computed(() => useTableData({
      isRange: true,
      start: props.value[0] ? parseToDayjs(props.value[0] as string, format).toDate() : undefined,
      end: props.value[1] ? parseToDayjs(props.value[1] as string, format).toDate() : undefined,
      hoverStart:
          !hidePreselection && props.hoverValue[0]
            ? parseToDayjs(props.hoverValue[0] as string, format).toDate()
            : undefined,
      hoverEnd:
          !hidePreselection && props.hoverValue[1]
            ? parseToDayjs(props.hoverValue[1] as string, format).toDate()
            : undefined,
      year: props.year[1],
      month: props.month[1],
      mode: props.mode,
      firstDayOfWeek: props.firstDayOfWeek || global.value.firstDayOfWeek,
      ...disableDateOptions.value,
    }));

    const panelContentProps = computed(() => ({
      format,
      mode: props.mode,
      firstDayOfWeek: props.firstDayOfWeek || global.value.firstDayOfWeek,

      popupVisible: props.popupVisible,
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
      COMPONENT_NAME,
      startTableData,
      endTableData,
      panelContentProps,
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
            {...{
              props: {
                presets: this.presets,
                selectedValue: this.value[this.activeIndex],
                enableTimePicker: this.enableTimePicker,
                onPresetClick: this.onPresetClick,
                onConfirmClick: this.onConfirmClick,
                presetsPlacement: this.presetsPlacement,
              },
            }}
          />
        ) : null}
        <div class={`${COMPONENT_NAME}-content-wrapper`}>
          {!this.enableTimePicker ? (
            [
              <TPanelContent
                key="startPanel"
                {...{
                  props: {
                    partial: 'start',
                    year: this.year[0],
                    month: this.month[0],
                    time: this.time[0],
                    value: this.value,
                    tableData: startTableData,
                    ...panelContentProps,
                  },
                }}
              />,
              <TPanelContent
                key="endPanel"
                {...{
                  props: {
                    partial: 'end',
                    year: this.year[1],
                    month: this.month[1],
                    time: this.time[1],
                    value: this.value,
                    tableData: endTableData,
                    ...panelContentProps,
                  },
                }}
              />,
            ]
          ) : (
            <TPanelContent
              key="start"
              {...{
                props: {
                  partial: this.activeIndex ? 'end' : 'start',
                  year: this.activeIndex ? this.year[1] : this.year[0],
                  month: this.activeIndex ? this.month[1] : this.month[0],
                  time: this.activeIndex ? this.time[1] : this.time[0],
                  value: this.value,
                  tableData: this.activeIndex ? endTableData : startTableData,
                  ...panelContentProps,
                },
              }}
            />
          )}
        </div>
        {['bottom', 'right'].includes(this.presetsPlacement) ? (
          <TExtraContent
            {...{
              props: {
                presets: this.presets,
                selectedValue: this.value[this.activeIndex],
                enableTimePicker: this.enableTimePicker,
                onPresetClick: this.onPresetClick,
                onConfirmClick: this.onConfirmClick,
                presetsPlacement: this.presetsPlacement,
              },
            }}
          />
        ) : null}
      </div>
    );
  },
});
