import { mount } from '@vue/test-utils';
import demo from '@/examples/drawer/demos/base.vue';
import CurrentDOMModeUsageExample from '@/examples/drawer/demos/attach-parent.vue';
import destroy from '@/examples/drawer/demos/destroy.vue';
import CustomUsageExample from '@/examples/drawer/demos/custom.vue';
import PopupUsageExample from '@/examples/drawer/demos/popup.vue';
import NoMaskUsageExample from '@/examples/drawer/demos/no-mask.vue';
import operation from '@/examples/drawer/demos/operation.vue';
import PlacementUsageExample from '@/examples/drawer/demos/placement.vue';
import SizeUsageExample from '@/examples/drawer/demos/size.vue';

// unit test for component in examples.
describe('Drawer', () => {
  it('base demo works fine', () => {
    const wrapper = mount(demo);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('Demo CurrentDOMModeUsageExample works fine', () => {
    const wrapper = mount(CurrentDOMModeUsageExample);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('Demo destroy works fine', () => {
    const wrapper = mount(destroy);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('Demo CustomUsageExample works fine', () => {
    const wrapper = mount(CustomUsageExample);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('Demo PopupUsageExample works fine', () => {
    const wrapper = mount(PopupUsageExample);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('Demo NoMaskUsageExample works fine', () => {
    const wrapper = mount(NoMaskUsageExample);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('Demo operation works fine', () => {
    const wrapper = mount(operation);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('Demo PlacementUsageExample works fine', () => {
    const wrapper = mount(PlacementUsageExample);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('Demo SizeUsageExample works fine', () => {
    const wrapper = mount(SizeUsageExample);
    expect(wrapper.element).toMatchSnapshot();
  });
});
