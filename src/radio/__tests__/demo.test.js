/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/radio/_example/base.vue';
import groupVue from '@/src/radio/_example/group.vue';
import sizeVue from '@/src/radio/_example/size.vue';
import typeVue from '@/src/radio/_example/type.vue';

const mapper = {
  baseVue,
  groupVue,
  sizeVue,
  typeVue,
};

describe('Radio', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Radio ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
