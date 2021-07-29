import _DatePicker from './date-picker';
import withInstall from '../utils/withInstall';

import './style/';

export * from './interface';

export const DatePicker = withInstall('DatePicker', _DatePicker);
export default DatePicker;
