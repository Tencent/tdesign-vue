/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/tree-select/_example/base.vue';
import collapsedVue from '@/src/tree-select/_example/collapsed.vue';
import dvalueVue from '@/src/tree-select/_example/dvalue.vue';
import filterableVue from '@/src/tree-select/_example/filterable.vue';
import lazyVue from '@/src/tree-select/_example/lazy.vue';
import multipleVue from '@/src/tree-select/_example/multiple.vue';
import prefixVue from '@/src/tree-select/_example/prefix.vue';
import propsVue from '@/src/tree-select/_example/props.vue';
import valuedisplayVue from '@/src/tree-select/_example/valuedisplay.vue';
import valuetypeVue from '@/src/tree-select/_example/valuetype.vue';

const mapper = {
  baseVue,
  collapsedVue,
  dvalueVue,
  filterableVue,
  lazyVue,
  multipleVue,
  prefixVue,
  propsVue,
  valuedisplayVue,
  valuetypeVue,
};

describe('TreeSelect', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`TreeSelect ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
