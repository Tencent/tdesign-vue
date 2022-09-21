/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/rate/_example/base.vue';
import customVue from '@/src/rate/_example/custom.vue';
import iconVue from '@/src/rate/_example/icon.vue';
import sizeVue from '@/src/rate/_example/size.vue';
import statusVue from '@/src/rate/_example/status.vue';
import textsVue from '@/src/rate/_example/texts.vue';

const mapper = {
  baseVue,
  customVue,
  iconVue,
  sizeVue,
  statusVue,
  textsVue,
};

describe('Rate', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Rate ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
