/**
 * 该文件为由脚本 `npm run test:demo` 自动生成，如需修改，执行脚本命令即可。请勿手写直接修改，否则会被覆盖
 */

import { mount } from '@vue/test-utils';
import baseVue from '@/src/upload/_example/base.vue';
import customDragVue from '@/src/upload/_example/custom-drag.vue';
import draggableVue from '@/src/upload/_example/draggable.vue';
import fileFlowListBatchUploadVue from '@/src/upload/_example/file-flow-list-batch-upload.vue';
import fileFlowListDuplicateVue from '@/src/upload/_example/file-flow-list-duplicate.vue';
import fileFlowListVue from '@/src/upload/_example/file-flow-list.vue';
import imageVue from '@/src/upload/_example/image.vue';
import imgFlowListVue from '@/src/upload/_example/img-flow-list.vue';
import listTypeVue from '@/src/upload/_example/listType.vue';
import requestMethodVue from '@/src/upload/_example/request-method.vue';
import singleCustomVue from '@/src/upload/_example/single-custom.vue';
import singleInputVue from '@/src/upload/_example/single-input.vue';
import tableVue from '@/src/upload/_example/table.vue';

const mapper = {
  baseVue,
  customDragVue,
  draggableVue,
  fileFlowListBatchUploadVue,
  fileFlowListDuplicateVue,
  fileFlowListVue,
  imageVue,
  imgFlowListVue,
  listTypeVue,
  requestMethodVue,
  singleCustomVue,
  singleInputVue,
  tableVue,
};

describe('Upload', () => {
  Object.keys(mapper).forEach((demoName) => {
    it(`Upload ${demoName} demo works fine`, () => {
      const wrapper = mount(mapper[demoName]);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
