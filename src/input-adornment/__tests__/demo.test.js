/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import selectVue from '@/src/input-adornment/_example/select.vue';
import textVue from '@/src/input-adornment/_example/text.vue';

const mapper = {
  selectVue,
  textVue,
};

describe('InputAdornment', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`InputAdornment ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
