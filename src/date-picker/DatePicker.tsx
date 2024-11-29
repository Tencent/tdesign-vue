import { defineComponent, watch, computed } from '@vue/composition-api';
import dayjs from 'dayjs';
import isDate from 'lodash/isDate';

import { usePrefixClass } from '../hooks/useConfig';
import useSingle from './hooks/useSingle';
import {
  parseToDayjs, getDefaultFormat, formatTime, formatDate,
} from '../_common/js/date-picker/format';
import {
  subtractMonth, addMonth, extractTimeObj, covertToDate, isSame,
} from '../_common/js/date-picker/utils';
import type { DateMultipleValue, DateValue } from './type';
import props from './props';

import TSelectInput from '../select-input';
import TSinglePanel from './panel/SinglePanel';
import useFormDisabled from '../hooks/useFormDisabled';
import type { TagInputRemoveContext } from '../tag-input';

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
      tagInputProps: datePickerTagInputProps,
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
      enableTimePicker: props.multiple ? false : props.enableTimePicker,
    }));

    const { formDisabled } = useFormDisabled();
    const isDisabled = computed(() => formDisabled.value || props.disabled);

    watch(popupVisible, (visible) => {
      if (props.multiple) return;
      // Date valueType、week mode 、quarter mode nad empty string don't need to be parsed
      const dateValue = value.value && !isDate(value.value) && !['week', 'quarter'].includes(props.mode)
        ? covertToDate(value.value as string, formatRef.value?.valueType)
        : value.value;

      cacheValue.value = formatDate(dateValue, {
        format: formatRef.value.format,
      });
      inputValue.value = formatDate(dateValue, {
        format: formatRef.value.format,
      });

      // 面板展开重置数据
      if (visible) {
        year.value = parseToDayjs(value.value as DateValue, formatRef.value.format).year();
        month.value = parseToDayjs(value.value as DateValue, formatRef.value.format).month();
        time.value = formatTime(value.value, formatRef.value.format, formatRef.value.timeFormat, props.defaultTime);
      } else {
        isHoverCell.value = false;
      }
    });

    // 日期 hover
    function onCellMouseEnter(date: Date) {
      if (props.multiple) return;
      isHoverCell.value = true;
      inputValue.value = formatDate(date, {
        format: formatRef.value.format,
      });
    }

    // 日期 leave
    function onCellMouseLeave() {
      if (props.multiple) return;
      isHoverCell.value = false;
      inputValue.value = formatDate(cacheValue.value, {
        format: formatRef.value.format,
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
        });
      } else {
        if (props.multiple) {
          const newDate = processDate(date);
          onChange?.(newDate, {
            dayjsValue: parseToDayjs(date, formatRef.value.format),
            trigger: 'pick',
          });
          return;
        }
        onChange?.(
          formatDate(date, {
            format: formatRef.value.format,
            targetFormat: formatRef.value.valueType,
          }) as DateValue,
          {
            dayjsValue: parseToDayjs(date, formatRef.value.format),
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
      });
      cacheValue.value = formatDate(nextDate, {
        format: formatRef.value.format,
      });

      props.onPick?.(nextDate);
    }

    // 确定
    function onConfirmClick({ e }: { e: MouseEvent }) {
      const nextValue = formatDate(inputValue.value, {
        format: formatRef.value.format,
      });
      if (nextValue) {
        props?.onConfirm?.({ date: dayjs(nextValue as string).toDate(), e });
        emit('confirm', { date: dayjs(nextValue as string).toDate(), e });
        onChange?.(
          formatDate(inputValue.value, {
            format: formatRef.value.format,
            targetFormat: formatRef.value.valueType,
          }) as DateValue,
          {
            dayjsValue: parseToDayjs(inputValue.value as string, formatRef.value.format),
            trigger: 'confirm',
          },
        );
      } else {
        inputValue.value = formatDate(value.value, {
          format: formatRef.value.format,
        });
      }
      popupVisible.value = false;
    }

    // 预设
    function onPresetClick(presetValue: any, context: any) {
      const presetVal = typeof presetValue === 'function' ? presetValue() : presetValue;
      onChange?.(
        formatDate(presetVal, {
          format: formatRef.value.format,
          targetFormat: formatRef.value.valueType,
        }) as DateValue,
        {
          dayjsValue: parseToDayjs(presetVal, formatRef.value.format),
          trigger: 'preset',
        },
      );
      props.onPresetClick?.(context);
      emit('preset-click', context);
      popupVisible.value = false;
    }

    function onYearChange(nextYear: number) {
      year.value = nextYear;
    }

    function onMonthChange(nextMonth: number) {
      month.value = nextMonth;
    }

    function processDate(date: Date) {
      const val = value.value as DateMultipleValue;
      const isSameDate = val.some((val) => isSame(dayjs(val).toDate(), date));
      let currentDate: DateMultipleValue;

      if (!isSameDate) {
        currentDate = val.concat(
          formatDate(date, { format: formatRef.value.format, targetFormat: formatRef.value.valueType }),
        );
      } else {
        currentDate = val.filter(
          (val) => formatDate(val, { format: formatRef.value.format, targetFormat: formatRef.value.valueType })
            !== formatDate(date, { format: formatRef.value.format, targetFormat: formatRef.value.valueType }),
        );
      }

      return currentDate.sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf());
    }

    const onTagRemoveClick = (ctx: TagInputRemoveContext) => {
      const removeDate = dayjs(ctx.item).toDate();
      const newDate = processDate(removeDate);
      onChange?.(newDate, {
        dayjsValue: parseToDayjs(removeDate, formatRef.value.format),
        trigger: 'pick',
      });
      // props?.tagInputProps?.onRemove?.(ctx);
    };

    const onTagClearClick = ({ e }: { e: MouseEvent }) => {
      e.stopPropagation();
      popupVisible.value = false;
      onChange?.([], { dayjsValue: dayjs(), trigger: 'clear' });
      // props?.tagInputProps?.onClear?.(e);
    };

    const panelProps: any = computed(() => ({
      value: cacheValue.value,
      year: year.value,
      month: month.value,
      format: formatRef.value.format,
      mode: props.mode,
      presets: props.presets,
      time: props.multiple ? '' : time.value,
      disableDate: props.disableDate,
      disableTime: props.disableTime,
      firstDayOfWeek: props.firstDayOfWeek,
      timePickerProps: props.timePickerProps,
      enableTimePicker: props.multiple ? false : props.enableTimePicker,
      presetsPlacement: props.presetsPlacement,
      popupVisible: popupVisible.value,
      multiple: props.multiple,
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
      datePickerTagInputProps,
      popupVisible,
      panelProps,
      isDisabled,
      onTagRemoveClick,
      onTagClearClick,
    };
  },
  render() {
    const {
      COMPONENT_NAME,
      inputValue,
      datePickerPopupProps,
      datePickerInputProps,
      datePickerTagInputProps,
      popupVisible,
      panelProps,
      isDisabled,
      onTagRemoveClick,
      onTagClearClick,
    } = this;

    return (
      <div class={COMPONENT_NAME}>
        <TSelectInput
          disabled={isDisabled}
          readonly={this.readonly}
          value={inputValue}
          inputValue={this.multiple ? '' : inputValue}
          label={this.label}
          status={this.status}
          tips={this.tips}
          popupProps={datePickerPopupProps}
          inputProps={datePickerInputProps}
          popupVisible={popupVisible}
          clearable={this.clearable}
          allowInput={this.allowInput && !this.readonly}
          panel={() => <TSinglePanel {...{ props: panelProps }} />}
          multiple={this.multiple}
          tagInputProps={{
            onRemove: onTagRemoveClick,
            ...datePickerTagInputProps,
          }}
          onClear={onTagClearClick}
        />
      </div>
    );
  },
});
