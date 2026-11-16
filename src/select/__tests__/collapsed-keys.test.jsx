import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Select } from '../index';

// collapsedSelectedItems 里先用 props.keys.value 取到了值，
// 但紧接着 find 又拿默认的 t.value 去比，自定义 keys 后永远匹配不到（issue #3762）。
describe('Select collapsedItems', () => {
  it('resolves the collapsed options when keys are remapped', async () => {
    const options = [
      { value: 'Label1', key: '1' },
      { value: 'Label2', key: '2' },
      { value: 'Label3', key: '3' },
    ];
    let captured = null;

    const wrapper = mount({
      render() {
        return (
          <Select
            multiple
            options={options}
            keys={{ label: 'value', value: 'key' }}
            value={['1', '2', '3']}
            minCollapsedNum={1}
            collapsedItems={(h, { collapsedSelectedItems }) => {
              captured = collapsedSelectedItems;
              return <span class="collapsed">{collapsedSelectedItems.length}</span>;
            }}
          />
        );
      },
    });
    await nextTick();
    await nextTick();

    expect(captured).toBeTruthy();
    // 折叠掉 2 项，且每一项都要能取到 label
    expect(captured.length).toBe(2);
    expect(captured.map((item) => item && item.value)).toEqual(['Label2', 'Label3']);
  });
});
