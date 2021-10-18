import { mount } from '@vue/test-utils';
import demo from '@/examples/comment/demos/base.vue';

// unit test for component in examples.
describe('Comment', () => {
  it('base demo works fine', () => {
    const wrapper = mount(demo);
    expect(wrapper.element).toMatchSnapshot();
  });
});
