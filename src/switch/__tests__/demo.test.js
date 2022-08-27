/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/switch/_example/base.vue';
import describeVue from '@/src/switch/_example/describe.vue';
import sizeVue from '@/src/switch/_example/size.vue';
import statusVue from '@/src/switch/_example/status.vue';

const mapper = {
  baseVue,
  describeVue,
  sizeVue,
  statusVue,
};

describe('Switch', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Switch ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
