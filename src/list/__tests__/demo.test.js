/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/list/_example/base.vue';
import headerFooterVue from '@/src/list/_example/header-footer.vue';
import imageTextVue from '@/src/list/_example/image-text.vue';
import loadingVue from '@/src/list/_example/loading.vue';
import multilineVue from '@/src/list/_example/multiline.vue';
import operationVue from '@/src/list/_example/operation.vue';
import scrollVue from '@/src/list/_example/scroll.vue';
import sizeVue from '@/src/list/_example/size.vue';
import stripeVue from '@/src/list/_example/stripe.vue';

const mapper = {
  baseVue,
  headerFooterVue,
  imageTextVue,
  loadingVue,
  multilineVue,
  operationVue,
  scrollVue,
  sizeVue,
  stripeVue,
};

describe('List', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`List ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
