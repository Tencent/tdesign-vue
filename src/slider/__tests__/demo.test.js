/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/slider/_example/base.vue';
import disabledVue from '@/src/slider/_example/disabled.vue';
import inputNumberVerticalVue from '@/src/slider/_example/input-number-vertical.vue';
import inputNumberVue from '@/src/slider/_example/input-number.vue';
import marksVue from '@/src/slider/_example/marks.vue';
import minAndMaxVue from '@/src/slider/_example/min-and-max.vue';
import stepVue from '@/src/slider/_example/step.vue';
import verticalMarksVue from '@/src/slider/_example/vertical-marks.vue';
import verticalVue from '@/src/slider/_example/vertical.vue';

const mapper = {
  baseVue,
  disabledVue,
  inputNumberVerticalVue,
  inputNumberVue,
  marksVue,
  minAndMaxVue,
  stepVue,
  verticalMarksVue,
  verticalVue,
};

describe('Slider', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Slider ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
