import { mount } from '@vue/test-utils';
import base from '@/examples/pagination/demos/base.vue';
import customizable from '@/examples/pagination/demos/customizable.vue';
import disabled from '@/examples/pagination/demos/disabled.vue';
import few from '@/examples/pagination/demos/few.vue';
import jump from '@/examples/pagination/demos/jump.vue';
import mini from '@/examples/pagination/demos/mini.vue';
import more from '@/examples/pagination/demos/more.vue';
import pageNum from '@/examples/pagination/demos/page-num.vue';
import simpleMini from '@/examples/pagination/demos/simple-mini.vue';
import simple from '@/examples/pagination/demos/simple.vue';
import total from '@/examples/pagination/demos/total.vue';

// unit test for component in examples.
describe('Pagination', () => {
  it('base demo works fine', () => {
    const wrapper = mount(base);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('customizable demo works fine', () => {
    const wrapper = mount(customizable);
    expect(wrapper).toMatchSnapshot();
  });
  it('disabled demo works fine', () => {
    const wrapper = mount(disabled);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('few demo works fine', () => {
    const wrapper = mount(few);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('jump demo works fine', () => {
    const wrapper = mount(jump);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('mini works fine', () => {
    const wrapper = mount(mini);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('more works fine', () => {
    const wrapper = mount(more);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('page-num demo works fine', () => {
    const wrapper = mount(pageNum);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('simple-mini demo works fine', () => {
    const wrapper = mount(simpleMini);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('simple demo works fine', () => {
    const wrapper = mount(simple);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('total demo works fine', () => {
    const wrapper = mount(total);
    expect(wrapper.element).toMatchSnapshot();
  });
});
