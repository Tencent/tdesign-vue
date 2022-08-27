/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import alignVue from '@/src/space/_example/align.vue';
import baseVue from '@/src/space/_example/base.vue';
import breakLineVue from '@/src/space/_example/break-line.vue';
import separatorVue from '@/src/space/_example/separator.vue';
import sizeVue from '@/src/space/_example/size.vue';
import verticalVue from '@/src/space/_example/vertical.vue';

const mapper = {
  alignVue,
  baseVue,
  breakLineVue,
  separatorVue,
  sizeVue,
  verticalVue,
};

describe('Space', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Space ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
