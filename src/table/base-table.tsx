import { computed, defineComponent, SetupContext } from '@vue/composition-api';
import props from './base-table-props';
import useTableHeader from './hooks/useTableHeader';
import useTableBody from './hooks/useTableBody';
import useTableFooter from './hooks/useTableFooter';
import useFixed from './hooks/useFixed';
import useStyle, {
  TABLE_CLASS_CONTENT,
  TABLE_CLASS_LAYOUT,
  TABLE_CLASS_COLUMN_FIXED,
  TABLE_ROOT_CLASS_HEADER_FIXED,
  TABLE_ROOT_CLASS_COLUMN_FIXED,
} from './hooks/useStyle';
import { BaseTableProps } from './interface';

export default defineComponent({
  name: 'TBaseTable',

  props: {
    ...props,
    /**
     * 以下属性为非公开属性，请勿在业务中使用
     */
    renderExpandedRow: Function,
  },

  setup(props: BaseTableProps, context: SetupContext) {
    // 表格基础样式类
    const { tableClasses, tableContentStyles, tableElementStyles } = useStyle(props);
    // 固定表头和固定列逻辑
    const {
      tableContentRef,
      isFixedHeader,
      isFixedColumn,
      showColumnShadow,
      columnStickyLeftAndRight,
      onTableContentScroll,
    } = useFixed(props);
    const { renderTableHeader, renderColgroup } = useTableHeader(props, context);
    const { renderTableBody } = useTableBody(props, context);
    const { renderTableFooter } = useTableFooter(props, context);

    const baseTableClasses = computed(() => [
      tableClasses.value,
      { [TABLE_ROOT_CLASS_HEADER_FIXED]: isFixedHeader.value },
      { [TABLE_ROOT_CLASS_COLUMN_FIXED]: isFixedColumn.value },
      { [TABLE_CLASS_COLUMN_FIXED.leftShadow]: showColumnShadow.left },
      { [TABLE_CLASS_COLUMN_FIXED.rightShadow]: showColumnShadow.right },
    ]);

    return {
      baseTableClasses,
      tableContentStyles,
      tableElementStyles,
      renderColgroup,
      renderTableHeader,
      renderTableBody,
      renderTableFooter,
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
            {this.renderTableFooter({
              isFixedHeader: this.isFixedHeader,
              columnStickyLeftAndRight: this.columnStickyLeftAndRight,
            })}
          </table>
        </div>
      </div>
    );
  },
});
