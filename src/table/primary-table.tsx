import {
  computed, defineComponent, toRefs, h,
} from '@vue/composition-api';
import baseTableProps from './base-table-props';
import primaryTableProps from './primary-table-props';
import BaseTable from './base-table';
import { useTNodeJSX } from '../hooks/tnode';
import useColumnController from './hooks/useColumnController';
import useRowExpand from './hooks/useRowExpand';
import { TdPrimaryTableProps, PrimaryTableCol, TableRowData } from './type';

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

    // 影响列数量的因素有：自定义列配置、展开/收起行
    const getColumns = () => {
      if (!props.columnController && !showExpandIconColumn.value) return columns.value;
      const arr: PrimaryTableCol<TableRowData>[] = [];
      if (showExpandIconColumn.value) {
        arr.push(getExpandColumn(h));
      }
      for (let i = 0, len = columns.value.length; i < len; i++) {
        const item = columns.value[i];
        if (displayColumnKeys.value.length && !displayColumnKeys.value.includes(item.colKey)) continue;
        arr.push(item);
      }
      return arr;
    };

    const tColumns = computed(getColumns);

    return {
      tColumns,
      showExpandedRow,
      renderTNode,
      renderColumnController,
      renderExpandedRow,
      onInnerExpandRowClick,
    };
  },

  render(h) {
    const props = {
      ...this.$props,
      columns: this.tColumns,
      renderExpandedRow: this.showExpandedRow ? this.renderExpandedRow : undefined,
      topContent: this.columnController
        ? () => (
            <div>
              {this.renderColumnController(h)}
              {this.renderTNode('topContent')}
            </div>
        )
        : this.topContent,
    };
    const on: { [key: string]: Function } = {};
    if (this.expandOnRowClick) {
      on['row-click'] = this.onInnerExpandRowClick;
    }
    // replace `scopedSlots={this.$scopedSlots}` of `v-slots={this.$slots}` in Vue3
    return <BaseTable scopedSlots={this.$scopedSlots} props={props} on={on} attrs={this.$attrs} />;
  },
});
