import baseTableProps from '../base-table-props';
import {
  DataType, TdBaseTableProps, TdPrimaryTableProps, PrimaryTableCol,
} from '../type';

import primaryTableProps from '../primary-table-props';
import BaseTable from '../base-table';
import mixins from '../../utils/mixins';
import expand from './mixins/expand';
import select from './mixins/select';
import sort from './mixins/sort';
import rowDraggable from './mixins/row-draggable';
import filter from './mixins/filter';
import showColumns from './mixins/show-columns';
import asyncLoadingMixin from './mixins/async-loading';
import { RenderExpandRow } from '../util/interface';
import { PageInfo } from '../../pagination/type';
import { emitEvent } from '../../utils/event';

type PageChangeContext = Parameters<TdBaseTableProps['onPageChange']>;
type ChangeContext = Parameters<TdPrimaryTableProps['onChange']>;

export default mixins(expand, select, sort, rowDraggable, filter, showColumns, asyncLoadingMixin).extend({
  name: 'TTable',
  props: {
    ...baseTableProps,
    ...primaryTableProps,
  },
  computed: {
    rehandleData(): Array<DataType> {
      return this.asyncLoadingHandler([...this.data]);
    },
    rehandleColumns(): Array<PrimaryTableCol> {
      let columns = this.columns.map((col) => ({ ...col }));
      columns = this.getShowColumns([...this.columns]);
      columns = this.getSorterColumns(columns);
      columns = this.getFilterColumns(columns);
      columns = this.getSelectColumns(columns);
      columns = this.getExpandColumns(columns);
      return columns;
    },
  },
  created() {
    if (typeof this.$attrs['expanded-row-render'] !== 'undefined') {
      console.warn('The expandedRowRender prop is deprecated. Use expandedRow instead.');
    }
  },
  methods: {
    // 提供给 BaseTable 添加渲染 Rows 方法
    renderRows(params: RenderExpandRow): void {
      const { row, rowIndex, rows } = params;
      if (row.colKey === 'async-loading-row') {
        rows.splice(rowIndex, 1, this.renderAsyncLoadingRow());
        return;
      }
      this.renderExpandedRow(params);
    },
  },
  render() {
    const { $props, $scopedSlots, rehandleColumns } = this;
    const scopedSlots = {
      ...$scopedSlots,
    };
    const on = {
      ...this.$listeners,
      'page-change': (pageInfo: PageInfo, newDataSource: Array<DataType>) => {
        emitEvent<PageChangeContext>(this, 'page-change', pageInfo, newDataSource);
        emitEvent<ChangeContext>(
          this,
          'change',
          { pagination: pageInfo },
          { trigger: 'pagination', currentData: newDataSource },
        );
      },
      'row-dragstart': this.onDragStart,
      'row-dragover': this.onDragOver,
    };
    if (this.expandOnRowClick) {
      on['row-click'] = (params: { row: Record<string, any>; index: number }) => {
        this.handleExpandChange(params.row);
      };
    }
    const baseTableProps = {
      props: {
        ...$props,
        data: this.rehandleData,
        columns: rehandleColumns,
        provider: {
          renderRows: this.renderRows,
          sortOnRowDraggable: this.sortOnRowDraggable,
          dragging: this.dragging,
        },
        // this.hasFilterCondition is from mixins/filter.tsx
        firstFullRow: this.hasFilterCondition ? this.renderFirstFilterRow : this.firstFullRow,
        empty: this.empty,
      },
      scopedSlots,
      on,
    };
    // 存在过滤条件，查询结果为空时，不显示空数据节点，有过滤结果行即可
    if (this.hasFilterCondition) {
      baseTableProps.props.empty = null;
    }
    // TODO: 可使用插槽 `topContent` 自定义显示列
    return <BaseTable {...baseTableProps} />;
  },
});
