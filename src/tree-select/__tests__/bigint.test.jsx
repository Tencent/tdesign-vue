import { mount } from '@vue/test-utils';
import TreeSelect from '../index';
import SelectInput from '../../select-input';

describe('TreeSelect bigint values', () => {
  const wrappers = [];
  const data = [{ label: 'zero', value: 0n }, { label: 'large', value: 9007199254740993n }];
  const renderSelect = async (props) => {
    const wrapper = mount(TreeSelect, { propsData: { data, popupVisible: true, ...props } });
    wrappers.push(wrapper);
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));
    return wrapper;
  };
  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.destroy());
    document.querySelectorAll('.t-popup').forEach((element) => element.remove());
    vi.restoreAllMocks();
  });

  describe('props', () => {
    it.each(['value', 'defaultValue'])('displays 0n from %s without Vue prop warnings', async (prop) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const wrapper = await renderSelect({ [prop]: 0n });
      expect(wrapper.findComponent(SelectInput).props('value')).toMatchObject(data[0]);
      expect(wrapper.vm.treeRef.$props.actived).toEqual([0n]);
      expect(error.mock.calls.some((args) => String(args[0]).includes('Invalid prop'))).toBe(false);
    });

    it('updates a controlled bigint selection and clears its display', async () => {
      const wrapper = await renderSelect({ value: 9007199254740993n });
      expect(wrapper.findComponent(SelectInput).props('value')).toMatchObject(data[1]);
      await wrapper.setProps({ value: 0n });
      expect(wrapper.findComponent(SelectInput).props('value')).toMatchObject(data[0]);
      await wrapper.setProps({ value: undefined });
      expect(wrapper.findComponent(SelectInput).props('value')).toBeUndefined();
    });
  });

  describe('scenarios', () => {
    it('selects and clears a zero bigint through public events', async () => {
      const onChange = vi.fn();
      const wrapper = await renderSelect({ onChange, clearable: true });
      wrapper.vm.treeRef.$el.querySelector('[data-value="0"] .t-tree__label').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await wrapper.vm.$nextTick();
      expect(onChange).toHaveBeenCalledWith(0n, expect.objectContaining({ trigger: 'check' }));
      wrapper.findComponent(SelectInput).vm.onClear({ e: new MouseEvent('click') });
      await wrapper.vm.$nextTick();
      expect(onChange).toHaveBeenLastCalledWith(undefined, expect.objectContaining({ trigger: 'clear' }));
    });

    it('preserves bigint multi-selection and removes only the requested tag', async () => {
      const onChange = vi.fn();
      const wrapper = await renderSelect({ multiple: true, defaultValue: [0n, 9007199254740993n], onChange });
      expect(wrapper.vm.treeRef.$props.value).toEqual([0n, 9007199254740993n]);
      wrapper.findComponent(SelectInput).vm.onTagChange([], { trigger: 'tag-remove', index: 0 });
      await wrapper.vm.$nextTick();
      expect(onChange).toHaveBeenCalledWith([9007199254740993n], expect.objectContaining({ trigger: 'tag-remove' }));
    });
  });
});
