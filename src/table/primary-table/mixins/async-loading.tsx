import Vue, { VNode } from 'vue';
import primaryTableProps from '../../primary-table-props';
import baseTableProps from '../../base-table-props';
import TableRow from '../../base-table/table-row';
import { prefix } from '../../../config';
import { CreateElement } from 'vue/types/umd';

export const asyncLoadingRow = 'async-loading-row';

export default Vue.extend({
  name: `${prefix}-primary-table-async-loading`,
  props: {
    data: baseTableProps.data,
    columns: primaryTableProps.columns,
    asyncLoading: primaryTableProps.asyncLoading,
  },
  data() {
    return {
      pullDownLoading: false,
    };
  },
  computed: {
    isLoadingMore(): boolean {
      return this.asyncLoading === 'loading-more';
    },
  },
  methods: {
    // 处理 data
    asyncLoadingHandler(data: Array<any>): Array<any> {
      const { asyncLoading } = this;
      // 异步加载 pullDownLoading 新增一条数据
      if (!!asyncLoading) {
        data.push({ colKey: asyncLoadingRow });
      } else {
        const { colKey = '' } = data[data.length - 1] || {};
        colKey === asyncLoadingRow && data.unshift();
      }
      return data;
    },
    renderAsyncLoadingRow(): VNode {
      const { asyncLoading } = this;
      const loadingText = this.isLoadingMore ? '点击加载更多' : '正在加载中，请稍后';
      const columns = [
        {
          colKey: asyncLoadingRow,
          attrs: { colSpan: this.columns.length },
          render: (h: CreateElement): VNode => {
            if (typeof asyncLoading === 'function') {
              return asyncLoading(h) as VNode;
            }
            return (<div class={`${prefix}-table--loading-async`}>
              <i class={`${prefix}-icon ${prefix}-icon-spinner`}></i>
              {loadingText}
            </div>);
          },
        },
      ];
      return <TableRow columns={columns}></TableRow>;
    },
  },
});
