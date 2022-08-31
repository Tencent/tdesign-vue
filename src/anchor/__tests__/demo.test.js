/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/anchor/_example/base.vue';
import containerVue from '@/src/anchor/_example/container.vue';
import cursorVue from '@/src/anchor/_example/cursor.vue';
import largeVue from '@/src/anchor/_example/large.vue';
import multipleVue from '@/src/anchor/_example/multiple.vue';
import smallVue from '@/src/anchor/_example/small.vue';
import targetVue from '@/src/anchor/_example/target.vue';

const mapper = {
  baseVue,
  containerVue,
  cursorVue,
  largeVue,
  multipleVue,
  smallVue,
  targetVue,
};

describe('Anchor', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Anchor ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
