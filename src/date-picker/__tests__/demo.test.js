/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';

import baseVue from '@/src/date-picker/_example/base.vue';
import customIconVue from '@/src/date-picker/_example/custom-icon.vue';
import datePresetsAltVue from '@/src/date-picker/_example/date-presets-alt.vue';
import dateRangeVue from '@/src/date-picker/_example/date-range.vue';
import dateTimeVue from '@/src/date-picker/_example/date-time.vue';
import disableDateVue from '@/src/date-picker/_example/disable-date.vue';
import firstDayOfWeekVue from '@/src/date-picker/_example/first-day-of-week.vue';
import monthVue from '@/src/date-picker/_example/month.vue';
import panelVue from '@/src/date-picker/_example/panel.vue';
import quarterVue from '@/src/date-picker/_example/quarter.vue';
import weekVue from '@/src/date-picker/_example/week.vue';
import yearVue from '@/src/date-picker/_example/year.vue';

MockDate.set('2020-12-28');

const mapper = {
  baseVue,
  customIconVue,
  datePresetsAltVue,
  dateRangeVue,
  dateTimeVue,
  disableDateVue,
  firstDayOfWeekVue,
  monthVue,
  panelVue,
  quarterVue,
  weekVue,
  yearVue,
};

describe('DatePicker', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`DatePicker ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
