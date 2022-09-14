/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/watermark/_example/base.vue';
import graylevelVue from '@/src/watermark/_example/graylevel.vue';
import imageVue from '@/src/watermark/_example/image.vue';
import movingImageVue from '@/src/watermark/_example/movingImage.vue';
import movingTextVue from '@/src/watermark/_example/movingText.vue';
import multilineVue from '@/src/watermark/_example/multiline.vue';

const mapper = {
  baseVue,
  graylevelVue,
  imageVue,
  movingImageVue,
  movingTextVue,
  multilineVue,
};

describe('Watermark', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Watermark ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
