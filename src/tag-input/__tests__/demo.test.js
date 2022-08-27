/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import autoWidthVue from '@/src/tag-input/_example/auto-width.vue';
import baseVue from '@/src/tag-input/_example/base.vue';
import collapsedVue from '@/src/tag-input/_example/collapsed.vue';
import customTagVue from '@/src/tag-input/_example/custom-tag.vue';
import draggableVue from '@/src/tag-input/_example/draggable.vue';
import excessVue from '@/src/tag-input/_example/excess.vue';
import maxVue from '@/src/tag-input/_example/max.vue';
import sizeVue from '@/src/tag-input/_example/size.vue';
import statusVue from '@/src/tag-input/_example/status.vue';
import themeVue from '@/src/tag-input/_example/theme.vue';

const mapper = {
  autoWidthVue,
  baseVue,
  collapsedVue,
  customTagVue,
  draggableVue,
  excessVue,
  maxVue,
  sizeVue,
  statusVue,
  themeVue,
};

describe('TagInput', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`TagInput ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
