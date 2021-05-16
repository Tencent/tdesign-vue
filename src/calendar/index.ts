import Calendar from './calendar.vue';
import setInstallFn from '../utils/setInstallFn';
import { TdCalendarProps } from '../../types/calendar/TdCalendarProps';

setInstallFn('Calendar', Calendar);


export type CalendarProps = TdCalendarProps;
export * from '../../types/calendar/TdCalendarProps';
export { Calendar };
export default Calendar;
