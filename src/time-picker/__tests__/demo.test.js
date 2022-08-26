/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import MockDate from 'mockdate';

import baseVue from '@/src/time-picker/_example/base.vue';
import clearableVue from '@/src/time-picker/_example/clearable.vue';
import disabledVue from '@/src/time-picker/_example/disabled.vue';
import formatVue from '@/src/time-picker/_example/format.vue';
import hideClearButtonVue from '@/src/time-picker/_example/hide-clear-button.vue';
import hmVue from '@/src/time-picker/_example/hm.vue';
import hmsVue from '@/src/time-picker/_example/hms.vue';
import keyboardVue from '@/src/time-picker/_example/keyboard.vue';
import panelVue from '@/src/time-picker/_example/panel.vue';
import rangeVue from '@/src/time-picker/_example/range.vue';
import showStepsVue from '@/src/time-picker/_example/show-steps.vue';
import stepVue from '@/src/time-picker/_example/step.vue';
import twelveHourMeridianVue from '@/src/time-picker/_example/twelve-hour-meridian.vue';
import twelveHourVue from '@/src/time-picker/_example/twelve-hour.vue';

MockDate.set('2020-12-28');

const mapper = {
  baseVue,
  clearableVue,
  disabledVue,
  formatVue,
  hideClearButtonVue,
  hmVue,
  hmsVue,
  keyboardVue,
  panelVue,
  rangeVue,
  showStepsVue,
  stepVue,
  twelveHourMeridianVue,
  twelveHourVue,
};

describe('TimePicker', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`TimePicker ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
