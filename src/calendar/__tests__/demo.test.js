/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';

import baseVue from '@/src/calendar/_example/base.vue';
import cardVue from '@/src/calendar/_example/card.vue';
import cellAppendVue from '@/src/calendar/_example/cell-append.vue';
import cellVue from '@/src/calendar/_example/cell.vue';
import controllerConfigVue from '@/src/calendar/_example/controller-config.vue';
import eventsVue from '@/src/calendar/_example/events.vue';
import firstDayOfWeekVue from '@/src/calendar/_example/first-day-of-week.vue';
import headVue from '@/src/calendar/_example/head.vue';
import modeVue from '@/src/calendar/_example/mode.vue';
import rangeVue from '@/src/calendar/_example/range.vue';
import slotPropsApiVue from '@/src/calendar/_example/slot-props-api.vue';
import valueVue from '@/src/calendar/_example/value.vue';
import weekVue from '@/src/calendar/_example/week.vue';

MockDate.set('2020-12-28');

const mapper = {
  baseVue,
  cardVue,
  cellAppendVue,
  cellVue,
  controllerConfigVue,
  eventsVue,
  firstDayOfWeekVue,
  headVue,
  modeVue,
  rangeVue,
  slotPropsApiVue,
  valueVue,
  weekVue,
};

describe('Calendar', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Calendar ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
