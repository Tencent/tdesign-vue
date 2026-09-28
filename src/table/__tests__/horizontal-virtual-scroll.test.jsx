import { mount } from '@vue/test-utils';
import { BaseTable } from '..';

/**
 * 横向虚拟滚动回归测试（Issue #3899）
 * 场景：约 30 列、50+ 行，开启横向虚拟滚动后同一时刻只渲染可视区域内的列
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

/** jsdom 下尺寸均为 0，这里模拟内容区宽度以启用横向虚拟滚动 */
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

describe('Table horizontal virtual scroll', () => {
  let restore;

  beforeEach(() => {
    restore = mockContainerWidth(CONTAINER_WIDTH);
  });

  afterEach(() => {
    restore && restore();
  });

  it('g1: 开启横向虚拟滚动后只渲染可视区域内的列', async () => {
    const wrapper = mountTable({
      type: 'virtual',
      enableHorizontalVirtual: true,
      columnWidth: COLUMN_WIDTH,
      threshold: 0,
      rowHeight: 40,
    });
    await wrapper.vm.$nextTick();

    const thList = wrapper.findAll('thead th');
    // 可视宽度 600 + 两侧 buffer，远小于全部 30 列
    expect(thList.length).toBeLessThan(TOTAL_COLUMNS);
    expect(thList.length).toBeGreaterThan(0);

    // 横向滚动后渲染的列集合应发生变化
    const firstColKeyBefore = thList.at(0).attributes('data-colkey');
    const content = wrapper.find('.t-table__content');
    content.element.scrollLeft = COLUMN_WIDTH * 20;
    content.trigger('scroll');
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const thListAfter = wrapper.findAll('thead th');
    expect(thListAfter.length).toBeLessThan(TOTAL_COLUMNS);
    const firstColKeyAfter = thListAfter.at(0).attributes('data-colkey');
    expect(firstColKeyAfter).not.toBe(firstColKeyBefore);
  });
});
