import { computed, defineComponent } from '@vue/composition-api';
import baseTableProps from './base-table-props';
import primaryTableProps from './primary-table-props';
import BaseTable from './base-table';
import useColumnController from './hooks/useColumnController';
import { useTNodeJSX } from '../hooks/tnode';
import { TdPrimaryTableProps, PrimaryTableCol, TableRowData } from './type';
import { CheckboxGroupValue } from '../checkbox';

function getColumns(columns: PrimaryTableCol<TableRowData>[], displayColumnKeys: CheckboxGroupValue) {
  const arr: PrimaryTableCol<TableRowData>[] = [];
  for (let i = 0, len = columns.length; i < len; i++) {
    const item = columns[i];
    if (!displayColumnKeys.includes(item.colKey)) continue;
    arr.push(item);
  }
  return arr;
}

export default defineComponent({
  name: 'TTable',

  props: {
    ...baseTableProps,
    ...primaryTableProps,
  },

  setup(props: TdPrimaryTableProps, context) {
    const renderTNode = useTNodeJSX();
    const { displayColumnKeys, renderColumnController } = useColumnController(props, context);
    const tColumns = computed(() => getColumns(props.columns, displayColumnKeys.value));
    return {
      tColumns,
      renderTNode,
      renderColumnController,
    };
  },

  render(h) {
    const props = {
      ...this.$props,
      columns: this.tColumns,
      topContent: this.columnController
        ? () => (
            <div>
              {this.renderColumnController(h)}
              {this.renderTNode('topContent')}
            </div>
        )
        : this.topContent,
    };
    return <BaseTable props={props} />;
  },
});
