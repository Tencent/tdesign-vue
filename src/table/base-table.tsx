import {
  computed, defineComponent, SetupContext, toRefs, onMounted, watch,
} from '@vue/composition-api';
import props from './base-table-props';
import { TdBaseTableProps } from './type';
import useTableHeader from './hooks/useTableHeader';
import useTableBody from './hooks/useTableBody';
import useFixed from './hooks/useFixed';
import useStyle, {
  TABLE_CLASS_CONTENT,
  TABLE_CLASS_LAYOUT,
  TABLE_CLASS_COLUMN_FIXED,
  TABLE_ROOT_CLASS_HEADER_FIXED,
  TABLE_ROOT_CLASS_COLUMN_FIXED,
} from './hooks/useStyle';

export default defineComponent({
  name: 'TBaseTable',

  props: { ...props },

  setup(props: TdBaseTableProps, context: SetupContext) {
    const { columns, tableLayout, tableContentWidth } = toRefs(props);
    // 表格基础样式类
    const { tableClasses, tableContentStyles, tableElementStyles } = useStyle(props);
    // 固定表头和固定列逻辑
    const {
      tableContentRef,
      isFixedHeader,
      isFixedColumn,
      showColumnShadow,
      columnStickyLeftAndRight,
      setColumnsStickyLeftAndRight,
      onTableContentScroll,
      updateColumnFixedStatus,
    } = useFixed(props);
    const { renderTableHeader, renderColgroup } = useTableHeader(props, context);
    const { renderTableBody } = useTableBody(props, context);

    const baseTableClasses = computed(() => [
      tableClasses.value,
      't-table--has-fixed',
      { [TABLE_ROOT_CLASS_HEADER_FIXED]: isFixedHeader.value },
      { [TABLE_ROOT_CLASS_COLUMN_FIXED]: isFixedColumn.value },
      { [TABLE_CLASS_COLUMN_FIXED.leftShadow]: showColumnShadow.left },
      { [TABLE_CLASS_COLUMN_FIXED.rightShadow]: showColumnShadow.right },
    ]);

    const updateStatus = () => {
      const timer = setTimeout(() => {
        if (isFixedColumn.value) {
          updateColumnFixedStatus(tableContentRef.value);
          setColumnsStickyLeftAndRight(tableContentRef.value);
          clearTimeout(timer);
        }
      }, 0);
      return () => {
        clearTimeout(timer);
      };
    };

    onMounted(updateStatus);

    watch([columns, tableLayout, tableContentWidth], updateStatus);

    return {
      baseTableClasses,
      tableContentStyles,
      tableElementStyles,
      renderTableHeader,
      renderTableBody,
      renderColgroup,
      tableContentRef,
      isFixedHeader,
      isFixedColumn,
      columnStickyLeftAndRight,
      showColumnShadow,
      onTableContentScroll,
    };
  },

  render() {
    return (
      <div class={this.baseTableClasses}>
        <div
          ref="tableContentRef"
          class={TABLE_CLASS_CONTENT}
          style={this.tableContentStyles}
          onScroll={this.onTableContentScroll}
        >
          <table class={TABLE_CLASS_LAYOUT[this.tableLayout]} style={this.tableElementStyles}>
            {this.renderColgroup()}
            {this.renderTableHeader({
              isFixedHeader: this.isFixedHeader,
              columnStickyLeftAndRight: this.columnStickyLeftAndRight,
            })}
            {this.renderTableBody({
              columnStickyLeftAndRight: this.columnStickyLeftAndRight,
              showColumnShadow: this.showColumnShadow,
            })}
          </table>
        </div>
      </div>
    );
  },
});
