import { defineComponent, SetupContext } from '@vue/composition-api';
import props from './base-table-props';
import { TdBaseTableProps } from './type';
import useStyle, { TABLE_CLASS_CONTENT, TABLE_CLASS_LAYOUT } from './hooks/useStyle';
import useTableHeader from './hooks/useTableHeader';
import useTableBody from './hooks/useTableBody';

export default defineComponent({
  name: 'TBaseTable',

  props: { ...props },

  setup(props: TdBaseTableProps, context: SetupContext) {
    const { tableClasses } = useStyle(props);
    const { tableHeader } = useTableHeader(props, context);
    const { tableBody } = useTableBody(props, context);
    return {
      tableClasses,
      tableHeader,
      tableBody,
    };
  },

  render() {
    return (
      <div class={this.tableClasses}>
        <div class={TABLE_CLASS_CONTENT}>
          <table class={TABLE_CLASS_LAYOUT[this.tableLayout]}>
            {this.tableHeader}
            {this.tableBody}
          </table>
        </div>
      </div>
    );
  },
});
