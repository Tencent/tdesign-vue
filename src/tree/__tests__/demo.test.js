/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import activableVue from '@/src/tree/_example/activable.vue';
import baseVue from '@/src/tree/_example/base.vue';
import checkableVue from '@/src/tree/_example/checkable.vue';
import controlledVue from '@/src/tree/_example/controlled.vue';
import dataVue from '@/src/tree/_example/data.vue';
import disabledVue from '@/src/tree/_example/disabled.vue';
import emptyVue from '@/src/tree/_example/empty.vue';
import expandAllVue from '@/src/tree/_example/expand-all.vue';
import expandLevelVue from '@/src/tree/_example/expand-level.vue';
import expandMutexVue from '@/src/tree/_example/expand-mutex.vue';
import filterVue from '@/src/tree/_example/filter.vue';
import iconVue from '@/src/tree/_example/icon.vue';
import labelVue from '@/src/tree/_example/label.vue';
import lazyVue from '@/src/tree/_example/lazy.vue';
import lineVue from '@/src/tree/_example/line.vue';
import loadVue from '@/src/tree/_example/load.vue';
import operationsVue from '@/src/tree/_example/operations.vue';
import performanceVue from '@/src/tree/_example/performance.vue';
import stateVue from '@/src/tree/_example/state.vue';
import syncVue from '@/src/tree/_example/sync.vue';
import vscrollVue from '@/src/tree/_example/vscroll.vue';

const mapper = {
  activableVue,
  baseVue,
  checkableVue,
  controlledVue,
  dataVue,
  disabledVue,
  emptyVue,
  expandAllVue,
  expandLevelVue,
  expandMutexVue,
  filterVue,
  iconVue,
  labelVue,
  lazyVue,
  lineVue,
  loadVue,
  operationsVue,
  performanceVue,
  stateVue,
  syncVue,
  vscrollVue,
};

describe('Tree', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Tree ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
