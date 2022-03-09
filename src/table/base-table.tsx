import {
  computed, defineComponent, SetupContext, toRefs, ref, provide, nextTick,
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
import { Affix } from '../affix';
import useCommonClassName from '../hooks/useCommonClassName';

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
    const tableRef = ref<HTMLTableElement>();
    const tableElmRef = ref<HTMLTableElement>();
    const {
      virtualScrollClasses, tableLayoutClasses, tableBaseClass, tableColFixedClasses,
    } = useClassName();
    const { statusClassNames } = useCommonClassName();
    // 表格基础样式类
    const { tableClasses, tableContentStyles, tableElementStyles } = useStyle(props);
    const { global } = useConfig<TableConfig>('table');
    // 固定表头和固定列逻辑
    const {
      affixHeaderRef,
      scrollbarWidth,
      virtualScrollHeaderPos,
      tableWidth,
      tableContentRef,
      isFixedHeader,
      isWidthOverflow,
      isFixedColumn,
      thWidthList,
      showColumnShadow,
      showAffixHeader,
      rowAndColFixedPosition,
      onTableContentScroll,
      updateHeaderScroll,
    } = useFixed(props, context);
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
      { [tableBaseClass.widthOverflow]: isWidthOverflow.value },
      { [tableBaseClass.multipleHeader]: isMultipleHeader.value },
      { [tableColFixedClasses.leftShadow]: showColumnShadow.left },
      { [tableColFixedClasses.rightShadow]: showColumnShadow.right },
    ]);

    const isVirtual = computed(() => type === 'virtual' && props.data?.length > (props.scroll?.threshold || 100));

    const onFixedChange = (val: number | false) => {
      if (val !== false) {
        nextTick(() => {
          updateHeaderScroll();
        });
      }
    };

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
    } = isVirtual.value
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
      isVirtual,
      global,
      virtualScrollHeaderPos,
      tableWidth,
      tableRef,
      tableElmRef,
      tableBaseClass,
      spansAndLeafNodes,
      dynamicBaseTableClasses,
      tableContentStyles,
      tableElementStyles,
      virtualScrollClasses,
      tableLayoutClasses,
      tableContentRef,
      isFixedHeader,
      isWidthOverflow,
      isFixedColumn,
      rowAndColFixedPosition,
      showColumnShadow,
      thWidthList,
      isPaginateData,
      dataSource,
      scrollType: type,
      rowHeight,
      trs,
      bufferSize,
      scrollHeight,
      visibleData,
      translateY,
      affixHeaderRef,
      showAffixHeader,
      statusClassNames,
      scrollbarWidth,
      renderColgroup,
      renderTableHeader,
      renderTableBody,
      renderTableFooter,
      onTableContentScroll,
      renderPagination,
      renderTNode,
      handleRowMounted,
      onFixedChange,
      updateHeaderScroll,
      handleVirtualScroll: handleScroll,
    };
  },

  render(h) {
    const { rowAndColFixedPosition, onTableContentScroll } = this;
    const data = this.isPaginateData ? this.dataSource : this.data;
    const onScroll = this.isVirtual
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
    const fixedHeader = (this.isVirtual || this.headerAffixedTop) && !!Object.keys(this.thWidthList).length
      ? this.renderTableHeader(h, {
        isFixedHeader: this.isFixedHeader,
        rowAndColFixedPosition,
        thWidthList: this.thWidthList,
      })
      : null;

    const affixedHeader = Boolean((this.headerAffixedTop || this.isVirtual) && this.tableWidth) && (
      <div
        ref="affixHeaderRef"
        style={{ width: `${this.tableWidth}px`, opacity: Number(this.showAffixHeader) }}
        class={{ [this.tableBaseClass.affixedHeaderElm]: this.headerAffixedTop || this.isVirtual }}
      >
        <table
          class={[this.tableLayoutClasses[this.tableLayout]]}
          style={{ ...this.tableElementStyles, width: `${this.tableWidth}px` }}
        >
          {colgroup}
          {fixedHeader}
        </table>
      </div>
    );

    const translate = `translate(0, ${this.scrollHeight}px)`;
    const virtualStyle = {
      transform: translate,
      '-ms-transform': translate,
      '-moz-transform': translate,
      '-webkit-transform': translate,
    };
    const tableContent = (
      <div
        ref="tableContentRef"
        class={this.tableBaseClass.content}
        style={this.tableContentStyles}
        onScroll={onScroll}
      >
        {this.isVirtual && <div class={this.virtualScrollClasses.cursor} style={virtualStyle} />}

        <table ref="tableElmRef" class={this.tableLayoutClasses[this.tableLayout]} style={this.tableElementStyles}>
          {colgroup}
          {header}
          {this.renderTableBody(h, {
            rowAndColFixedPosition,
            showColumnShadow: this.showColumnShadow,
            data: this.isVirtual ? this.visibleData : data,
            columns: this.spansAndLeafNodes.leafColumns,
            translateY: this.translateY,
            scrollType: this.scrollType,
            isVirtual: this.isVirtual,
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
        {this.renderTNode('topContent')}

        {!!(this.isVirtual || this.headerAffixedTop)
          && (this.headerAffixedTop ? (
            <Affix offsetTop={0} props={this.headerAffixProps} onFixedChange={this.onFixedChange}>
              {affixedHeader}
            </Affix>
          ) : (
            this.isFixedHeader && affixedHeader
          ))}

        {loadingContent}

        {this.bordered && this.isFixedHeader && this.isWidthOverflow && (
          <div
            class={this.tableBaseClass.scrollbarDivider}
            style={{ right: `${this.scrollbarWidth / 2 - 1.5}px`, height: `${this.tableContentRef.offsetHeight}px` }}
          ></div>
        )}

        {this.renderPagination(h)}
      </div>
    );
  },
});
