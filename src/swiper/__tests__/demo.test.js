/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/swiper/_example/base.vue';
import cardVue from '@/src/swiper/_example/card.vue';
import currentVue from '@/src/swiper/_example/current.vue';
import fadeVue from '@/src/swiper/_example/fade.vue';
import fractionVue from '@/src/swiper/_example/fraction.vue';
import placementVue from '@/src/swiper/_example/placement.vue';
import sizeVue from '@/src/swiper/_example/size.vue';
import verticalVue from '@/src/swiper/_example/vertical.vue';

const mapper = {
  baseVue,
  cardVue,
  currentVue,
  fadeVue,
  fractionVue,
  placementVue,
  sizeVue,
  verticalVue,
};

describe('Swiper', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Swiper ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
