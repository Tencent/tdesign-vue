/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import autocompleteVue from '@/src/select-input/_example/autocomplete.vue';
import autowidthMultipleVue from '@/src/select-input/_example/autowidth-multiple.vue';
import autowidthVue from '@/src/select-input/_example/autowidth.vue';
import borderlessMultipleVue from '@/src/select-input/_example/borderless-multiple.vue';
import borderlessVue from '@/src/select-input/_example/borderless.vue';
import collapsedItemsVue from '@/src/select-input/_example/collapsed-items.vue';
import customTagVue from '@/src/select-input/_example/custom-tag.vue';
import excessTagsDisplayTypeVue from '@/src/select-input/_example/excess-tags-display-type.vue';
import labelSuffixVue from '@/src/select-input/_example/label-suffix.vue';
import multipleVue from '@/src/select-input/_example/multiple.vue';
import singleVue from '@/src/select-input/_example/single.vue';
import statusVue from '@/src/select-input/_example/status.vue';
import widthVue from '@/src/select-input/_example/width.vue';

const mapper = {
  autocompleteVue,
  autowidthMultipleVue,
  autowidthVue,
  borderlessMultipleVue,
  borderlessVue,
  collapsedItemsVue,
  customTagVue,
  excessTagsDisplayTypeVue,
  labelSuffixVue,
  multipleVue,
  singleVue,
  statusVue,
  widthVue,
};

describe('SelectInput', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`SelectInput ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
