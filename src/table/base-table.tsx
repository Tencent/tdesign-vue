import {
  computed,
  defineComponent,
  SetupContext,
  toRefs,
  ref,
  provide,
  nextTick,
  PropType,
  watch,
  onMounted,
} from '@vue/composition-api';
import pick from 'lodash/pick';
import props from './base-table-props';
import useTableHeader from './hooks/useTableHeader';
import useColumnResize from './hooks/useColumnResize';
import useFixed from './hooks/useFixed';
import usePagination from './hooks/usePagination';
import useVirtualScroll from '../hooks/useVirtualScroll';
import Loading from '../loading';
import TBody, { extendTableProps } from './tbody';
import { BaseTableProps } from './interface';
import { useTNodeJSX } from '../hooks/tnode';
import useStyle, { formatCSSUnit } from './hooks/useStyle';
import useClassName from './hooks/useClassName';
import { useConfig } from '../config-provider/useConfig';
import { Affix } from '../affix';
import { ROW_LISTENERS } from './tr';
import THead from './thead';
import TFoot from './tfoot';

export const BASE_TABLE_EVENTS = ['page-change', 'cell-click', 'scroll', 'scrollX', 'scrollY'];
export const BASE_TABLE_ALL_EVENTS = ROW_LISTENERS.map((t) => `row-${t}`).concat(BASE_TABLE_EVENTS);

export interface TableListeners {
  [key: string]: Function;
}

