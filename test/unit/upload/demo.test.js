import { mount } from '@vue/test-utils';
import demo from '@/src/upload/index.ts';
import customDrag from '@/examples/upload/demos/custom-drag.vue';
import draggable from '@/examples/upload/demos/draggable.vue';
import fileFlowListBatchUpload from '@/examples/upload/demos/file-flow-list-batch-upload.vue';
import fileFlowList from '@/examples/upload/demos/file-flow-list.vue';
import listType from '@/examples/upload/demos/listType.vue';
import image from '@/examples/upload/demos/image.vue';
import imgFlowList from '@/examples/upload/demos/img-flow-list.vue';
import requestMethod from '@/examples/upload/demos/request-method.vue';
import singleCustom from '@/examples/upload/demos/single-custom.vue';
import singleInput from '@/examples/upload/demos/single-input.vue';
import table from '@/examples/upload/demos/table.vue';
import fileFlowListDuplicate from '@/examples/upload/demos/file-flow-list-duplicate.vue';

// unit test for component in examples.
describe('Upload', () => {
  it('base comp works fine', () => {
    const wrapper = mount(demo);
    expect(wrapper.element).toMatchSnapshot();
  });
  // it('base demo works fine', () => {
  //   const wrapper = mount(base);
  //   expect(wrapper.element).toMatchSnapshot();
  // });
  it('base customDrag works fine', () => {
    const wrapper = mount(customDrag);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base draggable works fine', () => {
    const wrapper = mount(draggable);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base fileFlowListBatchUpload works fine', () => {
    const wrapper = mount(fileFlowListBatchUpload);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base fileFlowList works fine', () => {
    const wrapper = mount(fileFlowList);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base listType works fine', () => {
    const wrapper = mount(listType);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base image works fine', () => {
    const wrapper = mount(image);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base imgFlowList works fine', () => {
    const wrapper = mount(imgFlowList);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base requestMethod works fine', () => {
    const wrapper = mount(requestMethod);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base singleCustom works fine', () => {
    const wrapper = mount(singleCustom);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base singleInput works fine', () => {
    const wrapper = mount(singleInput);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base table works fine', () => {
    const wrapper = mount(table);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base fileFlowListDuplicate works fine', () => {
    const wrapper = mount(fileFlowListDuplicate);
    expect(wrapper.element).toMatchSnapshot();
  });
});
