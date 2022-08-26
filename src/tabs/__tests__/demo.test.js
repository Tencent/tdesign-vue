/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import banVue from '@/src/tabs/_example/ban.vue';
import baseVue from '@/src/tabs/_example/base.vue';
import combinationVue from '@/src/tabs/_example/combination.vue';
import customVue from '@/src/tabs/_example/custom.vue';
import iconVue from '@/src/tabs/_example/icon.vue';
import operationVue from '@/src/tabs/_example/operation.vue';
import positionVue from '@/src/tabs/_example/position.vue';
import sizeVue from '@/src/tabs/_example/size.vue';
import themeVue from '@/src/tabs/_example/theme.vue';

const mapper = {
  banVue,
  baseVue,
  combinationVue,
  customVue,
  iconVue,
  operationVue,
  positionVue,
  sizeVue,
  themeVue,
};

describe('Tabs', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Tabs ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
