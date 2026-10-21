import { mount } from '@vue/test-utils';
import { BaseTable } from '@/src/table/index.ts';

const COL_COUNT = 40;
const ROW_COUNT = 50;

function buildColumns(withFixed) {
  const cols = [];
  for (let i = 0; i < COL_COUNT; i++) {
    const col = { colKey: `col${i}`, title: `列${i}`, width: 120 };
    if (withFixed && i === 0) col.fixed = 'left';
    cols.push(col);
  }
  return cols;
}

function buildData() {
  const rows = [];
  for (let r = 0; r < ROW_COUNT; r++) {
    const row = { rowId: r };
    for (let c = 0; c < COL_COUNT; c++) row[`col${c}`] = `r${r}-c${c}`;
    rows.push(row);
  }
  return rows;
}

describe('issue #3900: t-table 横向虚拟滚动（列数超过阈值时）', () => {
  it('无 fixed 列场景：列数超过阈值时应出现横向虚拟滚动占位单元格', () => {
    const wrapper = mount({
      render() {
        return (
          <BaseTable
            data={buildData()}
            columns={buildColumns(false)}
            scroll={{ type: 'virtual', threshold: 100, colThreshold: 30 }}
            rowKey="rowId"
            height={400}
          />
        );
      },
    });
    const placeholderTds = wrapper.findAll('td[data-virtual-x-placeholder]');
    const realTds = wrapper.findAll('td:not([data-virtual-x-placeholder])');
    // 契约断言 1：应出现横向虚拟滚动占位单元格
    expect(placeholderTds.length).toBeGreaterThan(0);
    // 契约断言 2：真实渲染的单元格数应少于总单元格数（发生了横向裁剪）
    expect(realTds.length).toBeLessThan(COL_COUNT * ROW_COUNT);
  });

  it('有 fixed 列场景（对照组）：不应启用横向虚拟滚动', () => {
    const wrapper = mount({
      render() {
        return (
          <BaseTable
            data={buildData()}
            columns={buildColumns(true)}
            scroll={{ type: 'virtual', threshold: 100, colThreshold: 30 }}
            rowKey="rowId"
            height={400}
          />
        );
      },
    });
    const placeholderTds = wrapper.findAll('td[data-virtual-x-placeholder]');
    // 契约断言 3：存在 fixed 列时不启用横向虚拟滚动，不应出现占位单元格
    expect(placeholderTds.length).toBe(0);
  });
});
