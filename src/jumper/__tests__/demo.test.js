/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import layoutVue from '@/src/jumper/_example/layout.vue';
import sizeVue from '@/src/jumper/_example/size.vue';
import tipsVue from '@/src/jumper/_example/tips.vue';

const mapper = {
  layoutVue,
  sizeVue,
  tipsVue,
};

describe('Jumper', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Jumper ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
