/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/examples/link/demos/base.vue';
import disabledVue from '@/examples/link/demos/disabled.vue';
import hoverVue from '@/examples/link/demos/hover.vue';
import iconVue from '@/examples/link/demos/icon.vue';
import sizeVue from '@/examples/link/demos/size.vue';
import themeVue from '@/examples/link/demos/theme.vue';
import underlineVue from '@/examples/link/demos/underline.vue';

const mapper = {
  baseVue,
  disabledVue,
  hoverVue,
  iconVue,
  sizeVue,
  themeVue,
  underlineVue,
};

describe('Link', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Link ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
