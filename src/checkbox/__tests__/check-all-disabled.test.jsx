import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import CheckboxGroup from '../group';
import Checkbox from '../checkbox';

const flush = async () => {
  await nextTick();
  await new Promise((r) => setTimeout(r, 20));
  await nextTick();
};

// 取自渲染结果里的第一个 label.t-checkbox 就是全选项
const checkAllLabel = (wrapper) => wrapper.element.querySelector('label.t-checkbox');
const isAllChecked = (wrapper) => checkAllLabel(wrapper).classList.contains('t-is-checked');

describe('CheckboxGroup checkAll with disabled options (issue #3809)', () => {
  it('does not report all-checked when every selectable option is disabled', async () => {
    const wrapper = mount({
      render() {
        return (
          <CheckboxGroup defaultValue={[]}>
            <Checkbox checkAll>全选</Checkbox>
            <Checkbox value="a" disabled>选项 A</Checkbox>
            <Checkbox value="b" disabled>选项 B</Checkbox>
          </CheckboxGroup>
        );
      },
    });
    await flush();

    // eslint-disable-next-line no-console
    console.log('ALL-CHECKED (all disabled):', isAllChecked(wrapper));
    expect(isAllChecked(wrapper)).toBe(false);
  });

  it('still reports all-checked when all selectable options are checked', async () => {
    // 反向保护：正常全选不能被破坏
    const wrapper = mount({
      render() {
        return (
          <CheckboxGroup defaultValue={['a', 'b']}>
            <Checkbox checkAll>全选</Checkbox>
            <Checkbox value="a">选项 A</Checkbox>
            <Checkbox value="b">选项 B</Checkbox>
          </CheckboxGroup>
        );
      },
    });
    await flush();

    // eslint-disable-next-line no-console
    console.log('ALL-CHECKED (all selectable checked):', isAllChecked(wrapper));
    expect(isAllChecked(wrapper)).toBe(true);
  });

  it('is not all-checked when only some selectable options are checked', async () => {
    const wrapper = mount({
      render() {
        return (
          <CheckboxGroup defaultValue={['a']}>
            <Checkbox checkAll>全选</Checkbox>
            <Checkbox value="a">选项 A</Checkbox>
            <Checkbox value="b">选项 B</Checkbox>
          </CheckboxGroup>
        );
      },
    });
    await flush();

    expect(isAllChecked(wrapper)).toBe(false);
  });
});
