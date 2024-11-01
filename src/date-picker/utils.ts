// 用于头部日期切换修正
import { ComputedRef } from '@vue/composition-api';
import type { Ref } from '@vue/composition-api';
import dayjs from 'dayjs';
import { formatDate, parseToDayjs } from '../_common/js/date-picker/format';
import {
  subtractMonth, addMonth, DateValue, extractTimeObj,
} from '../_common/js/date-picker/utils';
import type { DateRangePickerPartial, TdDateRangePickerProps, TdDateRangePickerPanelProps } from './type';

type FormatRef = ComputedRef<
  | {
      format: string;
      valueType: string;
      timeFormat: string;
    }
  | {
      format?: undefined;
      valueType?: undefined;
      timeFormat?: undefined;
    }
>;

// eslint-disable-next-line import/prefer-default-export
export function dateCorrection(
  partialIndex: number,
  preYear: Array<number>,
  preMonth: Array<number>,
  onlyYearSelect: boolean,
) {
  let nextYear = preYear;
  const nextMonth = preMonth;
  if (partialIndex === 0) {
    if (nextYear[1] <= nextYear[0]) {
      if (onlyYearSelect) nextYear[1] = nextYear[0] + 1;
      else {
        // eslint-disable-next-line prefer-destructuring
        nextYear[1] = nextYear[0];
        if (nextMonth[1] <= nextMonth[0]) {
          nextMonth[1] = nextMonth[0] + 1;
          if (nextMonth[1] === 12) {
            // 处理跨年的边界场景
            nextMonth[1] = 0;
            nextYear = [nextYear[0], nextYear[1] + 1];
          }
        }
      }
    }
  }

  // 保证左侧时间不大于右侧
  if (partialIndex === 1) {
    if (nextYear[0] >= nextYear[1]) {
      // 年/季度/月份场景下，头部只有年选择器，直接 - 1
      if (onlyYearSelect) nextYear[0] = nextYear[1] - 1;
      else {
        // eslint-disable-next-line prefer-destructuring
        nextYear[0] = nextYear[1];
        if (nextMonth[0] >= nextMonth[1]) {
          nextMonth[0] = nextMonth[1] - 1;
          if (nextMonth[0] === -1) {
            // 处理跨年的边界场景
            nextMonth[0] = 11;
            nextYear = [nextYear[0] - 1, nextYear[1]];
          }
        }
      }
    }
  }
  return { nextYear, nextMonth };
}

interface DateRangePickerJumperClickSharedFn {
  trigger: 'prev' | 'current' | 'next';
  partial: DateRangePickerPartial;
  mode: TdDateRangePickerPanelProps['mode'];
  month: Ref<number[]>;
  year: Ref<number[]>;
}

/**
 * DateRangePicker/DateRangePickerPanel 的日期选择器跳转公共函数
 */
export function onDateRangePickerJumperClickSharedFn({
  trigger,
  partial,
  mode,
  month,
  year,
}: DateRangePickerJumperClickSharedFn) {
  const partialIndex = partial === 'start' ? 0 : 1;

  const monthCountMap = {
    date: 1,
    week: 1,
    month: 12,
    quarter: 12,
    year: 120,
  };
  const monthCount = monthCountMap[mode] || 0;
  const current = new Date(year.value[partialIndex], month.value[partialIndex]);

  let next = null;
  if (trigger === 'prev') {
    next = subtractMonth(current, monthCount);
  } else if (trigger === 'current') {
    next = new Date();
  } else if (trigger === 'next') {
    next = addMonth(current, monthCount);
  }

  let nextYear = [...year.value];
  nextYear[partialIndex] = next.getFullYear();
  let nextMonth = [...month.value];
  nextMonth[partialIndex] = next.getMonth();
  const onlyYearSelect = ['year', 'quarter', 'month'].includes(mode);

  // 头部日期切换修正
  const correctedDate = dateCorrection(partialIndex, nextYear, nextMonth, onlyYearSelect);
  nextYear = correctedDate.nextYear;
  nextMonth = correctedDate.nextMonth;

  return { nextYear, nextMonth, partialIndex };
}

