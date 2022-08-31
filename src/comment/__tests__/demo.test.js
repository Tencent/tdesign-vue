/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/comment/_example/base.vue';
import listVue from '@/src/comment/_example/list.vue';
import operationVue from '@/src/comment/_example/operation.vue';
import quoteVue from '@/src/comment/_example/quote.vue';
import replyFormVue from '@/src/comment/_example/reply-form.vue';
import replyVue from '@/src/comment/_example/reply.vue';

const mapper = {
  baseVue,
  listVue,
  operationVue,
  quoteVue,
  replyFormVue,
  replyVue,
};

describe('Comment', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Comment ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
