import _TimePicker from './time-picker';
import _TimeRangePicker from './time-range-picker';

import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

import { TdTimePickerProps, TdTimeRangePickerProps } from './type';

const TimePicker = withInstall(
  'TimePicker',
  mapProps(['value'], { model: { prop: 'value', event: 'change' } })(_TimePicker),
);

const TimeRangePicker = withInstall(
  'TimeRangePicker',
  mapProps(['value'], { model: { prop: 'value', event: 'change' } })(_TimeRangePicker),
);

export type TimePickerProps  = TdTimePickerProps;
export type TimeRangePickerProps  = TdTimeRangePickerProps;

export * from './type';
export * from './interface';

export { TimePicker, TimeRangePicker };

export default TimePicker;