export default defineComponent({
  name: 'TBaseTable',

  props: {
    ...props,
    renderExpandedRow: Function as PropType<BaseTableProps['renderExpandedRow']>,
  },

  setup(props: BaseTableProps, context: SetupContext) {
    const renderTNode = useTNodeJSX();
    const tableRef = ref<HTMLDivElement>();
    const tableElmRef = ref<HTMLTableElement>();
    const tableFootHeight = ref(0);
    const {
      virtualScrollClasses, tableLayoutClasses, tableBaseClass, tableColFixedClasses,
    } = useClassName();
    // 表格基础样式类
    const { tableClasses, tableContentStyles, tableElementStyles } = useStyle(props);
    const { global } = useConfig('table');
    // 固定表头和固定列逻辑
    const {
      affixHeaderRef,
      affixFooterRef,
      scrollbarWidth,
      virtualScrollHeaderPos,
      tableWidth,
      tableElmWidth,
      tableContentRef,
      isFixedHeader,
      isWidthOverflow,
      isFixedColumn,
      thWidthList,
      showColumnShadow,
      showAffixHeader,
      showAffixFooter,
      rowAndColFixedPosition,
      refreshTable,
      updateHeaderScroll,
      setUseFixedTableElmRef,
    } = useFixed(props, context);
    const { isMultipleHeader, spansAndLeafNodes, thList } = useTableHeader(props);
    const { dataSource, isPaginateData, renderPagination } = usePagination(props, context);

    // 列宽拖拽逻辑
    const columnResizeParams = useColumnResize(tableElmRef, refreshTable);
    const { resizeLineRef, resizeLineStyle } = columnResizeParams;

    const dynamicBaseTableClasses = computed(() => [
      tableClasses.value,
      {
        [tableBaseClass.headerFixed]: isFixedHeader.value,
        [tableBaseClass.columnFixed]: isFixedColumn.value,
        [tableBaseClass.widthOverflow]: isWidthOverflow.value,
        [tableBaseClass.multipleHeader]: isMultipleHeader.value,
        [tableColFixedClasses.leftShadow]: showColumnShadow.left,
        [tableColFixedClasses.rightShadow]: showColumnShadow.right,
      },
    ]);

    const tableElmClasses = computed(() => [
      [tableLayoutClasses[props.tableLayout]],
      { [tableBaseClass.fullHeight]: props.height },
    ]);

    const isVirtual = computed(
      () => props.scroll?.type === 'virtual' && props.data?.length > (props.scroll?.threshold || 100),
    );

    const showRightDivider = computed(
      () => props.bordered
        && isFixedHeader.value
        && ((isMultipleHeader.value && isWidthOverflow.value) || !isMultipleHeader.value),
    );

    watch(tableElmRef, () => {
      setUseFixedTableElmRef(tableElmRef.value);
    });

    const onFixedChange = () => {
      nextTick(() => {
        updateHeaderScroll();
      });
    };

    // Vue3 do not need getListener
    const getListener = () => {
      const listener: TableListeners = {};
      BASE_TABLE_ALL_EVENTS.forEach((key) => {
        listener[key] = (...args: any) => {
          context.emit(key, ...args);
        };
      });
      return listener;
    };

    // TODO: 这种直接解析 props 的方式，是非响应式的，无法动态设置虚拟滚动，不可如此使用。待改正
    const {
      type, rowHeight, bufferSize = 20, isFixedRowHeight = false,
    } = props.scroll || {};
    const { data } = toRefs<any>(props);
    const {
      trs = null,
      scrollHeight = null,
      visibleData = null,
      translateY = null,
      handleScroll: handleVirtualScroll = null,
      handleRowMounted = null,
    } = type === 'virtual'
      ? useVirtualScroll({
        container: tableContentRef,
        data,
        fixedHeight: isFixedRowHeight,
        lineHeight: rowHeight,
        bufferSize,
        threshold: props.scroll?.threshold,
      })
      : {};
    provide('tableContentRef', tableContentRef);
    provide('rowHeightRef', ref(rowHeight));

    let lastScrollY = -1;
    const onInnerVirtualScroll = (e: WheelEvent) => {
      const target = (e.target || e.srcElement) as HTMLElement;
      const top = target.scrollTop;
      // 排除横向滚动出发的纵向虚拟滚动计算
      if (Math.abs(lastScrollY - top) > 5) {
        handleVirtualScroll();
        lastScrollY = top;
      } else {
        lastScrollY = -1;
      }
    };

    // used for top margin
    const getTFootHeight = () => {
      if (!tableElmRef.value) return;
      tableFootHeight.value = tableElmRef.value.querySelector('tfoot')?.offsetHeight;
    };

    onMounted(() => {
      getTFootHeight();
    });

    return {
      thList,
      isVirtual,
      global,
      tableFootHeight,
      virtualScrollHeaderPos,
      tableWidth,
      tableElmWidth,
      tableRef,
      tableElmRef,
      tableBaseClass,
      spansAndLeafNodes,
      dynamicBaseTableClasses,
      tableContentStyles,
      tableElementStyles,
      virtualScrollClasses,
      tableLayoutClasses,
      tableElmClasses,
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
      affixFooterRef,
      showAffixHeader,
      showAffixFooter,
      scrollbarWidth,
      isMultipleHeader,
      showRightDivider,
      resizeLineRef,
      resizeLineStyle,
      columnResizeParams,
      getListener,
      renderPagination,
      renderTNode,
      handleRowMounted,
      onFixedChange,
      updateHeaderScroll,
      refreshTable,
      onInnerVirtualScroll,
    };
  },

  render(h) {
    const { rowAndColFixedPosition } = this;
    const data = this.isPaginateData ? this.dataSource : this.data;

    const defaultColWidth = this.tableLayout === 'fixed' && this.isWidthOverflow ? '100px' : undefined;
    const colgroup = (
      <colgroup>
        {(this.spansAndLeafNodes?.leafColumns || this.columns).map((col) => (
          <col key={col.colKey} style={{ width: formatCSSUnit(col.width) || defaultColWidth }}></col>
        ))}
      </colgroup>
    );
    const affixedHeader = Boolean((this.headerAffixedTop || this.isVirtual) && this.tableWidth) && (
      <div
        ref="affixHeaderRef"
        style={{ width: `${this.tableWidth}px`, opacity: Number(this.showAffixHeader) }}
        class={{ [this.tableBaseClass.affixedHeaderElm]: this.headerAffixedTop || this.isVirtual }}
      >
        <table class={this.tableElmClasses} style={{ ...this.tableElementStyles, width: `${this.tableElmWidth}px` }}>
          {colgroup}
          <THead
            scopedSlots={this.$scopedSlots}
            isFixedHeader={this.isFixedHeader}
            rowAndColFixedPosition={this.rowAndColFixedPosition}
            isMultipleHeader={this.isMultipleHeader}
            bordered={this.bordered}
            spansAndLeafNodes={this.spansAndLeafNodes}
            thList={this.thList}
            thWidthList={this.thWidthList}
            allowResizeColumnWidth={this.allowResizeColumnWidth}
            columnResizeParams={this.columnResizeParams}
          />
        </table>
      </div>
    );

    let marginScrollbarWidth = this.isWidthOverflow ? this.scrollbarWidth : 0;
    if (this.bordered) {
      marginScrollbarWidth += 1;
    }
    // Hack: Affix 组件，marginTop 临时使用 负 margin 定位位置
    const affixedFooter = Boolean(this.footerAffixedBottom && this.footData?.length && this.tableWidth) && (
      <Affix
        class={this.tableBaseClass.affixedFooterWrap}
        props={this.footerAffixProps}
        onFixedChange={this.onFixedChange}
        offsetBottom={marginScrollbarWidth || 0}
        style={{ marginTop: `${-1 * (this.tableFootHeight + marginScrollbarWidth)}px` }}
      >
        <div
          ref="affixFooterRef"
          style={{ width: `${this.tableWidth}px`, opacity: Number(this.showAffixFooter) }}
          class={['scrollbar', { [this.tableBaseClass.affixedFooterElm]: this.footerAffixedBottom || this.isVirtual }]}
        >
          <table class={this.tableElmClasses} style={{ ...this.tableElementStyles, width: `${this.tableElmWidth}px` }}>
            {colgroup}
            <TFoot
              rowKey={this.rowKey}
              scopedSlots={this.$scopedSlots}
              isFixedHeader={this.isFixedHeader}
              rowAndColFixedPosition={rowAndColFixedPosition}
              footData={this.footData}
              columns={this.columns}
              rowAttributes={this.rowAttributes}
              rowClassName={this.rowClassName}
              thWidthList={this.thWidthList}
            ></TFoot>
          </table>
        </div>
      </Affix>
    );

    const translate = `translate(0, ${this.scrollHeight}px)`;
    const virtualStyle = {
      transform: translate,
      '-ms-transform': translate,
      '-moz-transform': translate,
      '-webkit-transform': translate,
    };
    const tableBodyProps = {
      rowAndColFixedPosition,
      showColumnShadow: this.showColumnShadow,
      data: this.isVirtual ? this.visibleData : data,
      columns: this.spansAndLeafNodes.leafColumns,
      tableElm: this.tableRef,
      tableWidth: this.tableWidth,
      isWidthOverflow: this.isWidthOverflow,
      // 虚拟滚动相关属性
      isVirtual: this.isVirtual,
      translateY: this.translateY,
      scrollType: this.scrollType,
      rowHeight: this.rowHeight,
      trs: this.trs,
      bufferSize: this.bufferSize,
      scroll: this.scroll,
      tableContentElm: this.tableContentRef,
      handleRowMounted: this.handleRowMounted,
      renderExpandedRow: this.renderExpandedRow,
      ...pick(this.$props, extendTableProps),
    };
    // Vue3 do not need getListener
    const on = this.getListener();
    const scrollListener = this.isVirtual ? { scroll: this.onInnerVirtualScroll } : {};
    const tableContent = (
      <div
        ref="tableContentRef"
        class={this.tableBaseClass.content}
        style={this.tableContentStyles}
        on={scrollListener}
      >
        <div ref="resizeLineRef" class={this.tableBaseClass.resizeLine} style={this.resizeLineStyle}></div>
        {this.isVirtual && <div class={this.virtualScrollClasses.cursor} style={virtualStyle} />}
        <table ref="tableElmRef" class={this.tableElmClasses} style={this.tableElementStyles}>
          {colgroup}
          <THead
            scopedSlots={this.$scopedSlots}
            isFixedHeader={this.isFixedHeader}
            rowAndColFixedPosition={this.rowAndColFixedPosition}
            isMultipleHeader={this.isMultipleHeader}
            bordered={this.bordered}
            spansAndLeafNodes={this.spansAndLeafNodes}
            thList={this.thList}
            allowResizeColumnWidth={this.allowResizeColumnWidth}
            columnResizeParams={this.columnResizeParams}
          />
          <TBody scopedSlots={this.$scopedSlots} props={tableBodyProps} on={on} />
          <TFoot
            rowKey={this.rowKey}
            scopedSlots={this.$scopedSlots}
            isFixedHeader={this.isFixedHeader}
            rowAndColFixedPosition={rowAndColFixedPosition}
            footData={this.footData}
            columns={this.columns}
            rowAttributes={this.rowAttributes}
            rowClassName={this.rowClassName}
          ></TFoot>
        </table>
      </div>
    );

    const customLoadingText = this.renderTNode('loading');
    const loadingContent = this.loading !== undefined && (
      <Loading
        loading={!!this.loading}
        text={customLoadingText ? () => customLoadingText : undefined}
        attach={this.tableRef ? () => this.tableRef : undefined}
        showOverlay
        props={this.loadingProps}
      ></Loading>
    );

    const topContent = this.renderTNode('topContent');
    const bottomContent = this.renderTNode('bottomContent');
    const pagination = this.renderPagination(h);
    const bottom = !!bottomContent && <div class={this.tableBaseClass.bottomContent}>{bottomContent}</div>;
    return (
      <div ref="tableRef" class={this.dynamicBaseTableClasses} style="position: relative">
        {!!topContent && <div class={this.tableBaseClass.topContent}>{topContent}</div>}

        {!!(this.isVirtual || this.headerAffixedTop)
          && (this.headerAffixedTop ? (
            <Affix offsetTop={0} props={this.headerAffixProps} onFixedChange={this.onFixedChange}>
              {affixedHeader}
            </Affix>
          ) : (
            this.isFixedHeader && affixedHeader
          ))}

        {tableContent}

        {loadingContent}

        {affixedFooter}

        {this.showRightDivider && (
          <div
            class={this.tableBaseClass.scrollbarDivider}
            style={{ right: `${this.scrollbarWidth}px`, height: `${this.tableContentRef.offsetHeight}px` }}
          ></div>
        )}

        {bottom}
        {pagination}
      </div>
    );
  },
});
