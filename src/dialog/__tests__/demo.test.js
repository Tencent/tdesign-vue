/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import asyncVue from '@/src/dialog/_example/async.vue';
import attachVue from '@/src/dialog/_example/attach.vue';
import baseVue from '@/src/dialog/_example/base.vue';
import custom from '@/src/dialog/_example/custom';
import customVue from '@/src/dialog/_example/custom.vue';
import dragVue from '@/src/dialog/_example/drag.vue';
import iconVue from '@/src/dialog/_example/icon.vue';
import modalVue from '@/src/dialog/_example/modal.vue';
import pluginVue from '@/src/dialog/_example/plugin.vue';
import positionVue from '@/src/dialog/_example/position.vue';
import warningVue from '@/src/dialog/_example/warning.vue';

const mapper = {
  asyncVue,
  attachVue,
  baseVue,
  custom,
  customVue,
  dragVue,
  iconVue,
  modalVue,
  pluginVue,
  positionVue,
  warningVue,
};

describe('Dialog', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Dialog ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
