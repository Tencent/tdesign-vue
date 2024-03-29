import VueCompositionAPI from '@vue/composition-api';
import _TimePicker from './time-picker';
import _TimeRangePicker from './time-range-picker';
import _TimePickerPanel from './panel/time-picker-panel';
import { TdTimePickerProps, TdTimeRangePickerProps } from './type';
import withInstall from '../utils/withInstall';

import './style';

export * from './interface';

export type TimePickerProps = TdTimePickerProps;
export type TimeRangePickerProps = TdTimeRangePickerProps;

export const TimePicker = withInstall(_TimePicker, VueCompositionAPI);
export const TimeRangePicker = withInstall(_TimeRangePicker, VueCompositionAPI);
export const TimePickerPanel = withInstall(_TimePickerPanel, VueCompositionAPI);

export default TimePicker;
