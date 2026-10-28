import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { mount as mountVue } from '@vue/test-utils';
import Tree from '@/src/tree/index.ts';

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
async function mountTree(mode, initial = []) {
  const onChange = vi.fn();
  const wrapper = mountVue(
    {
      data: () => ({ value: initial }),
      render(h) {
        return h(Tree, {
          props: {
            data,
            checkable: true,
            expandAll: true,
            transition: false,
            valueMode: mode,
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
const checked = (host, id) => host.querySelector(`[data-value="${id}"] .t-checkbox`).classList.contains('t-is-checked');
const half = (host, id) => host.querySelector(`[data-value="${id}"] .t-checkbox`).classList.contains('t-is-indeterminate');
describe('Tree', () => {
  describe('scenarios', () => {
    describe('default all with disabled children', () => {
      it.each(modes)(
        'keeps the parent half-selected when checking enabled children through the parent in %s mode',
        async (mode) => {
          const {
            host, input, value, click,
          } = await mountTree(mode);
          await click('P');
          await vi.waitFor(() => expect(value.value).toEqual(['A', 'B']));
          expect(checked(host, 'P')).toBe(false);
          expect(half(host, 'P')).toBe(true);
          expect(input('D').disabled).toBe(true);
          expect(input('D').checked).toBe(false);
          await click('P');
          await vi.waitFor(() => expect(value.value).toEqual([]));
          expect(checked(host, 'P')).toBe(false);
          expect(half(host, 'P')).toBe(false);
        },
      );
      it.each(modes)('keeps the parent half-selected after checking all enabled children in %s mode', async (mode) => {
        const {
          host, input, value, click,
        } = await mountTree(mode);
        await click('A');
        await vi.waitFor(() => expect(half(host, 'P')).toBe(true));
        await click('B');
        await vi.waitFor(() => expect(value.value).toEqual(['A', 'B']));
        expect(checked(host, 'P')).toBe(false);
        expect(half(host, 'P')).toBe(true);
        expect(input('D').checked).toBe(false);
        await click('A');
        await vi.waitFor(() => expect(half(host, 'P')).toBe(true));
        expect(value.value).toEqual(['B']);
      });
      it.each(['all', 'parentFirst'])(
        'preserves disabled selection when toggling the parent in %s mode',
        async (mode) => {
          const {
            host, input, value, click,
          } = await mountTree(mode, ['D']);
          await click('P');
          await vi.waitFor(() => expect(checked(host, 'P')).toBe(true));
          expect(value.value).toEqual(mode === 'all' ? ['P', 'A', 'B', 'D'] : ['P', 'D']);
          expect(input('D').checked).toBe(true);
          await click('P');
          await vi.waitFor(() => expect(value.value).toEqual(['D']));
          expect(checked(host, 'P')).toBe(false);
          expect(half(host, 'P')).toBe(true);
          expect(input('D').checked).toBe(true);
        },
      );
    });
  });
});
