/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/card/_example/base.vue';
import borderedNoneVue from '@/src/card/_example/bordered-none.vue';
import borderedVue from '@/src/card/_example/bordered.vue';
import footerActionsVue from '@/src/card/_example/footer-actions.vue';
import footerContentActionsVue from '@/src/card/_example/footer-content-actions.vue';
import footerContentVue from '@/src/card/_example/footer-content.vue';
import footerVue from '@/src/card/_example/footer.vue';
import headerAllPropsVue from '@/src/card/_example/header-all-props.vue';
import headerBorderedVue from '@/src/card/_example/header-bordered.vue';
import headerDescriptionVue from '@/src/card/_example/header-description.vue';
import headerFooterActionsVue from '@/src/card/_example/header-footer-actions.vue';
import headerSubtitleFooterActionsVue from '@/src/card/_example/header-subtitle-footer-actions.vue';
import headerSubtitleVue from '@/src/card/_example/header-subtitle.vue';
import headerVue from '@/src/card/_example/header.vue';
import hoverVue from '@/src/card/_example/hover.vue';
import smallVue from '@/src/card/_example/small.vue';

const mapper = {
  baseVue,
  borderedNoneVue,
  borderedVue,
  footerActionsVue,
  footerContentActionsVue,
  footerContentVue,
  footerVue,
  headerAllPropsVue,
  headerBorderedVue,
  headerDescriptionVue,
  headerFooterActionsVue,
  headerSubtitleFooterActionsVue,
  headerSubtitleVue,
  headerVue,
  hoverVue,
  smallVue,
};

describe('Card', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Card ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
