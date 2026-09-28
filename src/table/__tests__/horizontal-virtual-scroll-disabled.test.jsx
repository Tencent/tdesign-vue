import { mount } from '@vue/test-utils';
import { BaseTable } from '..';

/**
 * 横向虚拟滚动等价性回归测试（Issue #3899）
 * 场景：未开启横向虚拟滚动时，列渲染行为应与改动前完全一致
 * 拆分为独立文件，避免与 g1（区分性用例）共享同一次 vitest 文件级退出码
 */

const TOTAL_COLUMNS = 30;
const TOTAL_ROWS = 50;
const COLUMN_WIDTH = 120;
const CONTAINER_WIDTH = 600;

function getColumns() {
  const columns = [];
  for (let i = 0; i < TOTAL_COLUMNS; i++) {
    columns.push({ title: `col-${i}`, colKey: `col-${i}`, width: COLUMN_WIDTH });
  }
  return columns;
}

function getData() {
  const data = [];
  for (let i = 0; i < TOTAL_ROWS; i++) {
    const row = { id: i + 1 };
    for (let j = 0; j < TOTAL_COLUMNS; j++) {
      row[`col-${j}`] = `${i}-${j}`;
    }
    data.push(row);
  }
  return data;
}

/** jsdom 下尺寸均为 0，这里模拟内容区宽度，与开启态测试保持一致的挂载环境 */
function mockContainerWidth(width) {
  const original = HTMLElement.prototype.getBoundingClientRect;
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
  HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    if (this.classList && this.classList.contains('t-table__content')) {
      return {
        width, height: 400, top: 0, left: 0, right: width, bottom: 400, x: 0, y: 0, toJSON: () => {},
      };
    }
    return original.call(this);
  };
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      if (this.classList && this.classList.contains('t-table__content')) return width;
      return originalClientWidth ? originalClientWidth.get.call(this) : 0;
    },
  });
  return () => {
    HTMLElement.prototype.getBoundingClientRect = original;
    if (originalClientWidth) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
    }
  };
}

function mountTable(scroll) {
  return mount({
    render() {
      return (
        <BaseTable
          rowKey="id"
          data={getData()}
          columns={getColumns()}
          scroll={scroll}
          tableLayout="fixed"
        ></BaseTable>
      );
    },
  });
}

describe('Table horizontal virtual scroll (disabled)', () => {
  let restore;

  beforeEach(() => {
    restore = mockContainerWidth(CONTAINER_WIDTH);
  });

  afterEach(() => {
    restore && restore();
  });

  it('p1: 未开启横向虚拟滚动时渲染全部列，行为保持', async () => {
    const wrapper = mountTable({ type: 'virtual', threshold: 0, rowHeight: 40 });
    await wrapper.vm.$nextTick();

    const thList = wrapper.findAll('thead th');
    expect(thList.length).toBe(TOTAL_COLUMNS);
  });
});
