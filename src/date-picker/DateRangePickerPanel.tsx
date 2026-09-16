import { defineComponent, toRefs, watch, ref, computed, h } from '@vue/composition-api';
import dayjs from 'dayjs';
import { TdDateRangePickerPanelProps } from './type';
import props from './date-range-picker-panel-props';
import { useConfig } from '../hooks/useConfig';
import { useTNodeDefault } from '../hooks/tnode';
import { useRangeValue } from './hooks/useRangeValue';
import RangePanel from './panel/RangePanel';
import { useTable } from './hooks/useTable';
import { useDisableDate } from './hooks/useDisableDate';
import { formatTNodeReturnValue } from '../utils/render-tnode';
import { parseToDayjs } from '../_common/js/date-picker/format';

export default defineComponent({
  name: 'TDateRangePickerPanel',
  props,
  setup(props: TdDateRangePickerPanelProps) {
    const { value } = toRefs(props);
    const { globalConfig } = useConfig('datePicker');
    const { formatRef, ...rangeValueProps } = useRangeValue(props);
    const { year, month, time, onChange, cacheValue, isFirstValueSelected } = rangeValueProps;

    const panelProps = computed(() => ({
      year: year.value,
      month: month.value,
      time: time.value,
      value: value.value,
      isFirstValueSelected: isFirstValueSelected.value,
      format: formatRef.value.format,
      ...useTable(props, { year, month, time }),
      ...useDisableDate(props),
      onMonthChange,
      onYearChange,
      onJumperClick,
      onCellClick,
      onChange,
    }));

    function onMonthChange(val: number[], partial: string) {
      const nextMonth = [...month.value];
      if (partial === 'start') {
        nextMonth[0] = val[0];
      } else {
        nextMonth[1] = val[1];
      }
      month.value = nextMonth;
    }

    function onYearChange(val: number[], partial: string) {
      const nextYear = [...year.value];
      if (partial === 'start') {
        nextYear[0] = val[0];
      } else {
        nextYear[1] = val[1];
      }
      year.value = nextYear;
    }

    function onJumperClick(val: { trigger: string; partial: string }) {
      const nextMonth = [...month.value];
      if (val.partial === 'start') {
        nextMonth[0] = val.trigger === 'prev' ? month.value[0] - 1 : month.value[0] + 1;
      } else {
        nextMonth[1] = val.trigger === 'prev' ? month.value[1] - 1 : month.value[1] + 1;
      }
      month.value = nextMonth;
    }

    function onCellClick(date: Date, { e }: { e: MouseEvent }) {
      const newDate = dayjs(date);
      const nextVal = [...cacheValue.value];
      if (!isFirstValueSelected.value) {
        nextVal[0] = newDate.format(formatRef.value.format);
        cacheValue.value = nextVal;
        isFirstValueSelected.value = true;
      } else {
        nextVal[1] = newDate.format(formatRef.value.format);
        cacheValue.value = nextVal;
        isFirstValueSelected.value = false;
        onChange?.(nextVal);
      }
    }

    watch(
      () => value.value,
      (nextVal) => {
        if (nextVal.length === 2 && !props.enableTimePicker) {
          const nextYear = nextVal.map((v: string) => parseToDayjs(v || new Date(), formatRef.value.format).year());
          const nextMonth = nextVal.map((v: string) => parseToDayjs(v || new Date(), formatRef.value.format).month());
          // 确保右侧面板月份比左侧大 避免两侧面板月份一致
          if (nextYear[0] === nextYear[1] && nextMonth[0] === nextMonth[1]) {
            nextMonth[0] === 11 ? (nextMonth[0] -= 1) : (nextMonth[1] += 1);
          }
          // 仅在 year/month 实际发生变化时才更新，避免覆盖用户手动导航
          if (nextYear[0] !== year.value[0] || nextYear[1] !== year.value[1]
            || nextMonth[0] !== month.value[0] || nextMonth[1] !== month.value[1]) {
            year.value = nextYear;
            month.value = nextMonth;
          }
        }
      },
      { immediate: true },
    );

    return {
      panelProps,
    };
  },
});
