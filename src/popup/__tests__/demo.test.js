/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/popup/_example/base.vue';
import containerVue from '@/src/popup/_example/container.vue';
import destroyVue from '@/src/popup/_example/destroy.vue';
import disabledVue from '@/src/popup/_example/disabled.vue';
import placementVue from '@/src/popup/_example/placement.vue';
import styleVue from '@/src/popup/_example/style.vue';
import triggerElementVue from '@/src/popup/_example/trigger-element.vue';
import triggerVue from '@/src/popup/_example/trigger.vue';
import visibleVue from '@/src/popup/_example/visible.vue';

const mapper = {
  baseVue,
  containerVue,
  destroyVue,
  disabledVue,
  placementVue,
  styleVue,
  triggerElementVue,
  triggerVue,
  visibleVue,
};

describe('Popup', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Popup ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
