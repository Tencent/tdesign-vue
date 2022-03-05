import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import baseTableProps from '../base-table-props';
import {
  DataType, TdBaseTableProps, TdPrimaryTableProps, PrimaryTableCol, TableRowData,
} from '../type';
import { prefix } from '../../config';
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
import { PageInfo } from '../../pagination/type';
import { emitEvent } from '../../utils/event';
import { renderTNodeJSX } from '../../utils/render-tnode';

type PageChangeContext = Parameters<TdBaseTableProps['onPageChange']>;
type ChangeContext = Parameters<TdPrimaryTableProps['onChange']>;

const TABLE_ROW_CLASS_SELECTED = `${prefix}-table__row--selected`;
const TABLE_ROW_CLASS_DISABLED = `${prefix}-table__row--disabled`;

export default mixins(expand, select, sort, rowDraggable, filter, showColumns, asyncLoadingMixin).extend({
  name: 'TTable',
  props: {
    ...baseTableProps,
    ...primaryTableProps,
  },
  computed: {
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
    // 最后一行，通行数据，可能是异步加载状态，可能是其他
    renderLastFullRow() {
      const lastFullRow = renderTNodeJSX(this, 'lastFullRow');
      const asyncLoadingNode = this.renderAsyncLoadingRow();
      const nodes = [lastFullRow, asyncLoadingNode].filter((v) => ![undefined, null, false].includes(v));
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return nodes[0];
      return (
        <div>
          {nodes[0]}
          {nodes[1]}
        </div>
      );
    },
    getSelectedRowClasses({ row, rowIndex }: { row: TableRowData; rowIndex: number }) {
      const col = this.columns[0];
      const customClasses = isFunction(this.rowClassName)
        ? this.rowClassName({ row, rowIndex, type: 'body' })
        : this.rowClassName;
      return [
        {
          [TABLE_ROW_CLASS_SELECTED]: this.selectedRowKeys?.includes(get(row, this.reRowKey)),
          [TABLE_ROW_CLASS_DISABLED]: isFunction(col.disabled) ? col.disabled({ row, rowIndex }) : col.disabled,
        },
        customClasses,
      ];
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
    const hasLastFullRow = this.lastFullRow || this.$scopedSlots.lastFullRow || this.asyncLoading || this.$scopedSlots.asyncLoading;
    const baseTableProps = {
      props: {
        ...$props,
        columns: rehandleColumns,
        renderExpandedRow: this.expandedRow ?? this.$scopedSlots.expandedRow ? this.renderExpandedRow : undefined,
        provider: {
          sortOnRowDraggable: this.sortOnRowDraggable,
          dragging: this.dragging,
        },
        // rowAttributes: this.sortOnRowDraggable ? [{ draggable: true }, this.rowAttributes] : this.rowAttributes,
        // this.hasFilterCondition is from mixins/filter.tsx
        firstFullRow: this.hasFilterCondition ? this.renderFirstFilterRow : this.firstFullRow,
        lastFullRow: hasLastFullRow ? this.renderLastFullRow : undefined,
        empty: this.empty,
        topContent: this.columnController
          ? () => (
              <div>
                {this.renderShowColumns()}
                {renderTNodeJSX(this, 'topContent')}
              </div>
          )
          : this.topContent,
        rowClassName:
          this.selectedRowKeys?.length || this.columns[0].disabled ? this.getSelectedRowClasses : this.rowClassName,
      },
      scopedSlots,
      on,
    };
    return <BaseTable {...baseTableProps} />;
  },
});
