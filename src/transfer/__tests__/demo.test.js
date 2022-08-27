/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/transfer/_example/base.vue';
import checkedVue from '@/src/transfer/_example/checked.vue';
import customVue from '@/src/transfer/_example/custom.vue';
import disabledVue from '@/src/transfer/_example/disabled.vue';
import emptyVue from '@/src/transfer/_example/empty.vue';
import paginationVue from '@/src/transfer/_example/pagination.vue';
import searchVue from '@/src/transfer/_example/search.vue';
import targetValueVue from '@/src/transfer/_example/target-value.vue';
import treeVue from '@/src/transfer/_example/tree.vue';

const mapper = {
  baseVue,
  checkedVue,
  customVue,
  disabledVue,
  emptyVue,
  paginationVue,
  searchVue,
  targetValueVue,
  treeVue,
};

describe('Transfer', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Transfer ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
