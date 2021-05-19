import _Calendar from './calendar.vue';
import withInstall from '../utils/withInstall';
import { TdCalendarProps } from '../../types/calendar/TdCalendarProps';

export * from '../../types/calendar/TdCalendarProps';
export type CalendarProps = TdCalendarProps;

export const Calendar = withInstall('Calendar', _Calendar);
export default Calendar;
