/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/examples/button/demos/base.vue';
import blockVue from '@/examples/button/demos/block.vue';
import ghostVue from '@/examples/button/demos/ghost.vue';
import iconVue from '@/examples/button/demos/icon.vue';
import shapeVue from '@/examples/button/demos/shape.vue';
import sizeVue from '@/examples/button/demos/size.vue';
import statusVue from '@/examples/button/demos/status.vue';
import themeVue from '@/examples/button/demos/theme.vue';

const mapper = {
  baseVue,
  blockVue,
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
