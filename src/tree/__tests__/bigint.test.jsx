import { mount } from '@vue/test-utils';
import Tree from '../index';

describe('Tree bigint values', () => {
  const wrappers = [];
  const renderTree = (props) => {
    const wrapper = mount(Tree, { propsData: { transition: false, ...props } });
    wrappers.push(wrapper);
    return wrapper;
  };
  afterEach(() => wrappers.splice(0).forEach((wrapper) => wrapper.destroy()));

  describe('events', () => {
    it.each([0n, 9007199254740993n])('activates %s without losing its type or precision', async (value) => {
      const onActive = vi.fn();
      const wrapper = renderTree({ data: [{ label: 'node', value }], activable: true, onActive });
      await wrapper.find('.t-tree__label').trigger('click');
      expect(onActive).toHaveBeenCalledWith([value], expect.objectContaining({ trigger: 'node-click' }));
      expect(wrapper.vm.getItem(value).actived).toBe(true);
    });
  });

  describe('instanceFunctions', () => {
    it('keeps number, string and bigint keys distinct in lookup and tree data', () => {
      const data = [1, '1', 1n, 9007199254740992n, 9007199254740993n].map((value, index) => ({
        value,
        children: [{ value: `child-${index}` }],
      }));
      const wrapper = renderTree({ data });
      data.forEach(({ value }) => expect(wrapper.vm.getItem(value).value).toBe(value));
      expect(wrapper.vm.getTreeData()).toEqual(data);
      expect(wrapper.vm.getTreeData(1n)).toEqual([data[2]]);
    });

    it('expands, checks, appends to and removes children of 0n', async () => {
      const wrapper = renderTree({
        data: [{ value: 0n, children: [{ value: 2n }] }, { value: 1n }],
        checkable: true,
      });
      wrapper.vm.setItem(0n, { expanded: true });
      wrapper.vm.setItem(2n, { checked: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.getItem(0n).expanded).toBe(true);
      expect(wrapper.vm.getItem(2n).checked).toBe(true);
      expect(wrapper.vm.getItems(0n).map((node) => node.value)).toEqual([0n, 2n]);
      wrapper.vm.appendTo(0n, { value: 3n });
      expect(wrapper.vm.getParent(3n).value).toBe(0n);
      wrapper.vm.getItem(0n).remove(2n);
      expect(wrapper.vm.getItem(2n)).toBeUndefined();
      expect(wrapper.vm.getItem(0n)).toBeTruthy();
      expect(wrapper.vm.getTreeData(0n)[0].children.map((node) => node.value)).toEqual([3n]);
    });

    it.each(['appendTo', 'insertBefore', 'insertAfter'])('moves the existing zero node with %s', (method) => {
      const wrapper = renderTree({ data: [{ value: 0n, children: [{ value: 2n }] }, { value: 1n }] });
      const original = wrapper.vm.getItem(0n);
      wrapper.vm[method](1n, { value: 0n });
      expect(wrapper.vm.getItem(0n)).toBe(original);
      expect(wrapper.vm.getParent(2n).value).toBe(0n);
      expect(wrapper.vm.getItems().filter((node) => node.value === 0n)).toHaveLength(1);
    });

    it.each([0n, 9007199254740993n])('accepts %s as a scroll target', (value) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const wrapper = renderTree({ data: [{ value: 1n }, { value: 0n }, { value: 9007199254740993n }] });
      wrapper.element.scrollTo = vi.fn();
      wrapper.vm.scrollTo({ key: value });
      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });
  });
});
