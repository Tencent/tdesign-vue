/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/button/_example/base.vue';
import blockVue from '@/src/button/_example/block.vue';
import customElementVue from '@/src/button/_example/custom-element.vue';
import ghostVue from '@/src/button/_example/ghost.vue';
import iconVue from '@/src/button/_example/icon.vue';
import shapeVue from '@/src/button/_example/shape.vue';
import sizeVue from '@/src/button/_example/size.vue';
import statusVue from '@/src/button/_example/status.vue';
import themeVue from '@/src/button/_example/theme.vue';

const mapper = {
  baseVue,
  blockVue,
  customElementVue,
  ghostVue,
  iconVue,
  shapeVue,
  sizeVue,
  statusVue,
  themeVue,
};

describe('Button', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Button ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
