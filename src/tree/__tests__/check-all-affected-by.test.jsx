import {
  afterEach, describe, expect, it, vi,
} from 'vitest';
import { mount } from '@vue/test-utils';
import Tree from '@/src/tree';

const modes = ['all', 'parentFirst', 'onlyLeaf'];
const scopes = ['all', 'onlyEnabled'];
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
afterEach(() => wrappers.splice(0).forEach((wrapper) => wrapper.destroy()));

async function createTree(options = {}, initial = []) {
  const onChange = vi.fn();
  const wrapper = mount({
    data: () => ({ value: initial, options }),
    render(h) {
      return h(Tree, {
        ref: 'tree',
        props: {
          data,
          checkable: true,
          expandAll: true,
          transition: false,
          ...this.options,
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
  const input = (id) => wrapper.find(`[data-value="${id}"] input[type="checkbox"]`);
  const half = () => wrapper.find('[data-value="P"] .t-checkbox').classes('t-is-indeterminate');
  await vi.waitFor(() => expect(input('D').exists()).toBe(true));
  return {
    wrapper,
    input,
    half,
    onChange,
    click: async (id) => {
      input(id).element.click();
      await wrapper.vm.$nextTick();
    },
  };
}

describe('Tree checkAllAffectedBy', () => {
  it.each(modes)('defaults to all and preserves disabled children in %s mode', async (valueMode) => {
    const {
      wrapper, input, half, click,
    } = await createTree({ valueMode });
    expect(wrapper.findComponent(Tree).props('checkAllAffectedBy')).toBe('all');
    await click('P');
    await vi.waitFor(() => expect(wrapper.vm.value).toEqual(['A', 'B']));
    expect(wrapper.vm.$refs.tree.getItem('P').checked).toBe(false);
    expect(wrapper.find('[data-value="P"] .t-checkbox').classes('t-is-checked')).toBe(false);
    expect(half()).toBe(true);
    expect(input('D').element.disabled).toBe(true);
    expect(input('D').element.checked).toBe(false);
    await click('P');
    await vi.waitFor(() => expect(wrapper.vm.value).toEqual([]));
    expect(half()).toBe(false);
  });

  scopes.forEach((checkAllAffectedBy) => {
    it.each(modes)(`${checkAllAffectedBy} derives parent state after child clicks in %s mode`, async (valueMode) => {
      const {
        wrapper, input, half, click,
      } = await createTree({ valueMode, checkAllAffectedBy });
      await click('A');
      await vi.waitFor(() => expect(half()).toBe(true));
      await click('B');
      const enabledOnly = checkAllAffectedBy === 'onlyEnabled';
      await vi.waitFor(() => expect(input('P').element.checked).toBe(enabledOnly));
      expect(half()).toBe(!enabledOnly);
      const expected = enabledOnly && valueMode !== 'onlyLeaf'
        ? { all: ['P', 'A', 'B'], parentFirst: ['P'] }[valueMode] : ['A', 'B'];
      expect(wrapper.vm.value).toEqual(expected);
      expect(wrapper.element).toMatchSnapshot();
      await click('A');
      await vi.waitFor(() => expect(wrapper.vm.value).toEqual(['B']));
      expect(half()).toBe(true);
    });

    it.each(modes)(`${checkAllAffectedBy} retains an explicitly checked disabled child in %s mode`, async (valueMode) => {
      const {
        wrapper, input, half, click,
      } = await createTree({ valueMode, checkAllAffectedBy }, ['D']);
      await vi.waitFor(() => expect(input('D').element.checked).toBe(true));
      expect(half()).toBe(checkAllAffectedBy === 'all');
      await click('P');
      await vi.waitFor(() => expect(input('P').element.checked).toBe(true));
      await click('P');
      await vi.waitFor(() => expect(wrapper.vm.value).toEqual(['D']));
      expect(input('D').element.checked).toBe(true);
      expect(half()).toBe(checkAllAffectedBy === 'all');
    });

    it.each(modes)(`${checkAllAffectedBy} derives state from an initial parent value in %s mode`, async (valueMode) => {
      const { input, half } = await createTree({ valueMode, checkAllAffectedBy }, ['P']);
      await vi.waitFor(() => expect(input('A').element.checked).toBe(true));
      expect(input('D').element.checked).toBe(false);
      expect(input('P').element.checked).toBe(checkAllAffectedBy === 'onlyEnabled');
      expect(half()).toBe(checkAllAffectedBy === 'all');
    });

    it(`${checkAllAffectedBy} has no effect on strict checking`, async () => {
      const {
        wrapper, input, half, click,
      } = await createTree({ checkStrictly: true, checkAllAffectedBy });
      await click('P');
      await vi.waitFor(() => expect(wrapper.vm.value).toEqual(['P']));
      expect(input('A').element.checked).toBe(false);
      expect(input('D').element.checked).toBe(false);
      expect(half()).toBe(false);
    });
  });

  it.each(modes)('recalculates cached parent state when the scope changes in %s mode', async (valueMode) => {
    const {
      wrapper, input, half, onChange,
    } = await createTree({ valueMode, checkAllAffectedBy: 'onlyEnabled' }, ['A', 'B']);
    await vi.waitFor(() => expect(input('P').element.checked).toBe(true));
    await wrapper.setData({ options: { valueMode, checkAllAffectedBy: 'all' } });
    await vi.waitFor(() => expect(half()).toBe(true));
    expect(input('P').element.checked).toBe(false);
    expect(wrapper.vm.value).toEqual(['A', 'B']);
    await wrapper.setData({ options: { valueMode, checkAllAffectedBy: 'onlyEnabled' } });
    await vi.waitFor(() => expect(input('P').element.checked).toBe(true));
    expect(half()).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not derive full or partial selection from an empty enabled set', async () => {
    const onlyDisabled = [{ value: 'P', children: [{ value: 'D', disabled: true }] }];
    const {
      input, half, click, wrapper,
    } = await createTree({ data: onlyDisabled, checkAllAffectedBy: 'onlyEnabled' }, ['D']);
    expect(input('P').element.checked).toBe(false);
    expect(half()).toBe(false);
    await click('P');
    await vi.waitFor(() => expect(wrapper.vm.value).toEqual(['D']));
    expect(input('D').element.checked).toBe(true);
  });

  it('updates the parent when a child is disabled and enabled again', async () => {
    const { wrapper, input, half } = await createTree({ checkAllAffectedBy: 'onlyEnabled' }, ['A', 'B']);
    await vi.waitFor(() => expect(input('P').element.checked).toBe(true));
    wrapper.vm.$refs.tree.setItem('D', { disabled: false });
    await vi.waitFor(() => expect(half()).toBe(true));
    expect(input('P').element.checked).toBe(false);
    wrapper.vm.$refs.tree.setItem('D', { disabled: true });
    await vi.waitFor(() => expect(input('P').element.checked).toBe(true));
    expect(half()).toBe(false);
  });
});
