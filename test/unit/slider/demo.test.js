import { mount } from '@vue/test-utils';

// unit test for component in examples.
describe('Slider', () => {
  it('base demo works fine', () => {
    const demo = require('@/examples/slider/demos/base.vue');
    const wrapper = mount(demo);
    expect(wrapper.element).toMatchSnapshot();
  });
});
