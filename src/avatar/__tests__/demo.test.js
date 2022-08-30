/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import adjustVue from '@/src/avatar/_example/adjust.vue';
import baseVue from '@/src/avatar/_example/base.vue';
import groupCascadingVue from '@/src/avatar/_example/group-cascading.vue';
import groupMaxVue from '@/src/avatar/_example/group-max.vue';
import groupVue from '@/src/avatar/_example/group.vue';
import shapeVue from '@/src/avatar/_example/shape.vue';
import sizeVue from '@/src/avatar/_example/size.vue';

const mapper = {
  adjustVue,
  baseVue,
  groupCascadingVue,
  groupMaxVue,
  groupVue,
  shapeVue,
  sizeVue,
};

describe('Avatar', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Avatar ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
