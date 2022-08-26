/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/message/_example/base.vue';
import closeAllVue from '@/src/message/_example/close-all.vue';
import closeVue from '@/src/message/_example/close.vue';
import loadingVue from '@/src/message/_example/loading.vue';
import placementVue from '@/src/message/_example/placement.vue';
import pluginVue from '@/src/message/_example/plugin.vue';
import toggleVue from '@/src/message/_example/toggle.vue';
import typeVue from '@/src/message/_example/type.vue';

const mapper = {
  baseVue,
  closeAllVue,
  closeVue,
  loadingVue,
  placementVue,
  pluginVue,
  toggleVue,
  typeVue,
};

describe('Message', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Message ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
