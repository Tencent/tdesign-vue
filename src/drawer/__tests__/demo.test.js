/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import attachParentVue from '@/src/drawer/_example/attach-parent.vue';
import baseVue from '@/src/drawer/_example/base.vue';
import customVue from '@/src/drawer/_example/custom.vue';
import destroyVue from '@/src/drawer/_example/destroy.vue';
import noMaskVue from '@/src/drawer/_example/no-mask.vue';
import operationVue from '@/src/drawer/_example/operation.vue';
import placementVue from '@/src/drawer/_example/placement.vue';
import popupVue from '@/src/drawer/_example/popup.vue';
import sizeDraggableVue from '@/src/drawer/_example/size-draggable.vue';
import sizeVue from '@/src/drawer/_example/size.vue';

const mapper = {
  attachParentVue,
  baseVue,
  customVue,
  destroyVue,
  noMaskVue,
  operationVue,
  placementVue,
  popupVue,
  sizeDraggableVue,
  sizeVue,
};

describe('Drawer', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Drawer ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
