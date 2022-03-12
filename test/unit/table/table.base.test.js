import { mount } from '@vue/test-utils';
import {
  Table, BaseTable, PrimaryTable, EnhancedTable,
} from '@/src/table/index.ts';

const data = new Array(5).fill(null).map((item, index) => ({
  id: index + 100,
  index: index + 100,
  instance: `JQTest${index + 1}`,
  status: index % 2,
  owner: 'jenny;peter',
  description: 'test',
}));

const SIMPLE_COLUMNS = [
  { title: 'Index', colKey: 'index' },
  { title: 'Instance', colKey: 'instance' },
];

const tables = [Table, BaseTable, PrimaryTable, EnhancedTable];

// 每一个表格组件都需要单独测试，避免出现组件之间属性或事件透传不成功的情况
tables.forEach((TTable) => {
  describe(TTable.name, () => {
    // 测试边框
    describe(':props.bordered', () => {
      it('bordered default value is true', () => {
        const wrapper = mount({
          render() {
            return <TTable rowKey="index" bordered data={data} columns={SIMPLE_COLUMNS}></TTable>;
          },
        });
        expect(wrapper.find('.t-table--bordered').exists()).toBeTruthy();
      });
      it('bordered={true} works fine', () => {
        const wrapper = mount({
          render() {
            return <TTable rowKey="index" bordered={true} data={data} columns={SIMPLE_COLUMNS}></TTable>;
          },
        });
        expect(wrapper.find('.t-table--bordered').exists()).toBeTruthy();
      });
      it('bordered={false} works fine', () => {
        const wrapper = mount({
          render() {
            return <TTable rowKey="index" bordered={false} data={data} columns={SIMPLE_COLUMNS}></TTable>;
          },
        });
        expect(wrapper.find('.t-table--bordered').exists()).toBeFalsy();
      });
    });

    // 测试空数据
    describe(':props.empty', () => {
      it('empty default value is 暂无数据', () => {
        const wrapper = mount({
          render() {
            return <TTable rowKey="index" data={[]} columns={SIMPLE_COLUMNS}></TTable>;
          },
        });
        expect(wrapper.find('.t-table__empty').exists()).toBeTruthy();
        expect(wrapper.find('.t-table__empty').text()).toBe('暂无数据');
      });

      it('props.empty=Empty Data', () => {
        const wrapper = mount({
          render() {
            return <TTable rowKey="index" data={[]} empty="Empty Data" columns={SIMPLE_COLUMNS}></TTable>;
          },
        });
        expect(wrapper.find('.t-table__empty').exists()).toBeTruthy();
        expect(wrapper.find('.t-table__empty').text()).toBe('Empty Data');
      });

      it('props.empty works fine as a function', () => {
        const emptyText = 'Empty Data Rendered By Function';
        const wrapper = mount({
          render() {
            return (
              <TTable
                rowKey="index"
                data={[]}
                empty={() => <div class="render-function-class">{emptyText}</div>}
                columns={SIMPLE_COLUMNS}
              ></TTable>
            );
          },
        });
        expect(wrapper.find('.t-table__empty').exists()).toBeTruthy();
        expect(wrapper.find('.render-function-class').exists()).toBeTruthy();
        expect(wrapper.find('.t-table__empty').text()).toBe(emptyText);
      });

      it('slots.empty works fine', () => {
        const emptyText = 'Empty Data Rendered By Slots';
        const wrapper = mount({
          render() {
            return (
              <TTable
                rowKey="index"
                data={[]}
                scopedSlots={{ empty: () => <div class="slots-empty-class">{emptyText}</div> }}
                columns={SIMPLE_COLUMNS}
              ></TTable>
            );
          },
        });
        expect(wrapper.find('.t-table__empty').exists()).toBeTruthy();
        expect(wrapper.find('.slots-empty-class').exists()).toBeTruthy();
        expect(wrapper.find('.t-table__empty').text()).toBe(emptyText);
      });
    });

    // 测试第一行通栏
    describe(':props.firstFullRow', () => {
      it('props.firstFullRow could be string', () => {
        const wrapper = mount({
          render() {
            return (
              <TTable
                firstFullRow="This is a full row at first."
                rowKey="index"
                data={data}
                columns={SIMPLE_COLUMNS}
              ></TTable>
            );
          },
        });
        expect(wrapper.find('.t-table__row--full').exists()).toBeTruthy();
      });
      it('props.firstFullRow works fine as a function', () => {
        const wrapper = mount({
          render() {
            return (
              <TTable
                firstFullRow={() => <span>This is a full row at first.</span>}
                rowKey="index"
                data={data}
                columns={SIMPLE_COLUMNS}
              ></TTable>
            );
          },
        });
        expect(wrapper.find('.t-table__row--full').exists()).toBeTruthy();
        expect(wrapper.find('.t-table__first-full-row').exists()).toBeTruthy();
      });
      // 支持插槽驼峰
      it('slots.firstFullRow works fine', () => {
        const wrapper = mount({
          render() {
            return (
              <TTable
                scopedSlots={{ firstFullRow: () => <span>This is a full row at first.</span> }}
                rowKey="index"
                data={data}
                columns={SIMPLE_COLUMNS}
              ></TTable>
            );
          },
        });
        expect(wrapper.find('.t-table__row--full').exists()).toBeTruthy();
        expect(wrapper.find('.t-table__first-full-row').exists()).toBeTruthy();
      });
      // 支持插槽中划线
      it('slots[first-full-row] works fine', () => {
        const wrapper = mount({
          render() {
            return (
              <TTable
                scopedSlots={{ 'first-full-row': () => <span>This is a full row at first.</span> }}
                rowKey="index"
                data={data}
                columns={SIMPLE_COLUMNS}
              ></TTable>
            );
          },
        });
        expect(wrapper.find('.t-table__row--full').exists()).toBeTruthy();
        expect(wrapper.find('.t-table__first-full-row').exists()).toBeTruthy();
      });
    });

    // 测试最后一行通栏
    describe(':props.lastFullRow', () => {
      it('props.lastFullRow could be string', () => {
        const wrapper = mount({
          render() {
            return (
              <TTable
                lastFullRow="This is a full row at last."
                rowKey="index"
                data={data}
                columns={SIMPLE_COLUMNS}
              ></TTable>
            );
          },
        });
        expect(wrapper.find('.t-table__row--full').exists()).toBeTruthy();
      });
      it('props.lastFullRow works fine as a function', () => {
        const wrapper = mount({
          render() {
            return (
              <TTable
                lastFullRow={() => <span>This is a full row at last.</span>}
                rowKey="index"
                data={data}
                columns={SIMPLE_COLUMNS}
              ></TTable>
            );
          },
        });
        expect(wrapper.find('.t-table__row--full').exists()).toBeTruthy();
        expect(wrapper.find('.t-table__last-full-row').exists()).toBeTruthy();
      });
      // 支持插槽驼峰
      it('slots.lastFullRow works fine', () => {
        const wrapper = mount({
          render() {
            return (
              <TTable
                scopedSlots={{ lastFullRow: () => <span>This is a full row at last.</span> }}
                rowKey="index"
                data={data}
                columns={SIMPLE_COLUMNS}
              ></TTable>
            );
          },
        });
        expect(wrapper.find('.t-table__row--full').exists()).toBeTruthy();
        expect(wrapper.find('.t-table__last-full-row').exists()).toBeTruthy();
      });
      // 支持插槽中划线
      it('slots[last-full-row] works fine', () => {
        const wrapper = mount({
          render() {
            return (
              <TTable
                scopedSlots={{ 'last-full-row': () => <span>This is a full row at last.</span> }}
                rowKey="index"
                data={data}
                columns={SIMPLE_COLUMNS}
              ></TTable>
            );
          },
        });
        expect(wrapper.find('.t-table__row--full').exists()).toBeTruthy();
        expect(wrapper.find('.t-table__last-full-row').exists()).toBeTruthy();
      });
    });
  });
});
