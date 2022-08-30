/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/badge/_example/base.vue';
import customVue from '@/src/badge/_example/custom.vue';
import numberVue from '@/src/badge/_example/number.vue';
import offsetVue from '@/src/badge/_example/offset.vue';
import shapeVue from '@/src/badge/_example/shape.vue';
import sizeVue from '@/src/badge/_example/size.vue';

const mapper = {
  baseVue,
  customVue,
  numberVue,
  offsetVue,
  shapeVue,
  sizeVue,
};

describe('Badge', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Badge ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
