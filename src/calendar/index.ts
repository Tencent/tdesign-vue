import _Calendar from './calendar.vue';
import withInstall from '../utils/withInstall';

import './style';

export * from './interface';

export const Calendar = withInstall(_Calendar);
export default Calendar;
