import {
  afterEach, describe, expect, it, vi,
} from 'vitest';
import { mount } from '@vue/test-utils';
import TreeSelect from '@/src/tree-select';

const modes = ['all', 'parentFirst', 'onlyLeaf'];
const data = [{
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

async function createSelect(treeProps, initial = []) {
  const onChange = vi.fn();
  fixtureId += 1;
  const overlayClassName = `tree-select-check-all-${fixtureId}`;
  const wrapper = mount({
    data: () => ({ value: initial, treeProps }),
    render(h) {
      return h(TreeSelect, {
        props: {
          data,
          multiple: true,
          popupVisible: true,
          popupProps: { overlayClassName },
          treeProps: { expandAll: true, transition: false, ...this.treeProps },
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
  const checkbox = (id) => document.querySelector(`.${overlayClassName} [data-value="${id}"] .t-checkbox`);
  await vi.waitFor(() => expect(checkbox('D')).toBeTruthy());
  return {
    wrapper,
    checkbox,
    onChange,
    tags: () => wrapper.findAll('.t-tag').wrappers.map((tag) => tag.text()).sort(),
    click: async (id) => {
      checkbox(id).querySelector('input').click();
      await wrapper.vm.$nextTick();
    },
  };
}

describe('TreeSelect', () => {
  describe('scenarios', () => {
    describe('checkAllAffectedBy and valueMode', () => {
      [undefined, 'onlyEnabled'].forEach((checkAllAffectedBy) => {
        const scope = checkAllAffectedBy || 'all';
        const scopeProps = checkAllAffectedBy ? { checkAllAffectedBy } : {};

        it.each(modes)(`${scope} emits values and renders tags in %s mode`, async (valueMode) => {
          const {
            wrapper, checkbox, click, tags, onChange,
          } = await createSelect({ ...scopeProps, valueMode });
          await click('P');
          const expected = scope === 'all' || valueMode === 'onlyLeaf'
            ? ['A', 'B'] : { all: ['P', 'A', 'B'], parentFirst: ['P'] }[valueMode];
          await vi.waitFor(() => expect(wrapper.vm.value).toEqual(expected));
          expect(onChange.mock.calls.at(-1)[0]).toEqual(expected);
          await vi.waitFor(() => {
            expect(checkbox('P').classList.contains('t-is-checked')).toBe(scope === 'onlyEnabled');
            expect(checkbox('P').classList.contains('t-is-indeterminate')).toBe(scope === 'all');
          });
          expect(checkbox('D').querySelector('input').disabled).toBe(true);
          expect(checkbox('D').classList.contains('t-is-checked')).toBe(false);
          expect(tags()).toEqual(expected.map((value) => (value === 'P' ? 'Parent' : value)).sort());
          await click('P');
          await vi.waitFor(() => expect(wrapper.vm.value).toEqual([]));
          expect(tags()).toEqual([]);
          await vi.waitFor(() => expect(checkbox('P').classList.contains('t-is-indeterminate')).toBe(false));
          await click('A');
          await vi.waitFor(() => expect(checkbox('P').classList.contains('t-is-indeterminate')).toBe(true));
          await click('B');
          await vi.waitFor(() => expect(wrapper.vm.value).toEqual(expected));
          await vi.waitFor(() => expect(checkbox('P').classList.contains('t-is-checked')).toBe(scope === 'onlyEnabled'));
          expect(tags()).toEqual(expected.map((value) => (value === 'P' ? 'Parent' : value)).sort());
        });

        it(`${scope} preserves disabled selection and tags when toggling the parent`, async () => {
          const {
            wrapper, checkbox, click, tags,
          } = await createSelect({ ...scopeProps, valueMode: 'parentFirst' }, ['D']);
          await vi.waitFor(() => expect(tags()).toEqual(['Disabled']));
          expect(checkbox('P').classList.contains('t-is-indeterminate')).toBe(scope === 'all');
          await click('P');
          await vi.waitFor(() => expect(wrapper.vm.value).toEqual(['P', 'D']));
          expect(tags()).toEqual(['Disabled', 'Parent']);
          expect(checkbox('D').classList.contains('t-is-checked')).toBe(true);
          await click('P');
          await vi.waitFor(() => expect(wrapper.vm.value).toEqual(['D']));
          expect(tags()).toEqual(['Disabled']);
          expect(checkbox('D').classList.contains('t-is-checked')).toBe(true);
          expect(checkbox('P').classList.contains('t-is-indeterminate')).toBe(scope === 'all');
        });
      });
    });

    describe('dynamic treeProps', () => {
      it('updates parent selection from treeProps without emitting change', async () => {
        const {
          wrapper, checkbox, onChange, tags, click,
        } = await createSelect({ valueMode: 'parentFirst', checkAllAffectedBy: 'onlyEnabled' }, ['A', 'B']);
        await vi.waitFor(() => expect(checkbox('P').classList.contains('t-is-checked')).toBe(true));
        await wrapper.setData({ treeProps: { valueMode: 'parentFirst', checkAllAffectedBy: 'all' } });
        await vi.waitFor(() => expect(checkbox('P').classList.contains('t-is-indeterminate')).toBe(true));
        expect(checkbox('P').classList.contains('t-is-checked')).toBe(false);
        expect(wrapper.vm.value).toEqual(['A', 'B']);
        expect(tags()).toEqual(['A', 'B']);
        await wrapper.setData({ treeProps: { valueMode: 'parentFirst', checkAllAffectedBy: 'onlyEnabled' } });
        await vi.waitFor(() => expect(checkbox('P').classList.contains('t-is-checked')).toBe(true));
        expect(onChange).not.toHaveBeenCalled();
        expect(wrapper.vm.value).toEqual(['A', 'B']);
        expect(tags()).toEqual(['A', 'B']);
        await click('P');
        await vi.waitFor(() => expect(wrapper.vm.value).toEqual([]));
        expect(tags()).toEqual([]);
        expect(onChange).toHaveBeenCalledTimes(1);
      });
    });
  });
});
