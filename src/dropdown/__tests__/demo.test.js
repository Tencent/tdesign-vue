/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/dropdown/_example/base.vue';
import buttonVue from '@/src/dropdown/_example/button.vue';
import customVue from '@/src/dropdown/_example/custom.vue';
import disabledVue from '@/src/dropdown/_example/disabled.vue';
import eventVue from '@/src/dropdown/_example/event.vue';
import longVue from '@/src/dropdown/_example/long.vue';
import multipleVue from '@/src/dropdown/_example/multiple.vue';
import slotVue from '@/src/dropdown/_example/slot.vue';
import splitVue from '@/src/dropdown/_example/split.vue';

const mapper = {
  baseVue,
  buttonVue,
  customVue,
  disabledVue,
  eventVue,
  longVue,
  multipleVue,
  slotVue,
  splitVue,
};

describe('Dropdown', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Dropdown ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