interface DateRangePickerTimePickerSharedFn {
  val: string;
  activeIndex: Ref<number>;
  formatRef: FormatRef;
  year: Ref<number[]>;
  month: Ref<number[]>;
  time: Ref<string[]>;
}

type Input_cacheValue = Ref<string | number | number[] | Date | string[] | Date[]>;

/**
 * DateRangePicker/DateRangePickerPanel 的时间选择切换操作公共函数(当enableTimePicker为true)
 */
export function onDateRangePickerTimePickerChangeSharedFn(
  {
    val, activeIndex, formatRef, year, month, time,
  }: DateRangePickerTimePickerSharedFn,
  input_cacheValue: Input_cacheValue,
) {
  const {
    hours, minutes, seconds, milliseconds, meridiem,
  } = extractTimeObj(val);

  const nextInputValue = Array.isArray(input_cacheValue.value) ? [...input_cacheValue.value] : [input_cacheValue.value];
  const changedInputValue = Array.isArray(input_cacheValue.value) ? input_cacheValue.value[activeIndex.value] : null;
  const currentDate = !dayjs(changedInputValue, formatRef.value.format).isValid()
    ? dayjs().year(year.value[activeIndex.value]).month(month.value[activeIndex.value])
    : dayjs(changedInputValue, formatRef.value.format);
  // am pm 12小时制转化 24小时制
  let nextHours = hours;
  if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
  if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;

  const nextDate = currentDate.hour(nextHours).minute(minutes).second(seconds).millisecond(milliseconds)
    .toDate();
  nextInputValue[activeIndex.value] = nextDate;

  const nextTime = [...time.value];
  nextTime[activeIndex.value] = val;

  const isSelectedInstance = true;

  return {
    nextTime,
    nextInputValue,
    isSelectedInstance,
  };
}

interface DateRangePickerPresetClickSharedFn {
  preset: any;
  context: any;
  onChange: TdDateRangePickerProps['onChange'];
  formatRef: FormatRef;
  onPresetClick: TdDateRangePickerProps['onPresetClick'];
  emit: (event: string, context: any) => void;
}

/**
 * DateRangePicker/DateRangePickerPanel 的预设按钮点击公共函数
 */
export function onDateRangePickerPresetClickSharedFn({
  preset,
  context,
  onChange,
  formatRef,
  onPresetClick,
  emit,
}: DateRangePickerPresetClickSharedFn) {
  let presetValue = preset;
  if (typeof preset === 'function') {
    presetValue = preset();
  }
  if (!Array.isArray(presetValue)) {
    console.error(`preset: ${preset} 预设值必须是数组!`);
  } else {
    onChange?.(
      formatDate(presetValue, {
        format: formatRef.value.format,
        targetFormat: formatRef.value.valueType,
        autoSwap: true,
      }) as DateValue[],
      {
        dayjsValue: presetValue.map((p) => parseToDayjs(p, formatRef.value.format)),
        trigger: 'preset',
      },
    );
    onPresetClick?.(context);
    emit('preset-click', context);
  }
}

interface DateRangePickerYearChangeSharedFn {
  partial: DateRangePickerPartial;
  enableTimePicker: boolean;
  activeIndex: Ref<number>;
  year: Ref<number[]>;
  month: Ref<number[]>;
  mode: TdDateRangePickerPanelProps['mode'];
}
/**
 * DateRangePicker/DateRangePickerPanel 的年份选择器改变公共函数
 */
