import {
  computed, defineComponent, SetupContext, h, toRefs, ref, provide,
} from '@vue/composition-api';
import props from './base-table-props';
import useTableHeader from './hooks/useTableHeader';
import useTableBody from './hooks/useTableBody';
import useTableFooter from './hooks/useTableFooter';
import useFixed from './hooks/useFixed';
import usePagination from './hooks/usePagination';
import useVirtualScroll from '../hooks/useVirtualScroll';
import Loading from '../loading';
import { BaseTableProps } from './interface';
import { useTNodeJSX } from '../hooks/tnode';
import useStyle, {
  TABLE_CLASS_CONTENT,
  TABLE_CLASS_LAYOUT,
  TABLE_CLASS_COLUMN_FIXED,
  TABLE_ROOT_CLASS_HEADER_FIXED,
  TABLE_ROOT_CLASS_COLUMN_FIXED,
  TABLE_ROOT_CLASS_MULTIPLE_HEADER,
} from './hooks/useStyle';

export default defineComponent({
  name: 'TBaseTable',

  props: {
    ...props,
    /**
     * 渲染展开行，非公开属性，请勿在业务中使用
     */
    renderExpandedRow: Function,
  },

  setup(props: BaseTableProps, context: SetupContext) {
    const renderTNode = useTNodeJSX();
    // 表格基础样式类
    const { tableClasses, tableContentStyles, tableElementStyles } = useStyle(props);
    // 固定表头和固定列逻辑
    const {
      tableRef,
      tableContentRef,
      isFixedHeader,
      isFixedColumn,
      showColumnShadow,
      columnStickyLeftAndRight,
      onTableContentScroll,
    } = useFixed(props);
    const {
      renderTableHeader, renderColgroup, isMultipleHeader, spansAndLeafNodes,
    } = useTableHeader(props, context);
    const { renderTableBody } = useTableBody(props, context);
    const { renderTableFooter } = useTableFooter(props, context);
    const { dataSource, isPaginateData, renderPagination } = usePagination(props, context);

    const baseTableClasses = computed(() => [
      tableClasses.value,
      { [TABLE_ROOT_CLASS_HEADER_FIXED]: isFixedHeader.value },
      { [TABLE_ROOT_CLASS_COLUMN_FIXED]: isFixedColumn.value },
      { [TABLE_ROOT_CLASS_MULTIPLE_HEADER]: isMultipleHeader.value },
      { [TABLE_CLASS_COLUMN_FIXED.leftShadow]: showColumnShadow.left },
      { [TABLE_CLASS_COLUMN_FIXED.rightShadow]: showColumnShadow.right },
    ]);

    const {
      type, rowHeight, bufferSize = 20, isFixedRowHeight = false,
    } = props.scroll || {};
    const { data } = toRefs<any>(props);
    const {
      trs = null,
      scrollHeight = null,
      visibleData = null,
      translateY = null,
      handleScroll = null,
      handleRowMounted = null,
    } = type === 'virtual'
      ? useVirtualScroll({
        container: tableContentRef,
        data,
        fixedHeight: isFixedRowHeight,
        lineHeight: rowHeight,
        bufferSize,
      })
      : {};
    provide('tableContentRef', tableContentRef);
    provide('rowHeightRef', ref(rowHeight));
    return {
      tableRef,
      spansAndLeafNodes,
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
      isPaginateData,
      dataSource,
      renderPagination,
      renderTNode,
      scrollType: type,
      rowHeight,
      trs,
      bufferSize,
      scrollHeight,
      visibleData,
      translateY,
      handleRowMounted,
      handleVirtualScroll: handleScroll,
    };
  },

  render() {
    const { columnStickyLeftAndRight, onTableContentScroll } = this;
    const data = this.isPaginateData ? this.dataSource : this.data;
    const isVirtual = this.scrollType === 'virtual';
    const onScroll = isVirtual
      ? (e: WheelEvent) => {
        onTableContentScroll(e);
        this.handleVirtualScroll();
      }
      : onTableContentScroll;
    const tableContent = (
      <div ref="tableContentRef" class={TABLE_CLASS_CONTENT} style={this.tableContentStyles} onScroll={onScroll}>
        {isVirtual && (
          <div
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              transition: 'transform .2s',
              transform: `translate(0, ${this.scrollHeight}px)`,
            }}
          />
        )}
        <table class={TABLE_CLASS_LAYOUT[this.tableLayout]} style={this.tableElementStyles}>
          {this.renderColgroup()}
          {this.renderTableHeader({
            isFixedHeader: this.isFixedHeader,
            columnStickyLeftAndRight,
          })}
          {this.renderTableBody({
            columnStickyLeftAndRight,
            showColumnShadow: this.showColumnShadow,
            data: isVirtual ? this.visibleData : data,
            columns: this.spansAndLeafNodes.leafColumns,
            translateY: this.translateY,
            scrollType: this.scrollType,
            rowHeight: this.rowHeight,
            trs: this.trs,
            bufferSize: this.bufferSize,
            handleRowMounted: this.handleRowMounted,
          })}
          {this.renderTableFooter({
            isFixedHeader: this.isFixedHeader,
            columnStickyLeftAndRight,
          })}
        </table>
      </div>
    );

    const customLoadingText = this.renderTNode('loading');
    const loadingContent = this.loading ? (
      <Loading
        loading={!!this.loading}
        text={customLoadingText ? () => customLoadingText : undefined}
        props={this.loadingProps}
        showOverlay
      >
        {tableContent}
      </Loading>
    ) : (
      tableContent
    );

    return (
      <div ref="tableRef" class={this.baseTableClasses}>
        {this.renderTNode('topContent')}
        {loadingContent}
        {this.renderPagination(h)}
      </div>
    );
  },
});
