/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/cascader/_example/base.vue';
import checkStrictlyVue from '@/src/cascader/_example/check-strictly.vue';
import collapsedVue from '@/src/cascader/_example/collapsed.vue';
import disabledVue from '@/src/cascader/_example/disabled.vue';
import ellipsisVue from '@/src/cascader/_example/ellipsis.vue';
import filterableVue from '@/src/cascader/_example/filterable.vue';
import keysVue from '@/src/cascader/_example/keys.vue';
import loadVue from '@/src/cascader/_example/load.vue';
import maxVue from '@/src/cascader/_example/max.vue';
import multipleVue from '@/src/cascader/_example/multiple.vue';
import panelVue from '@/src/cascader/_example/panel.vue';
import showAllLevelsVue from '@/src/cascader/_example/show-all-levels.vue';
import sizeVue from '@/src/cascader/_example/size.vue';
import triggerVue from '@/src/cascader/_example/trigger.vue';
import valueModeVue from '@/src/cascader/_example/value-mode.vue';
import valueTypeVue from '@/src/cascader/_example/value-type.vue';

const mapper = {
  baseVue,
  checkStrictlyVue,
  collapsedVue,
  disabledVue,
  ellipsisVue,
  filterableVue,
  keysVue,
  loadVue,
  maxVue,
  multipleVue,
  panelVue,
  showAllLevelsVue,
  sizeVue,
  triggerVue,
  valueModeVue,
  valueTypeVue,
};

describe('Cascader', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Cascader ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
