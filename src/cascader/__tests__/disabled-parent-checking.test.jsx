import {
  afterEach, describe, expect, it, vi,
} from 'vitest';
import { mount } from '@vue/test-utils';
import Cascader from '@/src/cascader';

const modes = ['all', 'parentFirst', 'onlyLeaf'];
const options = [{
  value: 'P',
  label: 'Parent',
  children: [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'D', label: 'Disabled', disabled: true },
  ],
}];
const wrappers = [];
let fixtureId = 0;
afterEach(() => wrappers.splice(0).forEach((wrapper) => wrapper.destroy()));

async function createCascader(props = {}, initial = []) {
  const onChange = vi.fn();
  fixtureId += 1;
  const overlayClassName = `cascader-disabled-parent-${fixtureId}`;
  const wrapper = mount({
    data: () => ({ value: initial }),
    render(h) {
      return h(Cascader, {
        props: {
          options,
          multiple: true,
          popupVisible: true,
          popupProps: { overlayClassName },
          showAllLevels: false,
          ...props,
          value: this.value,
          onChange: (value, context) => {
            this.value = value;
            onChange(value, context);
          },
        },
      });
    },
  }, { attachTo: document.body });
  wrappers.push(wrapper);
  const input = (id) => document.querySelector(`.${overlayClassName} input[name="${id}"]`);
  const checkbox = (id) => input(id).closest('.t-checkbox');
  await vi.waitFor(() => expect(input('P')).toBeTruthy());
  // Expand the parent item without toggling its checkbox.
  input('P').closest('li').click();
  await vi.waitFor(() => expect(input('D')).toBeTruthy());
  onChange.mockClear();
  return {
    wrapper,
    onChange,
    checked: (id) => checkbox(id).classList.contains('t-is-checked'),
    half: () => checkbox('P').classList.contains('t-is-indeterminate'),
    disabled: (id) => input(id).disabled,
    tags: () => wrapper.findAll('.t-tag').wrappers.map((tag) => tag.text()).sort(),
    click: async (id) => {
      input(id).click();
      await wrapper.vm.$nextTick();
    },
  };
}

describe('Cascader disabled children compatibility', () => {
  it.each(modes)('keeps the existing enabled-only parent calculation and controlled values in %s mode', async (valueMode) => {
    const {
      wrapper, checked, half, disabled, click, tags, onChange,
    } = await createCascader({ valueMode });
    await click('P');
    const expected = { all: ['P', 'A', 'B'], parentFirst: ['P'], onlyLeaf: ['A', 'B'] }[valueMode];
    await vi.waitFor(() => expect(wrapper.vm.value).toEqual(expected));
    expect(onChange.mock.calls.at(-1)[0]).toEqual(expected);
    expect(checked('P')).toBe(true);
    expect(half()).toBe(false);
    expect(disabled('D')).toBe(true);
    expect(checked('D')).toBe(false);
    expect(tags()).toEqual(expected.map((value) => (value === 'P' ? 'Parent' : value)).sort());
    await click('P');
    await vi.waitFor(() => expect(wrapper.vm.value).toEqual([]));
    expect(tags()).toEqual([]);
    await click('A');
    await vi.waitFor(() => expect(half()).toBe(true));
    await click('B');
    await vi.waitFor(() => expect(wrapper.vm.value).toEqual(expected));
    expect(checked('P')).toBe(true);
    expect(half()).toBe(false);
  });

  it.each(modes)('retains explicitly selected disabled values and tags in %s mode', async (valueMode) => {
    const {
      wrapper, checked, half, click, tags,
    } = await createCascader({ valueMode }, ['D']);
    await vi.waitFor(() => expect(tags()).toEqual(['Disabled']));
    expect(checked('D')).toBe(true);
    expect(half()).toBe(false);
    await click('P');
    await vi.waitFor(() => expect(checked('P')).toBe(true));
    expect(checked('D')).toBe(true);
    await click('P');
    await vi.waitFor(() => expect(wrapper.vm.value).toEqual(['D']));
    expect(checked('D')).toBe(true);
    expect(half()).toBe(false);
    expect(tags()).toEqual(['Disabled']);
  });

  it('preserves full-path values through parentFirst compression and cancellation', async () => {
    const {
      wrapper, checked, click, tags,
    } = await createCascader({ valueMode: 'parentFirst', valueType: 'full' });
    await click('P');
    await vi.waitFor(() => expect(wrapper.vm.value).toEqual([['P']]));
    expect(checked('P')).toBe(true);
    expect(checked('D')).toBe(false);
    expect(tags()).toEqual(['Parent']);
    await click('P');
    await vi.waitFor(() => expect(wrapper.vm.value).toEqual([]));
    expect(tags()).toEqual([]);
  });
});
