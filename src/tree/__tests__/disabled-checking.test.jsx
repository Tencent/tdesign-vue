import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { mount as mountVue } from '@vue/test-utils';
import AfterTree from '@/src/tree/index.ts';

const modes = ['all', 'parentFirst', 'onlyLeaf'];
const data = [
  {
    value: 'P',
    label: 'Parent',
    children: [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'D', label: 'Disabled', disabled: true },
    ],
  },
];
const cleanup = [];
afterEach(() => {
  cleanup.splice(0).forEach((fn) => fn());
});
async function mount(Component, mode, initial = []) {
  const onChange = vi.fn();
  const wrapper = mountVue(
    {
      data: () => ({ value: initial }),
      render(h) {
        return h(Component, {
          props: {
            data,
            checkable: true,
            expandAll: true,
            transition: false,
            valueMode: mode,
            checkAllAffectedBy: 'onlyEnabled',
            value: this.value,
            onChange: (next, context) => {
              onChange(next, context);
              this.value = next;
            },
          },
        });
      },
    },
    { attachTo: document.body },
  );
  cleanup.push(() => wrapper.destroy());
  const host = wrapper.element;
  const input = (id) => host.querySelector(`[data-value="${id}"] input[type="checkbox"]`);
  await vi.waitFor(() => expect(input('D')).toBeTruthy());
  return {
    host,
    value: {
      get value() {
        return wrapper.vm.value;
      },
    },
    onChange,
    input,
    click: async (id) => {
      input(id).click();
      await wrapper.vm.$nextTick();
    },
  };
}
const expected = (mode) => {
  if (mode === 'all') return ['P', 'A', 'B'];
  if (mode === 'parentFirst') return ['P'];
  return ['A', 'B'];
};
const half = (host, id) => host.querySelector(`[data-value="${id}"] .t-checkbox`).classList.contains('t-is-indeterminate');
describe('Tree disabled children controlled checking', () => {
  it.each(modes)('fixed parent checking and cancellation round-trip in %s', async (mode) => {
    const {
      host, input, value, click,
    } = await mount(AfterTree, mode);
    await click('P');
    await vi.waitFor(() => expect(input('P').checked).toBe(true));
    expect(value.value).toEqual(expected(mode));
    expect(half(host, 'P')).toBe(false);
    expect(input('D').disabled).toBe(true);
    expect(input('D').checked).toBe(false);
    await click('P');
    await vi.waitFor(() => expect(value.value).toEqual([]));
    expect(input('P').checked).toBe(false);
    expect(half(host, 'P')).toBe(false);
  });
  it.each(modes)('enabled children derive partial and full selection in %s', async (mode) => {
    const {
      host, input, value, click,
    } = await mount(AfterTree, mode);
    await click('A');
    await vi.waitFor(() => expect(half(host, 'P')).toBe(true));
    await click('B');
    await vi.waitFor(() => expect(input('P').checked).toBe(true));
    expect(half(host, 'P')).toBe(false);
    expect(value.value).toEqual(expected(mode));
    await click('A');
    await vi.waitFor(() => expect(half(host, 'P')).toBe(true));
    expect(value.value).toEqual(['B']);
  });
  it.each(['all', 'parentFirst'])('retains a selected disabled child in %s', async (mode) => {
    const { input, value, click } = await mount(AfterTree, mode, ['D']);
    await click('P');
    await vi.waitFor(() => expect(input('P').checked).toBe(true));
    expect(value.value).toEqual(mode === 'all' ? ['P', 'A', 'B', 'D'] : ['P', 'D']);
    expect(input('D').checked).toBe(true);
    await click('P');
    await vi.waitFor(() => expect(value.value).toEqual(['D']));
    expect(input('P').checked).toBe(false);
    expect(input('D').checked).toBe(true);
  });
});
