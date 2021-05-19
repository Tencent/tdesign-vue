import _TimePicker from './time-picker';
import mapProps from '../utils/map-props';
import withInstall from '../utils/withInstall';

export const TimePicker = withInstall('TimePicker', mapProps(['value'], {
  model: { prop: 'value', event: 'change' },
})(_TimePicker));
export default TimePicker;
