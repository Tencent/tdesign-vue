import {
  computed, defineComponent, toRefs, h,
} from '@vue/composition-api';
import baseTableProps from './base-table-props';
import primaryTableProps from './primary-table-props';
import BaseTable from './base-table';
import { useTNodeJSX } from '../hooks/tnode';
import useColumnController from './hooks/useColumnController';
import useRowExpand from './hooks/useRowExpand';
import useTableHeader, { renderTitle } from './hooks/useTableHeader';
import useRowSelect from './hooks/useRowSelect';
import { TdPrimaryTableProps, PrimaryTableCol, TableRowData } from './type';
import useSorter from './hooks/useSorter';
import useFilter from './hooks/useFilter';

export default defineComponent({
  name: 'TTable',

  props: {
    ...baseTableProps,
    ...primaryTableProps,
  },

  setup(props: TdPrimaryTableProps, context) {
    const renderTNode = useTNodeJSX();
    const { columns } = toRefs(props);
    // 自定义列配置
    const { displayColumnKeys, renderColumnController } = useColumnController(props, context);
    // 展开/收起行
    const {
      showExpandedRow, showExpandIconColumn, getExpandColumn, renderExpandedRow, onInnerExpandRowClick,
    } = useRowExpand(props, context);
    // 排序
    const { renderSortIcon } = useSorter(props, context);
    // 行选中
    const { formatToRowSelectColumn, tRowClassNames } = useRowSelect(props, context);
    // 过滤
    const { hasEmptyCondition, renderFilterIcon, renderFirstFilterRow } = useFilter(props, context);
    const { renderTitleWidthIcon } = useTableHeader(props, context);

    // 1. 影响列数量的因素有：自定义列配置、展开/收起行；2. 影响表头内容的因素有：排序图标、筛选图标
    const getColumns = () => {
      const arr: PrimaryTableCol<TableRowData>[] = [];
      if (showExpandIconColumn.value) {
        arr.push(getExpandColumn(h));
      }
      for (let i = 0, len = columns.value.length; i < len; i++) {
        let item = { ...columns.value[i] };
        if (displayColumnKeys.value.length && !displayColumnKeys.value.includes(item.colKey)) continue;
        item = formatToRowSelectColumn(item);
        // 添加排序图标和过滤图标
        if (item.sorter || item.filter) {
          const titleContent = renderTitle(h, context.slots, item, i);
          item.title = (h, p) => {
            const sortIcon = renderSortIcon(h, p);
            const filterIcon = renderFilterIcon(h, p);
            return renderTitleWidthIcon(h, [titleContent, sortIcon, filterIcon]);
          };
        }
        arr.push(item);
      }
      return arr;
    };

    const tColumns = computed(getColumns);

    return {
      tColumns,
      showExpandedRow,
      tRowClassNames,
      hasEmptyCondition,
      renderTNode,
      renderColumnController,
      renderExpandedRow,
      onInnerExpandRowClick,
      renderFirstFilterRow,
    };
  },

  render(h) {
    const topContent = this.columnController
      ? () => (
          <div>
            {this.renderColumnController(h)}
            {this.renderTNode('topContent')}
          </div>
      )
      : this.topContent;

    const firstFullRow = this.hasEmptyCondition
      ? this.firstFullRow
      : () => (
          <div>
            {this.renderFirstFilterRow(h)}
            {this.renderTNode('firstFullRow')}
          </div>
      );

    const props = {
      ...this.$props,
      rowClassName: this.tRowClassNames,
      columns: this.tColumns,
      renderExpandedRow: this.showExpandedRow ? this.renderExpandedRow : undefined,
      topContent,
      firstFullRow,
    };

    // 事件
    const on: { [key: string]: Function } = {};
    if (this.expandOnRowClick) {
      on['row-click'] = this.onInnerExpandRowClick;
    }
    // replace `scopedSlots={this.$scopedSlots}` of `v-slots={this.$slots}` in Vue3
    return <BaseTable scopedSlots={this.$scopedSlots} props={props} on={on} attrs={this.$attrs} />;
  },
});
