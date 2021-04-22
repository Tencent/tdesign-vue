import { mount } from '@vue/test-utils';
import base from '@/examples/list/demos/base.vue';
import extra from '@/examples/list/demos/extra.vue';
import headerFooter from '@/examples/list/demos/headerFooter.vue';
import imageText from '@/examples/list/demos/imageText.vue';
import multiline from '@/examples/list/demos/multiline.vue';
import operation from '@/examples/list/demos/operation.vue';
import scroll from '@/examples/list/demos/scroll.vue';
import size from '@/examples/list/demos/size.vue';

describe('Button', () => {
  it('base demo works fine', () => {
    const wrapper = mount(base);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('extra demo works fine', () => {
    const wrapper = mount(extra);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('headerFooter demo works fine', () => {
    const wrapper = mount(headerFooter);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('imageText demo works fine', () => {
    const wrapper = mount(imageText);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('multiline demo works fine', () => {
    const wrapper = mount(multiline);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('operation demo works fine', () => {
    const wrapper = mount(operation);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('scroll demo works fine', () => {
    const wrapper = mount(scroll);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('size demo works fine', () => {
    const wrapper = mount(size);
    expect(wrapper.element).toMatchSnapshot();
  });
});
