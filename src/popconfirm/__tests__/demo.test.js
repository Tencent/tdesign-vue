/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/popconfirm/_example/base.vue';
import buttonVue from '@/src/popconfirm/_example/button.vue';
import describeVue from '@/src/popconfirm/_example/describe.vue';
import iconVue from '@/src/popconfirm/_example/icon.vue';
import inheritVue from '@/src/popconfirm/_example/inherit.vue';

const mapper = {
  baseVue,
  buttonVue,
  describeVue,
  iconVue,
  inheritVue,
};

describe('Popconfirm', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Popconfirm ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
