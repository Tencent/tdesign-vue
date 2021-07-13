import _TimePicker from './time-picker';
import _TimeRangePicker from './time-range-picker';

import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

import { TdTimePickerProps, TdTimeRangePickerProps } from '../../types/time-picker/TdTimePickerProps';

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

export * from '../../types/time-picker/TdTimePickerProps';

export { TimePicker, TimeRangePicker };

export default TimePicker;
