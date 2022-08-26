/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import extraVue from '@/src/steps/_example/extra.vue';
import iconVue from '@/src/steps/_example/icon.vue';
import noSequenceVue from '@/src/steps/_example/no-sequence.vue';
import optionsVue from '@/src/steps/_example/options.vue';
import sequenceVue from '@/src/steps/_example/sequence.vue';
import statusVue from '@/src/steps/_example/status.vue';
import verticalNoSequenceVue from '@/src/steps/_example/vertical-no-sequence.vue';
import verticalSequenceVue from '@/src/steps/_example/vertical-sequence.vue';

const mapper = {
  extraVue,
  iconVue,
  noSequenceVue,
  optionsVue,
  sequenceVue,
  statusVue,
  verticalNoSequenceVue,
  verticalSequenceVue,
};

describe('Steps', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Steps ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
