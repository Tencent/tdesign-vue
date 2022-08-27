/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import alignVue from '@/src/input-number/_example/align.vue';
import autoWidthVue from '@/src/input-number/_example/auto-width.vue';
import centerVue from '@/src/input-number/_example/center.vue';
import defaultVue from '@/src/input-number/_example/default.vue';
import disabledVue from '@/src/input-number/_example/disabled.vue';
import emptyVue from '@/src/input-number/_example/empty.vue';
import formatVue from '@/src/input-number/_example/format.vue';
import largeNumberVue from '@/src/input-number/_example/large-number.vue';
import leftVue from '@/src/input-number/_example/left.vue';
import normalVue from '@/src/input-number/_example/normal.vue';
import sizeVue from '@/src/input-number/_example/size.vue';
import statusVue from '@/src/input-number/_example/status.vue';
import stepVue from '@/src/input-number/_example/step.vue';

const mapper = {
  alignVue,
  autoWidthVue,
  centerVue,
  defaultVue,
  disabledVue,
  emptyVue,
  formatVue,
  largeNumberVue,
  leftVue,
  normalVue,
  sizeVue,
  statusVue,
  stepVue,
};

describe('InputNumber', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`InputNumber ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
