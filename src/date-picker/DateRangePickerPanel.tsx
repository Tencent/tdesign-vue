import {
  defineComponent, computed, ref, watch,
} from '@vue/composition-api';
import dayjs from 'dayjs';

import dateRangePickerPanelProps from './date-range-picker-panel-props';
import dateRangePickerProps from './date-range-picker-props';
import {
  DateValue,
  DateRangePickerPartial,
  TdDateRangePickerPanelProps,
  DatePickerYearChangeTrigger,
  DatePickerMonthChangeTrigger,
} from './type';

import TRangePanel from './panel/RangePanel';
import useRangeValue from './hooks/useRangeValue';
import { formatDate, getDefaultFormat, parseToDayjs } from '../_common/js/date-picker/format';
import {
  onDateRangePickerJumperClickSharedFn,
  onDateRangePickerMonthChangeSharedFn,
  onDateRangePickerPresetClickSharedFn,
  onDateRangePickerTimePickerChangeSharedFn,
  onDateRangePickerYearChangeSharedFn,
} from './utils';

export default defineComponent({
  name: 'TDateRangePickerPanel',
  props: {
    value: dateRangePickerProps.value,
    defaultValue: dateRangePickerProps.defaultValue,
    disabled: dateRangePickerProps.disabled,
    disableDate: dateRangePickerProps.disableDate,
    enableTimePicker: dateRangePickerProps.enableTimePicker,
    firstDayOfWeek: dateRangePickerProps.firstDayOfWeek,
    format: dateRangePickerProps.format,
    mode: dateRangePickerProps.mode,
    presets: dateRangePickerProps.presets,
    presetsPlacement: dateRangePickerProps.presetsPlacement,
    timePickerProps: dateRangePickerProps.timePickerProps,
    panelPreselection: dateRangePickerProps.panelPreselection,
    ...dateRangePickerPanelProps,
  },
  setup(props: TdDateRangePickerPanelProps, { emit, attrs }) {
    const {
      value, year, month, time, cacheValue, isFirstValueSelected, onChange,
    } = useRangeValue(props);

    const formatRef = computed(() => getDefaultFormat({
      mode: props.mode,
      enableTimePicker: props.enableTimePicker,
      format: props.format,
    }));

    // 记录面板是否选中过
    const isSelected = ref(false);
    const isHoverCell = ref(false);
    const hoverValue = ref([]);
    const activeIndex = computed(() => (isFirstValueSelected.value ? 1 : 0));

    watch(
      () => value.value,
      (value) => {
        // 确保右侧面板月份比左侧大 避免两侧面板月份一致
        if (value.length === 2 && !props.enableTimePicker) {
          const nextMonth = value.map((v: string) => parseToDayjs(v || new Date(), formatRef.value.format).month());
          if (year.value[0] === year.value[1] && nextMonth[0] === nextMonth[1]) {
            nextMonth[0] === 11 ? (nextMonth[0] -= 1) : (nextMonth[1] += 1);
          }
          month.value = nextMonth;
        }
      },
      { immediate: true },
    );

    // 日期 hover
    function onCellMouseEnter(date: Date) {
      isHoverCell.value = true;
      const nextValue = [...(hoverValue.value as string[])];
      nextValue[activeIndex.value] = formatDate(date, {
        format: formatRef.value.format,
      }) as string;
      hoverValue.value = nextValue;
    }

    // 日期 leave
    function onCellMouseLeave() {
      isHoverCell.value = false;
      hoverValue.value = cacheValue.value as string[];
    }

    // 日期点击
    function onCellClick(date: Date, { e }: { e: MouseEvent }) {
      isHoverCell.value = false;
      isSelected.value = true;

      const nextValue = [...(cacheValue.value as string[])];
      nextValue[activeIndex.value] = formatDate(date, {
        format: formatRef.value.format,
      }) as string;
      cacheValue.value = nextValue;

      props.onCellClick?.({
        e,
        partial: activeIndex.value ? 'end' : 'start',
        date: nextValue.map((v: string) => parseToDayjs(v, formatRef.value.format).toDate()),
      });
      emit('cell-click', {
        e,
        partial: activeIndex.value ? 'end' : 'start',
        date: nextValue.map((v: string) => parseToDayjs(v, formatRef.value.format).toDate()),
      });

      // 有时间选择器走 confirm 逻辑
      if (props.enableTimePicker) return;

      // 首次点击不关闭、确保两端都有有效值并且无时间选择器时点击后自动关闭
      if (nextValue.length === 2 && isFirstValueSelected.value) {
        onChange?.(
          formatDate(nextValue, {
            format: formatRef.value.format,
            autoSwap: true,
          }) as DateValue[],
          {
            dayjsValue: nextValue.map((v) => parseToDayjs(v, formatRef.value.format)),
            trigger: 'pick',
          },
        );
        isFirstValueSelected.value = false;
      } else {
        isFirstValueSelected.value = true;
      }
    }

    // 头部快速切换
    function onJumperClick({
      trigger,
      partial,
    }: {
      trigger: 'prev' | 'current' | 'next';
      partial: DateRangePickerPartial;
    }) {
      const { nextYear, nextMonth, partialIndex } = onDateRangePickerJumperClickSharedFn({
        trigger,
        partial,
        mode: props.mode,
        month,
        year,
      });

      const triggerMap = {
        prev: 'arrow-previous',
        next: 'arrow-next',
      };

      if (year.value.some((y) => !nextYear.includes(y))) {
        props.onYearChange?.({
          partial,
          year: nextYear[partialIndex],
          date: value.value.map((v: string) => dayjs(v).toDate()),
          trigger: trigger === 'current' ? 'today' : (`year-${triggerMap[trigger]}` as DatePickerYearChangeTrigger),
        });
        emit('year-change', {
          partial,
          year: nextYear[partialIndex],
          date: value.value.map((v: string) => dayjs(v).toDate()),
          trigger: trigger === 'current' ? 'today' : (`year-${triggerMap[trigger]}` as DatePickerYearChangeTrigger),
        });
      }
      if (month.value.some((m) => !nextMonth.includes(m))) {
        props.onMonthChange?.({
          partial,
          month: nextMonth[partialIndex],
          date: value.value.map((v: string) => dayjs(v).toDate()),
          trigger: trigger === 'current' ? 'today' : (`month-${triggerMap[trigger]}` as DatePickerMonthChangeTrigger),
        });
        emit('month-change', {
          partial,
          month: nextMonth[partialIndex],
          date: value.value.map((v: string) => dayjs(v).toDate()),
          trigger: trigger === 'current' ? 'today' : (`month-${triggerMap[trigger]}` as DatePickerMonthChangeTrigger),
        });
      }

      year.value = nextYear;
      month.value = nextMonth;
    }

    // time-picker 点击
    function onTimePickerChange(val: string) {
      const { nextTime, nextInputValue, isSelectedInstance } = onDateRangePickerTimePickerChangeSharedFn(
        {
          val,
          activeIndex,
          formatRef,
          year,
          month,
          time,
        },
        cacheValue,
      );

      time.value = nextTime;

      isSelected.value = isSelectedInstance;
      cacheValue.value = formatDate(nextInputValue, {
        format: formatRef.value.format,
      });

      props.onTimeChange?.({
        time: val,
        date: value.value.map((v: string) => dayjs(v).toDate()),
        partial: activeIndex.value ? 'end' : 'start',
        trigger: 'time-hour',
      });
      emit('time-change', {
        time: val,
        date: value.value.map((v: string) => dayjs(v).toDate()),
        partial: activeIndex.value ? 'end' : 'start',
        trigger: 'time-hour',
      });
    }

    // 确定
    function onConfirmClick({ e }: { e: MouseEvent }) {
      const nextValue = [...(cacheValue.value as string[])];

      // 首次点击不关闭、确保两端都有有效值并且无时间选择器时点击后自动关闭
      if (nextValue.length === 2 && isFirstValueSelected.value) {
        onChange?.(
          formatDate(nextValue, {
            format: formatRef.value.format,
            autoSwap: true,
          }) as DateValue[],
          {
            dayjsValue: nextValue.map((v) => parseToDayjs(v, formatRef.value.format)),
            trigger: 'confirm',
          },
        );
        year.value = nextValue.map((v) => dayjs(v, formatRef.value.format).year());
        month.value = nextValue.map((v) => dayjs(v, formatRef.value.format).month());
        isFirstValueSelected.value = false;
      } else {
        isFirstValueSelected.value = true;
      }

      props.onConfirm?.({ date: value.value.map((v: string) => dayjs(v).toDate()), e });
      emit('confirm', { date: value.value.map((v: string) => dayjs(v).toDate()), e });
    }

    // 预设
    function onPresetClick(preset: any, context: any) {
      onDateRangePickerPresetClickSharedFn({
        preset,
        context,
        onChange,
        formatRef,
        onPresetClick: props.onPresetClick,
        emit,
      });
    }

    function onYearChange(nextVal: number, { partial }: { partial: DateRangePickerPartial }) {
      const {
        nextYear, nextMonth, onlyYearSelect, partialIndex,
      } = onDateRangePickerYearChangeSharedFn(nextVal, {
        partial,
        enableTimePicker: props.enableTimePicker,
        activeIndex,
        mode: props.mode,
        month,
        year,
      });

      year.value = nextYear;
      if (!onlyYearSelect) month.value = nextMonth;

      props.onYearChange?.({
        partial,
        year: nextYear[partialIndex],
        date: value.value.map((v: string) => dayjs(v).toDate()),
        trigger: 'year-select',
      });
      emit('year-change', {
        partial,
        year: nextYear[partialIndex],
        date: value.value.map((v: string) => dayjs(v).toDate()),
        trigger: 'year-select',
      });
    }

    function onMonthChange(nextVal: number, { partial }: { partial: DateRangePickerPartial }) {
      const { nextYear, nextMonth, partialIndex } = onDateRangePickerMonthChangeSharedFn(nextVal, {
        partial,
        enableTimePicker: props.enableTimePicker,
        activeIndex,
        mode: props.mode,
        month,
        year,
      });

      year.value = nextYear;
      month.value = nextMonth;

      props.onMonthChange?.({
        partial,
        month: nextMonth[partialIndex],
        date: value.value.map((v: string) => dayjs(v).toDate()),
        trigger: 'month-select',
      });
      emit('month-change', {
        partial,
        month: nextMonth[partialIndex],
        date: value.value.map((v: string) => dayjs(v).toDate()),
        trigger: 'month-select',
      });
    }

    function onPanelClick(context: { e: MouseEvent }) {
      props.onPanelClick?.(context);
      emit('panel-click', context);
    }

    const panelProps = computed(() => ({
      hoverValue: (isHoverCell.value ? hoverValue.value : []) as string[],
      value: (isSelected.value
        ? formatDate(cacheValue.value, { format: formatRef.value.format })
        : value.value) as string[],
      activeIndex: activeIndex.value,
      year: year.value,
      month: month.value,
      mode: props.mode,
      format: formatRef.value.format,
      presets: props.presets,
      time: time.value,
      disableDate: props.disableDate,
      firstDayOfWeek: props.firstDayOfWeek,
      timePickerProps: props.timePickerProps,
      enableTimePicker: props.enableTimePicker,
      presetsPlacement: props.presetsPlacement,
      panelPreselection: props.panelPreselection,
      // 该属性本身主要是联动父组件使用, 单独使用没有特别意义, 不应该暴露为props
      popupVisible: (attrs?.popupVisible as Boolean) ?? true,
      onPanelClick,
      onCellClick,
      onCellMouseEnter,
      onCellMouseLeave,
      onJumperClick,
      onConfirmClick,
      onPresetClick,
      onYearChange,
      onMonthChange,
      onTimePickerChange,
    }));

    return { panelProps };
  },
  render() {
    const { panelProps } = this;
    return <TRangePanel {...{ props: panelProps }} />;
  },
});
