import { mount } from '@vue/test-utils';
import base from '@/examples/table/demos/base.vue';
import fixedHeader from '@/examples/table/demos/fixed-header.vue';
import fixedColumn from '@/examples/table/demos/fixed-column.vue';
import customCell from '@/examples/table/demos/custom-cell.vue';
import empty from '@/examples/table/demos/empty.vue';
import multiHeader from '@/examples/table/demos/multi-header.vue';
import expandable from '@/examples/table/demos/expandable.vue';
import selectSingle from '@/examples/table/demos/select-single.vue';
import selectMultiple from '@/examples/table/demos/select-multiple.vue';

// unit test for component in examples.
describe('Table', () => {
  it('base demo works fine', () => {
    const wrapper = mount(base);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('base demo works fine', () => {
    const wrapper = mount(base);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('fixedHeader demo works fine', () => {
    const wrapper = mount(fixedHeader);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('fixedColumn demo works fine', () => {
    const wrapper = mount(fixedColumn);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('customCell demo works fine', () => {
    const wrapper = mount(customCell);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('empty demo works fine', () => {
    const wrapper = mount(empty);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('multiHeader demo works fine', () => {
    const wrapper = mount(multiHeader);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('expandable demo works fine', () => {
    const wrapper = mount(expandable);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('selectSingle demo works fine', () => {
    const wrapper = mount(selectSingle);
    expect(wrapper.element).toMatchSnapshot();
  });
  it('selectMultiple demo works fine', () => {
    const wrapper = mount(selectMultiple);
    expect(wrapper.element).toMatchSnapshot();
  });
});
