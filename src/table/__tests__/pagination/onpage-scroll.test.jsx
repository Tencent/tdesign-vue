import { afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import {
  Table, BaseTable, PrimaryTable, EnhancedTable,
} from '@/src/table/index.ts';

// 与项目中其它分页测试风格保持一致，针对受控分页(on page-change)和切页时滚动回顶部进行断言
const TABLES = [Table, BaseTable, PrimaryTable, EnhancedTable];

function createData(total) {
  return new Array(total).fill(null).map((_, i) => {
    let applicant = `Name${i + 1}`;
    if (i === 2) applicant = '王芳';
    if (i === 3) applicant = '贾明';
    return {
      id: i + 1,
      index: i + 1,
      applicant,
    };
  });
}

TABLES.forEach((TTable) => {
  describe(`${TTable.name} pagination onPageChange & scroll reset`, () => {
    afterEach(() => {
      document.querySelector('.t-popup')?.remove();
      document.querySelector('.t-table')?.remove();
    });

    it('props.pagination: onPageChange should be triggered when switching pages', async () => {
      const onPageChange = vi.fn();
      const pagination = {
        current: 1,
        pageSize: 2,
        total: 10,
      };

      const wrapper = mount({
        data() {
          return { data: createData(10), pagination };
        },
        render() {
          return (
            <TTable
              rowKey="index"
              data={this.data}
              columns={[
                { title: 'index', colKey: 'index' },
                { title: 'applicant', colKey: 'applicant' },
              ]}
              pagination={this.pagination}
              on={{ 'page-change': onPageChange }}
            ></TTable>
          );
        },
      });

      expect(wrapper.find('.t-table__pagination').exists()).toBeTruthy();
      const nextButton = wrapper.find('.t-pagination__btn-next');
      expect(nextButton.exists()).toBeTruthy();

      await nextButton.trigger('click');

      expect(onPageChange).toHaveBeenCalledTimes(1);
      expect(onPageChange).toHaveBeenCalledWith(
        expect.objectContaining({ current: 2, pageSize: 2, previous: 1 }),
        expect.arrayContaining([
          expect.objectContaining({ index: 3, applicant: '王芳' }),
          expect.objectContaining({ index: 4, applicant: '贾明' }),
        ]),
      );
    });

    it('props.pagination: scroll position should reset when switching pages', async () => {
      const onPageChange = vi.fn();
      const pagination = {
        current: 1,
        pageSize: 2,
        total: 50,
      };

      const wrapper = mount({
        data() {
          return { data: createData(50), pagination };
        },
        render() {
          return (
            <TTable
              rowKey="index"
              data={this.data}
              columns={[
                { title: 'index', colKey: 'index' },
                { title: 'applicant', colKey: 'applicant' },
              ]}
              pagination={this.pagination}
              on={{ 'page-change': onPageChange }}
              maxHeight={200}
            ></TTable>
          );
        },
      });

      expect(wrapper.find('.t-table__pagination').exists()).toBeTruthy();
      const tableContent = wrapper.find('.t-table__content');
      expect(tableContent.exists()).toBeTruthy();

      const scrollElement = tableContent.element;

      // JSDOM 下 scrollHeight/clientHeight 默认为 0，需要 mock
      Object.defineProperty(scrollElement, 'scrollHeight', { value: 100, configurable: true });
      Object.defineProperty(scrollElement, 'clientHeight', { value: 50, configurable: true });

      expect(scrollElement.scrollHeight).toBeGreaterThan(scrollElement.clientHeight);
      expect(scrollElement.scrollTop).toBe(0);

      // 模拟滚动到底部
      scrollElement.scrollTop = 100;
      expect(scrollElement.scrollTop).toBe(100);

      const nextButton = wrapper.find('.t-pagination__btn-next');
      expect(nextButton.exists()).toBeTruthy();
      await nextButton.trigger('click');

      expect(onPageChange).toHaveBeenCalledTimes(1);
      // 切页后滚动回到顶部
      expect(scrollElement.scrollTop).toBe(0);
    });
  });
});
