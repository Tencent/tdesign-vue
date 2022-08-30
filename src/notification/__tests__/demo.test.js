/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/notification/_example/base.vue';
import closeAllVue from '@/src/notification/_example/close-all.vue';
import closeVue from '@/src/notification/_example/close.vue';
import contentVue from '@/src/notification/_example/content.vue';
import footerVue from '@/src/notification/_example/footer.vue';
import iconVue from '@/src/notification/_example/icon.vue';
import offsetVue from '@/src/notification/_example/offset.vue';
import operationVue from '@/src/notification/_example/operation.vue';
import placementVue from '@/src/notification/_example/placement.vue';
import pluginVue from '@/src/notification/_example/plugin.vue';
import sizeVue from '@/src/notification/_example/size.vue';
import toggleVue from '@/src/notification/_example/toggle.vue';
import typeVue from '@/src/notification/_example/type.vue';
import type4FnVue from '@/src/notification/_example/type4Fn.vue';

const mapper = {
  baseVue,
  closeAllVue,
  closeVue,
  contentVue,
  footerVue,
  iconVue,
  offsetVue,
  operationVue,
  placementVue,
  pluginVue,
  sizeVue,
  toggleVue,
  typeVue,
  type4FnVue,
};

describe('Notification', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Notification ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
