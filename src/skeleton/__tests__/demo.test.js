/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import advanceVue from '@/src/skeleton/_example/advance.vue';
import animationVue from '@/src/skeleton/_example/animation.vue';
import baseVue from '@/src/skeleton/_example/base.vue';
import delayVue from '@/src/skeleton/_example/delay.vue';
import themeVue from '@/src/skeleton/_example/theme.vue';

const mapper = {
  advanceVue,
  animationVue,
  baseVue,
  delayVue,
  themeVue,
};

describe('Skeleton', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Skeleton ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
