import _DatePicker from './date-picker';
import withInstall from '../utils/withInstall';
import { TdDatePickerProps } from '@TdTypes/date-picker/TdDatePickerProps';

export type DatePickerProps = TdDatePickerProps;
export * from '../../types/date-picker/TdDatePickerProps';

export const DatePicker = withInstall('DatePicker', _DatePicker);
export default DatePicker;
