import _TimePicker from './time-picker';
import _TimeRangePicker from './time-range-picker';

import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

import './style';

export * from './interface';

export const TimePicker = withInstall(
  mapProps(['value'], { model: { prop: 'value', event: 'change' } })(_TimePicker),
);

export const TimeRangePicker = withInstall(
  mapProps(['value'], { model: { prop: 'value', event: 'change' } })(_TimeRangePicker),
);

export default TimePicker;
