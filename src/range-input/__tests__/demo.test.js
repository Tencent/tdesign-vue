/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/range-input/_example/base.vue';
import popupVue from '@/src/range-input/_example/popup.vue';
import sizeVue from '@/src/range-input/_example/size.vue';
import statusVue from '@/src/range-input/_example/status.vue';

const mapper = {
  baseVue,
  popupVue,
  sizeVue,
  statusVue,
};

describe('RangeInput', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`RangeInput ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
