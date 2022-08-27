/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import addonVue from '@/src/input/_example/addon.vue';
import alignVue from '@/src/input/_example/align.vue';
import autoWidthVue from '@/src/input/_example/auto-width.vue';
import baseVue from '@/src/input/_example/base.vue';
import clearableVue from '@/src/input/_example/clearable.vue';
import focusVue from '@/src/input/_example/focus.vue';
import formatVue from '@/src/input/_example/format.vue';
import groupVue from '@/src/input/_example/group.vue';
import maxLengthCountVue from '@/src/input/_example/max-length-count.vue';
import passwordVue from '@/src/input/_example/password.vue';
import sizeVue from '@/src/input/_example/size.vue';
import statusVue from '@/src/input/_example/status.vue';
import textareaVue from '@/src/input/_example/textarea.vue';

const mapper = {
  addonVue,
  alignVue,
  autoWidthVue,
  baseVue,
  clearableVue,
  focusVue,
  formatVue,
  groupVue,
  maxLengthCountVue,
  passwordVue,
  sizeVue,
  statusVue,
  textareaVue,
};

describe('Input', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Input ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
