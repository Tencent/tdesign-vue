/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/link/_example/base.vue';
import disabledVue from '@/src/link/_example/disabled.vue';
import hoverVue from '@/src/link/_example/hover.vue';
import iconVue from '@/src/link/_example/icon.vue';
import sizeVue from '@/src/link/_example/size.vue';
import themeVue from '@/src/link/_example/theme.vue';
import underlineVue from '@/src/link/_example/underline.vue';

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
