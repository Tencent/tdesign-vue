/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/pagination/_example/base.vue';
import customizableVue from '@/src/pagination/_example/customizable.vue';
import disabledVue from '@/src/pagination/_example/disabled.vue';
import fewVue from '@/src/pagination/_example/few.vue';
import jumpVue from '@/src/pagination/_example/jump.vue';
import miniVue from '@/src/pagination/_example/mini.vue';
import moreVue from '@/src/pagination/_example/more.vue';
import pageNumVue from '@/src/pagination/_example/page-num.vue';
import simpleMiniVue from '@/src/pagination/_example/simple-mini.vue';
import simpleVue from '@/src/pagination/_example/simple.vue';
import totalVue from '@/src/pagination/_example/total.vue';

const mapper = {
  baseVue,
  customizableVue,
  disabledVue,
  fewVue,
  jumpVue,
  miniVue,
  moreVue,
  pageNumVue,
  simpleMiniVue,
  simpleVue,
  totalVue,
};

describe('Pagination', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Pagination ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
