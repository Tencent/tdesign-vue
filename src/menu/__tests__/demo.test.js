/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import closableSideVue from '@/src/menu/_example/closable-side.vue';
import customHeaderVue from '@/src/menu/_example/custom-header.vue';
import customSideVue from '@/src/menu/_example/custom-side.vue';
import doubleVue from '@/src/menu/_example/double.vue';
import groupSideVue from '@/src/menu/_example/group-side.vue';
import headMenuDarkVue from '@/src/menu/_example/head-menu-dark.vue';
import headMenuEmptyVue from '@/src/menu/_example/head-menu-empty.vue';
import headMenuModeTileVue from '@/src/menu/_example/head-menu-mode-tile.vue';
import headMenuTileVue from '@/src/menu/_example/head-menu-tile.vue';
import multiSideVue from '@/src/menu/_example/multi-side.vue';
import multipleVue from '@/src/menu/_example/multiple.vue';
import popupSideVue from '@/src/menu/_example/popup-side.vue';
import sideMenuWidthVue from '@/src/menu/_example/side-menu-width.vue';
import singleSideVue from '@/src/menu/_example/single-side.vue';
import singleVue from '@/src/menu/_example/single.vue';

const mapper = {
  closableSideVue,
  customHeaderVue,
  customSideVue,
  doubleVue,
  groupSideVue,
  headMenuDarkVue,
  headMenuEmptyVue,
  headMenuModeTileVue,
  headMenuTileVue,
  multiSideVue,
  multipleVue,
  popupSideVue,
  sideMenuWidthVue,
  singleSideVue,
  singleVue,
};

describe('Menu', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Menu ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
