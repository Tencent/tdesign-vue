import { mount } from '@vue/test-utils';
import center from '@/examples/input-number/demos/center.vue';
import defaultDemo from '@/examples/input-number/demos/default.vue';
import disabled from '@/examples/input-number/demos/disabled.vue';
import formatter from '@/examples/input-number/demos/formatter.vue';
import left from '@/examples/input-number/demos/left.vue';
import size from '@/examples/input-number/demos/size.vue';
import step from '@/examples/input-number/demos/step.vue';
import undefinedDemo from '@/examples/input-number/demos/empty.vue';

describe('InputNumber', () => {
  it('center demo works fine', () => {
    const wrapper = mount(center);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('defaultDemo demo works fine', () => {
    const wrapper = mount(defaultDemo);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('disabled demo works fine', () => {
    const wrapper = mount(disabled);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('formatter demo works fine', () => {
    const wrapper = mount(formatter);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('left demo works fine', () => {
    const wrapper = mount(left);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('size demo works fine', () => {
    const wrapper = mount(size);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('step demo works fine', () => {
    const wrapper = mount(step);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('undefined demo works fine', () => {
    const wrapper = mount(undefinedDemo);
    expect(wrapper.element).toMatchSnapshot();
  });
});
