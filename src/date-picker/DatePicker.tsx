import { defineComponent, watchEffect, computed } from '@vue/composition-api';
import dayjs from 'dayjs';
import { CalendarIcon } from 'tdesign-icons-vue';
import { usePrefixClass } from '../hooks/useConfig';

import useSingle from './hooks/useSingle';
import {
  parseToDayjs, getDefaultFormat, formatTime, formatDate,
} from './hooks/useFormat';
import { subtractMonth, addMonth, extractTimeObj } from '../_common/js/date-picker/utils';
import type { DateValue } from './type';
import props from './props';

import TSelectInput from '../select-input';
import TSinglePanel from './panel/SinglePanel';

export default defineComponent({
  name: 'TDatePicker',
  props,
  setup(props, { emit }) {
    const COMPONENT_NAME = usePrefixClass('date-picker');

    const {
      inputValue,
      popupVisible,
      inputProps: datePickerInputProps,
      popupProps: datePickerPopupProps,
      isHoverCell,
      cacheValue,
      value,
      year,
      month,
      time,
      inputRef,
      onChange,
    } = useSingle(props, { emit });

    const formatRef = computed(() => getDefaultFormat({
      mode: props.mode,
      format: props.format,
      valueType: props.valueType,
      enableTimePicker: props.enableTimePicker,
    }));

    watchEffect(() => {
      // 面板展开重置数据
      if (popupVisible.value) {
        year.value = parseToDayjs(value.value || new Date(), formatRef.value.format).year();
        month.value = parseToDayjs(value.value || new Date(), formatRef.value.format).month();
        time.value = formatTime(value.value || new Date(), formatRef.value.timeFormat);
        if (value.value) {
          cacheValue.value = formatDate(value.value, {
            format: formatRef.value.format,
            targetFormat: formatRef.value.format,
          });
        }
      }
    });

    // 日期 hover
    function onCellMouseEnter(date: Date) {
      isHoverCell.value = true;
      inputValue.value = formatDate(date, {
        format: formatRef.value.format,
        targetFormat: formatRef.value.format,
      });
    }

    // 日期 leave
    function onCellMouseLeave() {
      isHoverCell.value = false;
      inputValue.value = formatDate(cacheValue.value, {
        format: formatRef.value.format,
        targetFormat: formatRef.value.format,
      });
    }

    // 日期点击
    function onCellClick(date: Date) {
      isHoverCell.value = false;
      // date 模式自动切换年月
      if (props.mode === 'date') {
        year.value = date.getFullYear();
        month.value = date.getMonth();
      }
      if (props.enableTimePicker) {
        cacheValue.value = formatDate(date, {
          format: formatRef.value.format,
          targetFormat: formatRef.value.format,
        });
      } else {
        onChange?.(
          formatDate(date, {
            format: formatRef.value.format,
            targetFormat: formatRef.value.valueType,
          }) as DateValue,
          {
            dayjsValue: dayjs(date),
            trigger: 'pick',
          },
        );
        popupVisible.value = false;
      }

      props.onPick?.(date);
      emit('pick', date);
    }

    // 头部快速切换
    function onJumperClick({ trigger }: { trigger: string }) {
      const monthCountMap = {
        date: 1,
        week: 1,
        month: 12,
        quarter: 12,
        year: 120,
      };
      const monthCount = monthCountMap[props.mode] || 0;

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

      year.value = nextYear;
      month.value = nextMonth;
    }

    // timePicker 点击
    function onTimePickerChange(val: string) {
      time.value = val;

      const {
        hours, minutes, seconds, milliseconds, meridiem,
      } = extractTimeObj(val);

      // am pm 12小时制转化 24小时制
      let nextHours = hours;
      if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
      if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;
      const currentDate = !dayjs(inputValue.value as string, formatRef.value.format).isValid()
        ? dayjs()
        : dayjs(inputValue.value as string, formatRef.value.format);
      const nextDate = currentDate.hour(nextHours).minute(minutes).second(seconds).millisecond(milliseconds)
        .toDate();
      inputValue.value = formatDate(nextDate, {
        format: formatRef.value.format,
        targetFormat: formatRef.value.format,
      });

      props.onPick?.(nextDate);
    }

    // 确定
    function onConfirmClick() {
      const nextValue = formatDate(inputValue.value, {
        format: formatRef.value.format,
        targetFormat: formatRef.value.format,
      });
      if (nextValue) {
        onChange?.(
          formatDate(inputValue.value, {
            format: formatRef.value.format,
            targetFormat: formatRef.value.valueType,
          }) as DateValue,
          {
            dayjsValue: dayjs(inputValue.value as string),
            trigger: 'confirm',
          },
        );
      } else {
        inputValue.value = formatDate(value.value, {
          format: formatRef.value.format,
          targetFormat: formatRef.value.format,
        });
      }
      popupVisible.value = false;
    }

    // 预设
    function onPresetClick(presetValue: DateValue | (() => DateValue)) {
      const presetVal = typeof presetValue === 'function' ? presetValue() : presetValue;
      onChange?.(
        formatDate(presetVal, {
          format: formatRef.value.format,
          targetFormat: formatRef.value.valueType,
        }) as DateValue,
        {
          dayjsValue: dayjs(presetVal),
          trigger: 'preset',
        },
      );
      popupVisible.value = false;
    }

    function onYearChange(nextYear: number) {
      year.value = nextYear;
    }

    function onMonthChange(nextMonth: number) {
      month.value = nextMonth;
    }

    const panelProps: any = computed(() => ({
      value: cacheValue.value as string,
      year: year.value,
      month: month.value,
      format: formatRef.value.format,
      mode: props.mode,
      presets: props.presets,
      time: time.value as string,
      disableDate: props.disableDate,
      firstDayOfWeek: props.firstDayOfWeek,
      timePickerProps: props.timePickerProps,
      enableTimePicker: props.enableTimePicker,
      presetsPlacement: props.presetsPlacement,
      popupVisible: popupVisible.value,
      onCellClick,
      onCellMouseEnter,
      onCellMouseLeave,
      onJumperClick,
      onConfirmClick,
      onPresetClick,
      onYearChange,
      onMonthChange,
      onTimePickerChange,
      onPanelClick: () => inputRef.value?.focus?.(),
    }));

    return {
      COMPONENT_NAME,
      inputValue,
      datePickerPopupProps,
      datePickerInputProps,
      popupVisible,
      panelProps,
    };
  },
  render() {
    const {
      COMPONENT_NAME, inputValue, datePickerPopupProps, datePickerInputProps, popupVisible, panelProps,
    } = this;

    return (
      <div class={COMPONENT_NAME}>
        <TSelectInput
          disabled={this.disabled}
          value={inputValue}
          popupProps={datePickerPopupProps}
          inputProps={{ suffixIcon: this.suffixIcon || (() => <CalendarIcon />), ...datePickerInputProps }}
          popupVisible={popupVisible}
          clearable={this.clearable}
          allowInput={this.allowInput}
          panel={() => <TSinglePanel {...{ props: panelProps }} />}
        />
      </div>
    );
  },
});