export function onDateRangePickerYearChangeSharedFn(
  nextVal: number,
  {
    partial, enableTimePicker, activeIndex, year, month, mode,
  }: DateRangePickerYearChangeSharedFn,
) {
  let partialIndex = partial === 'start' ? 0 : 1;
  if (enableTimePicker) partialIndex = activeIndex.value;

  let nextYear = [...year.value];
  let nextMonth = [...month.value];
  nextYear[partialIndex] = nextVal;

  // 年/季度/月份场景下，头部只有年选择器
  const onlyYearSelect = ['year', 'quarter', 'month'].includes(mode);

  // 头部日期切换修正
  const correctedDate = dateCorrection(partialIndex, nextYear, nextMonth, onlyYearSelect);
  nextYear = correctedDate.nextYear;
  nextMonth = correctedDate.nextMonth;

  return {
    nextYear,
    nextMonth,
    onlyYearSelect,
    partialIndex,
  };
}

interface DateRangePickerMonthChangeChangeSharedFn {
  partial: DateRangePickerPartial;
  enableTimePicker: boolean;
  activeIndex: Ref<number>;
  year: Ref<number[]>;
  month: Ref<number[]>;
  mode: TdDateRangePickerPanelProps['mode'];
}
/**
 * DateRangePicker/DateRangePickerPanel 的月份选择器改变公共函数
 */
export function onDateRangePickerMonthChangeSharedFn(
  nextVal: number,
  {
    partial, enableTimePicker, activeIndex, year, month,
  }: DateRangePickerMonthChangeChangeSharedFn,
) {
  let partialIndex = partial === 'start' ? 0 : 1;
  if (enableTimePicker) partialIndex = activeIndex.value;

  let nextYear = [...year.value];
  const nextMonth = [...month.value];
  nextMonth[partialIndex] = nextVal;
  // 保证左侧时间不大于右侧
  if (year.value[0] === year.value[1]) {
    if (partialIndex === 0) {
      // 操作了左侧区间, 处理右侧区间小于或等于左侧区间的场景，交互上始终报错右侧比左侧大 1
      if (nextMonth[1] <= nextMonth[0]) {
        nextMonth[1] = nextMonth[0] + 1;
        if (nextMonth[1] === 12) {
          // 处理跨年的边界场景
          nextMonth[1] = 0;
          nextYear = [year.value?.[0], year.value?.[1] + 1];
        }
      }
    }
    if (partialIndex === 1) {
      // 操作了右侧区间, 处理右侧区间小于或等于左侧区间的场景，交互上始终报错左侧比右侧小 1
      nextMonth[0] = Math.min(nextMonth[0], nextMonth[1]);
      if (nextMonth[0] >= nextMonth[1]) {
        nextMonth[0] -= 1;
        if (nextMonth[0] === -1) {
          // 处理跨年的边界场景
          nextMonth[0] = 11;
          nextYear = [year.value?.[0] - 1, year.value?.[1]];
        }
      }
    }
  }

  return {
    nextYear,
    nextMonth,
    partialIndex,
  };
}

interface DatePickerJumperClickSharedFn {
  trigger: string;
  mode: TdDateRangePickerPanelProps['mode'];
  month: Ref<number>;
  year: Ref<number>;
}

/**
 * DatePicker/DatePickerPanel 的日期选择器跳转公共函数
 */
export function onDatePickerJumperClickSharedFn({
  trigger, mode, month, year,
}: DatePickerJumperClickSharedFn) {
  const monthCountMap = {
    date: 1,
    week: 1,
    month: 12,
    quarter: 12,
    year: 120,
  };
  const monthCount = monthCountMap[mode] || 0;

  const current = new Date(year.value, month.value);

  let next = null;
  if (trigger === 'prev') {
    next = subtractMonth(current, monthCount);
  } else if (trigger === 'current') {
    next = new Date();
  } else if (trigger === 'next') {
    next = addMonth(current, monthCount);
  }

  const nextYear = next.getFullYear();
  const nextMonth = next.getMonth();
  return {
    nextYear,
    nextMonth,
  };
}
