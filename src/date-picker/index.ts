import _DatePicker from './date-picker';
import withInstall from '../utils/withInstall';
import mapProps from '../utils/map-props';

import './style';

export * from './interface';

export const DatePicker = withInstall(mapProps(['value'])(_DatePicker));

export default DatePicker;
