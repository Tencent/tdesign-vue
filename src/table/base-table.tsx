import {
  computed, defineComponent, SetupContext, toRefs, ref, provide,
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
import useStyle from './hooks/useStyle';
import useClassName from './hooks/useClassName';
import { TableConfig, useConfig } from '../config-provider/useConfig';

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
    const {
      virtualScrollClasses, tableLayoutClasses, tableBaseClass, tableColFixedClasses,
    } = useClassName();
    // 表格基础样式类
    const { tableClasses, tableContentStyles, tableElementStyles } = useStyle(props);
    const { global } = useConfig<TableConfig>('table');
    // 固定表头和固定列逻辑
    const {
      tableRef,
      virtualScrollHeaderPos,
      tableWidth,
      tableContentRef,
      isFixedHeader,
      isFixedColumn,
      showColumnShadow,
      rowAndColFixedPosition,
      onTableContentScroll,
    } = useFixed(props);
    const {
      renderTableHeader, renderColgroup, isMultipleHeader, spansAndLeafNodes,
    } = useTableHeader(props, context);
    const { renderTableBody } = useTableBody(props, context);
    const { renderTableFooter } = useTableFooter(props, context);
    const { dataSource, isPaginateData, renderPagination } = usePagination(props, context);

    const dynamicBaseTableClasses = computed(() => [
      tableClasses.value,
      { [tableBaseClass.headerFixed]: isFixedHeader.value },
      { [tableBaseClass.columnFixed]: isFixedColumn.value },
      { [tableBaseClass.multipleHeader]: isMultipleHeader.value },
      { [tableColFixedClasses.leftShadow]: showColumnShadow.left },
      { [tableColFixedClasses.rightShadow]: showColumnShadow.right },
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
      global,
      virtualScrollHeaderPos,
      tableWidth,
      tableRef,
      tableBaseClass,
      spansAndLeafNodes,
      dynamicBaseTableClasses,
      tableContentStyles,
      tableElementStyles,
      virtualScrollClasses,
      tableLayoutClasses,
      renderColgroup,
      renderTableHeader,
      renderTableBody,
      renderTableFooter,
      tableContentRef,
      isFixedHeader,
      isFixedColumn,
      rowAndColFixedPosition,
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

  render(h) {
    const { rowAndColFixedPosition, onTableContentScroll } = this;
    const data = this.isPaginateData ? this.dataSource : this.data;
    const isVirtual = this.scrollType === 'virtual';
    const onScroll = isVirtual
      ? (e: WheelEvent) => {
        onTableContentScroll(e);
        this.handleVirtualScroll();
      }
      : onTableContentScroll;

    const colgroup = this.renderColgroup(h, this.spansAndLeafNodes?.leafColumns || this.columns);
    const header = this.renderTableHeader(h, {
      isFixedHeader: this.isFixedHeader,
      rowAndColFixedPosition,
    });

    const tableContent = (
      <div
        ref="tableContentRef"
        class={this.tableBaseClass.content}
        style={this.tableContentStyles}
        onScroll={onScroll}
      >
        {isVirtual && (
          <div class={this.virtualScrollClasses.cursor} style={{ transform: `translate(0, ${this.scrollHeight}px)` }} />
        )}

        <table class={this.tableLayoutClasses[this.tableLayout]} style={this.tableElementStyles}>
          {colgroup}
          {header}
          {this.renderTableBody(h, {
            rowAndColFixedPosition,
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
          {this.renderTableFooter(h, {
            isFixedHeader: this.isFixedHeader,
            rowAndColFixedPosition,
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
      <div ref="tableRef" class={this.dynamicBaseTableClasses} style="position: relative">
        {isVirtual && (
          <table
            class={[this.tableLayoutClasses[this.tableLayout], this.virtualScrollClasses.header]}
            style={{
              ...this.tableElementStyles,
              width: `${this.tableWidth}px`,
            }}
          >
            {header}
          </table>
        )}
        {this.renderTNode('topContent')}
        {loadingContent}
        {this.renderPagination(h)}
      </div>
    );
  },
});
