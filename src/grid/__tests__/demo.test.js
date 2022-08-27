/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/grid/_example/base.vue';
import flexVue from '@/src/grid/_example/flex.vue';
import gutterVue from '@/src/grid/_example/gutter.vue';
import halignVue from '@/src/grid/_example/halign.vue';
import offsetVue from '@/src/grid/_example/offset.vue';
import orderVue from '@/src/grid/_example/order.vue';
import responsiveVue from '@/src/grid/_example/responsive.vue';
import sortVue from '@/src/grid/_example/sort.vue';
import valignVue from '@/src/grid/_example/valign.vue';

const mapper = {
  baseVue,
  flexVue,
  gutterVue,
  halignVue,
  offsetVue,
  orderVue,
  responsiveVue,
  sortVue,
  valignVue,
};

describe('Grid', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Grid ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
