import Vue, { VNode } from 'vue';
import { CreateElement } from 'vue/types/umd';
import primaryTableProps from '../../primary-table-props';
import baseTableProps from '../../base-table-props';
import TableRow from '../../base-table/table-row';
import Loading from '../../../loading';
import { prefix } from '../../../config';
import { STATUS_CLASSNAMES } from '../../../utils/classnames';
// import GradientIcon from '../../../loading/icon/gradient';
import { emitEvent } from '../../../utils/event';
import { TdPrimaryTableProps } from '../../type';
import { ClassName } from '../../../common';

type AsyncLoadingClickParams = Parameters<TdPrimaryTableProps['onAsyncLoadingClick']>;

export const ASYNC_LOADING_ROW = 'async-loading-row';

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
    classes(): ClassName {
      return [
        `${prefix}-table__async-loading`,
        {
          [STATUS_CLASSNAMES.loading]: this.asyncLoading === 'loading',
          [STATUS_CLASSNAMES.loadMore]: this.asyncLoading === 'load-more',
        },
      ];
    },
  },
  methods: {
    // 异步加载 pullDownLoading 新增一条数据
    asyncLoadingHandler(): Array<any> {
      if (this.asyncLoading || typeof this.$scopedSlots.asyncLoading === 'function') {
        return this.data.concat({ colKey: ASYNC_LOADING_ROW });
      }
      return this.data;
    },
    onLoadClick() {
      if (typeof this.asyncLoading !== 'string') return;
      emitEvent<AsyncLoadingClickParams>(this, 'async-loading-click', { status: this.asyncLoading });
    },
    renderAsyncLoadingRow(): VNode {
      const { asyncLoading } = this;
      const columns = [
        {
          colKey: ASYNC_LOADING_ROW,
          attrs: { colSpan: this.columns.length },
          render: (h: CreateElement) => {
            if (typeof asyncLoading === 'function') {
              return asyncLoading(h);
            }
            if (typeof this.$scopedSlots.asyncLoading === 'function') {
              return this.$scopedSlots.asyncLoading(h);
            }
            const loadingText = {
              'load-more': '点击加载更多',
              loading: '正在加载中，请稍后',
            }[String(asyncLoading)];
            if (!loadingText) {
              return '';
            }
            return (
              <div class={this.classes} onClick={this.onLoadClick}>
                {<Loading
                  loading={asyncLoading === 'loading'}
                  text={loadingText}
                />}
              </div>
            );
          },
        },
      ];
      return <TableRow rowKey={ASYNC_LOADING_ROW} columns={columns}></TableRow>;
    },
  },
});
