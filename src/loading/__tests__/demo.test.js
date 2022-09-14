/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import attachVue from '@/src/loading/_example/attach.vue';
import baseVue from '@/src/loading/_example/base.vue';
import delayVue from '@/src/loading/_example/delay.vue';
import fullscreenVue from '@/src/loading/_example/fullscreen.vue';
import iconTextVue from '@/src/loading/_example/icon-text.vue';
import serviceVue from '@/src/loading/_example/service.vue';
import sizeVue from '@/src/loading/_example/size.vue';
import textVue from '@/src/loading/_example/text.vue';
import wrapVue from '@/src/loading/_example/wrap.vue';

const mapper = {
  attachVue,
  baseVue,
  delayVue,
  fullscreenVue,
  iconTextVue,
  serviceVue,
  sizeVue,
  textVue,
  wrapVue,
};

describe('Loading', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Loading ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
