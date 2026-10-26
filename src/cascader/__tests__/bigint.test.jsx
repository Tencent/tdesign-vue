import { mount } from '@vue/test-utils';
import Cascader, { CascaderPanel } from '../index';
import { getTreeValue, isEmptyValues } from '../core/helper';

describe('Cascader bigint values', () => {
  const wrappers = [];
  const renderCascader = (props, component = Cascader) => {
    const wrapper = mount(component, { propsData: props });
    wrappers.push(wrapper);
    return wrapper;
  };
  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.destroy());
    document.querySelectorAll('.t-popup').forEach((element) => element.remove());
    vi.restoreAllMocks();
  });

  describe('props', () => {
    it.each(['value', 'defaultValue'])('displays the 0n path from %s without prop warnings', async (prop) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const wrapper = renderCascader({
        options: [{ label: 'parent', value: 1n, children: [{ label: 'zero', value: 0n }] }],
        [prop]: 0n,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('input').element.value).toBe('parent / zero');
      expect(error.mock.calls.some((args) => String(args[0]).includes('Invalid prop'))).toBe(false);
    });
  });

  describe('events', () => {
    it.each([0n, 9007199254740993n])('emits %s when selecting a leaf', async (value) => {
      const onChange = vi.fn();
      const wrapper = renderCascader({ options: [{ label: 'node', value }], onChange }, CascaderPanel);
      await wrapper.find('.t-cascader__item').trigger('click');
      expect(onChange).toHaveBeenCalledWith(value, expect.objectContaining({ source: 'check' }));
    });
  });

  describe('scenarios', () => {
    it.each([0n, 9007199254740993n, 0, '0'].map((value) => [value, typeof value]))(
      'preserves %s (%s) in selection normalization',
      (value) => {
        expect(isEmptyValues(value)).toBe(false);
        expect(getTreeValue(value)).toEqual([value]);
        expect(getTreeValue([value])).toEqual([value]);
      },
    );
  });
});
