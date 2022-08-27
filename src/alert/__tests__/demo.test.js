/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/alert/_example/base.vue';
import closeVue from '@/src/alert/_example/close.vue';
import collapseVue from '@/src/alert/_example/collapse.vue';
import iconVue from '@/src/alert/_example/icon.vue';
import operationVue from '@/src/alert/_example/operation.vue';
import titleVue from '@/src/alert/_example/title.vue';

const mapper = {
  baseVue,
  closeVue,
  collapseVue,
  iconVue,
  operationVue,
  titleVue,
};

describe('Alert', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Alert ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
