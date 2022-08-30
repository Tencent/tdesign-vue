/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import colorModeVue from '@/src/color-picker/_example/color-mode.vue';
import enableAlphaVue from '@/src/color-picker/_example/enable-alpha.vue';
import panelVue from '@/src/color-picker/_example/panel.vue';
import recentColorVue from '@/src/color-picker/_example/recent-color.vue';
import statusDisabledVue from '@/src/color-picker/_example/status-disabled.vue';
import statusReadonlyVue from '@/src/color-picker/_example/status-readonly.vue';
import swatchColorVue from '@/src/color-picker/_example/swatch-color.vue';
import triggerVue from '@/src/color-picker/_example/trigger.vue';

const mapper = {
  colorModeVue,
  enableAlphaVue,
  panelVue,
  recentColorVue,
  statusDisabledVue,
  statusReadonlyVue,
  swatchColorVue,
  triggerVue,
};

describe('ColorPicker', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`ColorPicker ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
