/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import circleVue from '@/src/progress/_example/circle.vue';
import customVue from '@/src/progress/_example/custom.vue';
import lineVue from '@/src/progress/_example/line.vue';
import plumpVue from '@/src/progress/_example/plump.vue';
import sizeVue from '@/src/progress/_example/size.vue';
import statusVue from '@/src/progress/_example/status.vue';

const mapper = {
  circleVue,
  customVue,
  lineVue,
  plumpVue,
  sizeVue,
  statusVue,
};

describe('Progress', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Progress ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
