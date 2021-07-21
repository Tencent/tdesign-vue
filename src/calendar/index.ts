import _Calendar from './calendar.vue';
import withInstall from '../utils/withInstall';

export * from './interface';

export const Calendar = withInstall('Calendar', _Calendar);
export default Calendar;
