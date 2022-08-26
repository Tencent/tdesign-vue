/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/collapse/_example/base.vue';
import iconVue from '@/src/collapse/_example/icon.vue';
import mutexVue from '@/src/collapse/_example/mutex.vue';
import otherVue from '@/src/collapse/_example/other.vue';
import rightSlotVue from '@/src/collapse/_example/rightSlot.vue';

const mapper = {
  baseVue,
  iconVue,
  mutexVue,
  otherVue,
  rightSlotVue,
};

describe('Collapse', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Collapse ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
