/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/breadcrumb/_example/base.vue';
import customVue from '@/src/breadcrumb/_example/custom.vue';
import dropdownVue from '@/src/breadcrumb/_example/dropdown.vue';
import hrefVue from '@/src/breadcrumb/_example/href.vue';
import iconVue from '@/src/breadcrumb/_example/icon.vue';
import optionsVue from '@/src/breadcrumb/_example/options.vue';
import toVue from '@/src/breadcrumb/_example/to.vue';

const mapper = {
  baseVue,
  customVue,
  dropdownVue,
  hrefVue,
  iconVue,
  optionsVue,
  toVue,
};

describe('Breadcrumb', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Breadcrumb ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
