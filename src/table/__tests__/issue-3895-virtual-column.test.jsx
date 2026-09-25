import { mount } from '@vue/test-utils';
import { Table, BaseTable } from '@/src/table/index.ts';

// 40 列 × 60 行，用于验证横向（列）虚拟滚动
const COL_COUNT = 40;
const ROW_COUNT = 60;

const buildColumns = (withFixed = false) => new Array(COL_COUNT).fill(null).map((_, i) => ({
  title: `列${i}`,
  colKey: `c${i}`,
  width: 120,
  ...(withFixed && i === 0 ? { fixed: 'left' } : {}),
}));

const buildData = () => new Array(ROW_COUNT).fill(null).map((_, r) => {
  const row = { id: r };
  for (let c = 0; c < COL_COUNT; c++) row[`c${c}`] = `r${r}c${c}`;
  return row;
});

// 统计首行渲染的业务 <td> 数量（不含占位单元格）
const countFirstRowBusinessTd = (wrapper) => {
  const tbody = wrapper.find('.t-table__content tbody');
  if (!tbody.exists()) return 0;
  const firstTr = tbody.findAll('tr').at(0);
  const tds = firstTr.findAll('td');
  let count = 0;
  for (let i = 0; i < tds.length; i++) {
    const style = tds.at(i).attributes('style') || '';
    // 占位单元格标记：padding:0 且 border:none
    const isSpacer = /padding:\s*0/.test(style) && /border:\s*none/.test(style);
    if (!isSpacer) count += 1;
  }
  return count;
};

describe('t-table 横向（列）虚拟滚动 issue #3895', () => {
  it('g1: 列数超过阈值且开启 scroll.type=virtual 时，单行渲染的业务列数应明显少于总列数', () => {
    const wrapper = mount({
      render() {
        return (
          <BaseTable
            rowKey="id"
            data={buildData()}
            columns={buildColumns()}
            tableLayout="fixed"
            scroll={{ type: 'virtual', threshold: 1 }}
          ></BaseTable>
        );
      },
    });
    const renderedCount = countFirstRowBusinessTd(wrapper);
    expect(renderedCount).toBeLessThan(COL_COUNT);
    expect(renderedCount).toBeGreaterThan(0);
  });

  it('p1: 列数不超阈值时，即使开启 scroll.type=virtual，渲染的业务列数量应与改动前一致（全量渲染）', () => {
    const smallColumns = buildColumns().slice(0, 10);
    const wrapper = mount({
      render() {
        return (
          <BaseTable
            rowKey="id"
            data={buildData()}
            columns={smallColumns}
            tableLayout="fixed"
            scroll={{ type: 'virtual', threshold: 1 }}
          ></BaseTable>
        );
      },
    });
    const renderedCount = countFirstRowBusinessTd(wrapper);
    expect(renderedCount).toBe(10);
  });

  it('p1b: 未开启 scroll.type=virtual 时，即使列数超过阈值，渲染的业务列数量应与改动前一致（全量渲染）', () => {
    const wrapper = mount({
      render() {
        return (
          <BaseTable
            rowKey="id"
            data={buildData()}
            columns={buildColumns()}
            tableLayout="fixed"
          ></BaseTable>
        );
      },
    });
    const renderedCount = countFirstRowBusinessTd(wrapper);
    expect(renderedCount).toBe(COL_COUNT);
  });

  it('p2: 固定列在列虚拟化开启后仍正确渲染并显示正确内容（不被裁剪为占位单元格）', () => {
    const wrapper = mount({
      render() {
        return (
          <BaseTable
            rowKey="id"
            data={buildData()}
            columns={buildColumns(true)}
            tableLayout="fixed"
            scroll={{ type: 'virtual', threshold: 1 }}
          ></BaseTable>
        );
      },
    });
    const tbody = wrapper.find('.t-table__content tbody');
    const firstTr = tbody.findAll('tr').at(0);
    const tds = firstTr.findAll('td');
    // 固定列对应第一列（colKey=c0），必须是首个渲染的业务单元格，不能被左侧占位单元格取代
    const firstBusinessTd = tds.at(0);
    const style = firstBusinessTd.attributes('style') || '';
    const isSpacer = /padding:\s*0/.test(style) && /border:\s*none/.test(style);
    expect(isSpacer).toBeFalsy();
    expect(firstBusinessTd.text()).toBe('r0c0');
  });

  it('Table 组件（对外公开组件）同样支持列虚拟化且渲染文本内容正确', () => {
    const wrapper = mount({
      render() {
        return (
          <Table
            rowKey="id"
            data={buildData()}
            columns={buildColumns()}
            tableLayout="fixed"
            scroll={{ type: 'virtual', threshold: 1 }}
          ></Table>
        );
      },
    });
    const renderedCount = countFirstRowBusinessTd(wrapper);
    expect(renderedCount).toBeLessThan(COL_COUNT);
  });
});
