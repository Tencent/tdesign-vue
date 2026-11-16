import { mount } from '@vue/test-utils';
import Tree from '@/src/tree/index.ts';
import { delay } from './kit';

// 筛选后，父节点的全选/半选状态只应统计仍然可见的子节点（issue #3078）
const data = [
  {
    value: '1',
    children: [{ value: '1.1' }, { value: '1.2' }, { value: '1.3' }],
  },
];

describe('Tree:filter-checked-state', () => {
  it('marks the parent as fully checked when all visible children are checked', async () => {
    const wrapper = mount({
      render() {
        return (
          <Tree
            ref="tree"
            data={data}
            checkable
            expand-all
            transition={false}
            filter={(node) => node.value !== '1.3'}
          ></Tree>
        );
      },
    });
    await delay(10);

    const treeVm = wrapper.vm.$refs.tree;
    // 勾选所有可见子节点
    treeVm.setItem('1.1', { checked: true });
    treeVm.setItem('1.2', { checked: true });
    await delay(10);

    const parent = treeVm.getItem('1');

    // 被过滤掉的 1.3 不应影响父节点状态
    expect(parent.checked).toBe(true);
    expect(parent.indeterminate).toBe(false);
  });
});
