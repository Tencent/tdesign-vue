import { isObject } from 'lodash-es';
import dayjs from 'dayjs';
import { isEnabledDate } from '../../_common/js/date-picker/utils';
import type { TdDatePickerProps, TdDateRangePickerProps } from '../type';

export interface disableDateProps {
  disableDate?: TdDatePickerProps['disableDate'] | TdDateRangePickerProps['disableDate'];
  format?: TdDatePickerProps['format'];
  mode?: TdDatePickerProps['mode'];
  start?: Date;
  end?: Date;
}

export default function useDisableDate(props: disableDateProps) {
  const {
    disableDate, format, mode, start, end,
  } = props;

  return {
    disableDate: (value: Date) => !isEnabledDate({
      disableDate,
      format,
      mode,
      value,
    }),
    minDate:
      isObject(disableDate) && 'before' in disableDate
        ? new Date(dayjs(disableDate.before).startOf('day').format())
        : start,
    maxDate:
      isObject(disableDate) && 'after' in disableDate ? new Date(dayjs(disableDate.after).endOf('day').format()) : end,
  };
}
