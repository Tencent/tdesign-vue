import { mount } from '@vue/test-utils';
import TreeSelect from '../index';
import SelectInput from '../../select-input';

describe('TreeSelect custom object keys', () => {
  const wrappers = [];
  const keys = { value: 'id', label: 'name', children: 'nodes' };
  const data = [{ id: 'parent', name: 'parent', nodes: [{ id: 0, name: 'zero' }, { id: 'child', name: 'child' }] }];
  const renderSelect = async (props) => {
    const wrapper = mount(TreeSelect, {
      propsData: {
        data, keys, valueType: 'object', ...props,
      },
    });
    wrappers.push(wrapper);
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));
    return wrapper;
  };
  const selection = (wrapper) => wrapper.findComponent(SelectInput).props('value');
  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.destroy());
    document.querySelectorAll('.t-popup').forEach((element) => element.remove());
  });

  describe('scenarios', () => {
    it.each([0, 'child'])('resolves %s before and after the popup mounts', async (id) => {
      const wrapper = await renderSelect({ value: { id }, popupVisible: false });
      expect(selection(wrapper)).toMatchObject({ id, name: id === 0 ? 'zero' : 'child' });
      await wrapper.setProps({ popupVisible: true });
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(selection(wrapper)).toMatchObject({ id, name: id === 0 ? 'zero' : 'child' });
      expect(wrapper.vm.treeRef.$props.actived).toEqual([id]);
    });

    it('keeps normalized object values working with custom keys', async () => {
      const wrapper = await renderSelect({ value: { value: 0 }, popupVisible: true });
      expect(selection(wrapper)).toMatchObject({ id: 0, name: 'zero' });
      expect(wrapper.vm.treeRef.$props.actived).toEqual([0]);
    });

    it('prefers the configured value field when both fields exist', async () => {
      const wrapper = await renderSelect({ value: { id: 0, value: 'child' }, popupVisible: true });
      expect(selection(wrapper)).toMatchObject({ id: 0, name: 'zero' });
      expect(wrapper.vm.treeRef.$props.actived).toEqual([0]);
    });

    it('updates a controlled custom object selection', async () => {
      const wrapper = await renderSelect({ value: { id: 'child' }, popupVisible: true });
      await wrapper.setProps({ value: { id: 0 } });
      expect(selection(wrapper)).toMatchObject({ id: 0, name: 'zero' });
      await wrapper.setProps({ value: undefined });
      expect(selection(wrapper)).toBeUndefined();
    });

    it('displays custom object multi-selection and removes only the zero tag', async () => {
      const onChange = vi.fn();
      const onRemove = vi.fn();
      const wrapper = await renderSelect({
        multiple: true,
        defaultValue: [{ id: 0 }, { id: 'child' }],
        popupVisible: true,
        onChange,
        onRemove,
      });
      expect(selection(wrapper)).toEqual([
        expect.objectContaining({ id: 0, name: 'zero' }),
        expect.objectContaining({ id: 'child', name: 'child' }),
      ]);
      expect(wrapper.vm.treeRef.$props.value).toEqual([0, 'child']);
      wrapper.findComponent(SelectInput).vm.onTagChange([], { trigger: 'tag-remove', index: 0 });
      await wrapper.vm.$nextTick();
      expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ value: 0, data: expect.objectContaining({ id: 0 }) }));
      expect(onChange).toHaveBeenCalledWith([{ id: 'child' }], expect.objectContaining({ trigger: 'tag-remove' }));
      expect(selection(wrapper)).toEqual([expect.objectContaining({ id: 'child', name: 'child' })]);
    });

    it('does not emit another change when the selected custom-key node is activated again', async () => {
      const onChange = vi.fn();
      const wrapper = await renderSelect({ value: { id: 0 }, popupVisible: true, onChange });
      wrapper.vm.treeRef.$props.onActive([0], { node: wrapper.vm.treeRef.getItem(0) });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('looks up primitive selections through the configured children field', async () => {
      const wrapper = await renderSelect({ valueType: 'value', value: 'child', popupVisible: false });
      expect(selection(wrapper)).toMatchObject({ id: 'child', name: 'child' });
    });
  });
});
