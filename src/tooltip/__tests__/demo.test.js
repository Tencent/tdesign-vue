/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import arrowVue from '@/src/tooltip/_example/arrow.vue';
import baseVue from '@/src/tooltip/_example/base.vue';
import durationVue from '@/src/tooltip/_example/duration.vue';
import mouseVue from '@/src/tooltip/_example/mouse.vue';
import noArrowVue from '@/src/tooltip/_example/no-arrow.vue';
import themeVue from '@/src/tooltip/_example/theme.vue';
import triggerVue from '@/src/tooltip/_example/trigger.vue';

const mapper = {
  arrowVue,
  baseVue,
  durationVue,
  mouseVue,
  noArrowVue,
  themeVue,
  triggerVue,
};

describe('Tooltip', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Tooltip ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
