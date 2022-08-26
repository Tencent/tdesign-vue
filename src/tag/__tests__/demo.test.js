/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/tag/_example/base.vue';
import deleteVue from '@/src/tag/_example/delete.vue';
import disabledVue from '@/src/tag/_example/disabled.vue';
import iconVue from '@/src/tag/_example/icon.vue';
import longTextVue from '@/src/tag/_example/long-text.vue';
import plainVue from '@/src/tag/_example/plain.vue';
import selectableVue from '@/src/tag/_example/selectable.vue';
import shapeVue from '@/src/tag/_example/shape.vue';
import sizeVue from '@/src/tag/_example/size.vue';
import themeVue from '@/src/tag/_example/theme.vue';

const mapper = {
  baseVue,
  deleteVue,
  disabledVue,
  iconVue,
  longTextVue,
  plainVue,
  selectableVue,
  shapeVue,
  sizeVue,
  themeVue,
};

describe('Tag', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Tag ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
