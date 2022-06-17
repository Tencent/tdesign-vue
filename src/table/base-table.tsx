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
import log from '../_common/js/log';
import useAffix from './hooks/useAffix';
import { getAffixProps } from './utils';

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
    const tableBodyRef = ref<HTMLTableElement>();
    const tableFootHeight = ref(0);
    const {
      virtualScrollClasses, tableLayoutClasses, tableBaseClass, tableColFixedClasses,
    } = useClassName();
    // 表格基础样式类
    const { tableClasses, tableContentStyles, tableElementStyles } = useStyle(props);
    const { global } = useConfig('table');

    // 固定表头和固定列逻辑
    const {
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
      rowAndColFixedPosition,
      setData,
      refreshTable,
      emitScrollEvent,
      setUseFixedTableElmRef,
      updateColumnFixedShadow,
    } = useFixed(props, context);

    // 1. 表头吸顶；2. 表尾吸底；3. 底部滚动条吸底；4. 分页器吸底
    const {
      affixHeaderRef,
      affixFooterRef,
      horizontalScrollbarRef,
      paginationRef,
      showAffixHeader,
      showAffixFooter,
      showAffixPagination,
      onHorizontalScroll,
      setTableContentRef,
    } = useAffix(props);

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

    watch([dataSource], (dataSource) => {
      setData(dataSource);
    });

    const onFixedChange = () => {
      nextTick(() => {
        onHorizontalScroll();
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

    let lastScrollY = 0;
    const onInnerVirtualScroll = (e: WheelEvent) => {
      const target = (e.target || e.srcElement) as HTMLElement;
      const top = target.scrollTop;
      // 排除横向滚动出发的纵向虚拟滚动计算
      if (lastScrollY !== top) {
        isVirtual.value && handleVirtualScroll();
      } else {
        lastScrollY = 0;
        updateColumnFixedShadow(target);
        onHorizontalScroll(target);
      }
      lastScrollY = top;
      emitScrollEvent(e);
    };

    // used for top margin
    const getTFootHeight = () => {
      if (!tableElmRef.value) return;
      tableFootHeight.value = tableElmRef.value.querySelector('tfoot')?.offsetHeight;
    };

    onMounted(() => {
      getTFootHeight();
      setTableContentRef(tableContentRef.value);
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
      paginationRef,
      showAffixHeader,
      showAffixFooter,
      scrollbarWidth,
      isMultipleHeader,
      showRightDivider,
      resizeLineRef,
      resizeLineStyle,
      columnResizeParams,
      horizontalScrollbarRef,
      tableBodyRef,
      showAffixPagination,
      getListener,
      renderPagination,
      renderTNode,
      handleRowMounted,
      onFixedChange,
      onHorizontalScroll,
      refreshTable,
      onInnerVirtualScroll,
    };
  },

  render(h) {
    const { rowAndColFixedPosition } = this;
    const data = this.pagination ? this.dataSource : this.data;

    if (this.allowResizeColumnWidth) {
      log.warn('Table', 'allowResizeColumnWidth is going to be deprecated, please use resizable instead.');
    }
    const columnResizable = this.allowResizeColumnWidth === undefined ? this.resizable : this.allowResizeColumnWidth;
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
        style={{ width: `${this.tableWidth}px`, opacity: this.headerAffixedTop ? Number(this.showAffixHeader) : 1 }}
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
            resizable={columnResizable}
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
        props={getAffixProps(this.footerAffixedBottom, this.footerAffixProps)}
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
    const tBodyListener = this.getListener();
    const tableContent = (
      <div
        ref="tableContentRef"
        class={this.tableBaseClass.content}
        style={this.tableContentStyles}
        on={{ scroll: this.onInnerVirtualScroll }}
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
            resizable={columnResizable}
            columnResizeParams={this.columnResizeParams}
          />
          <TBody ref="tableBodyRef" scopedSlots={this.$scopedSlots} props={tableBodyProps} on={tBodyListener} />
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
        props={{ size: 'small', ...this.loadingProps }}
      ></Loading>
    );

    const topContent = this.renderTNode('topContent');
    const bottomContent = this.renderTNode('bottomContent');
    const pagination = (
      <div ref="paginationRef" style={{ opacity: Number(this.showAffixPagination) }}>
        {this.renderPagination(h)}
      </div>
    );
    const bottom = !!bottomContent && <div class={this.tableBaseClass.bottomContent}>{bottomContent}</div>;
    return (
      <div ref="tableRef" class={this.dynamicBaseTableClasses} style="position: relative">
        {!!topContent && <div class={this.tableBaseClass.topContent}>{topContent}</div>}

        {!!(this.isVirtual || this.headerAffixedTop)
          && (this.headerAffixedTop ? (
            <Affix
              offsetTop={0}
              props={getAffixProps(this.headerAffixedTop, this.headerAffixProps)}
              onFixedChange={this.onFixedChange}
            >
              {affixedHeader}
            </Affix>
          ) : (
            this.isFixedHeader && affixedHeader
          ))}

        {tableContent}

        {loadingContent}

        {affixedFooter}

        {/* 调整列宽时的指示线 */}
        {this.showRightDivider && (
          <div
            class={this.tableBaseClass.scrollbarDivider}
            style={{ right: `${this.scrollbarWidth}px`, height: `${this.tableContentRef.offsetHeight}px` }}
          ></div>
        )}

        {bottom}

        {/* 吸底的滚动条 */}
        {this.horizontalScrollAffixedBottom && (
          <Affix
            offsetBottom={0}
            props={getAffixProps(this.horizontalScrollAffixedBottom)}
            style={{ marginTop: `-${this.scrollbarWidth * 2}px` }}
          >
            <div
              ref="horizontalScrollbarRef"
              class={['scrollbar', this.tableBaseClass.obviousScrollbar]}
              style={{
                width: `${this.tableWidth}px`,
                overflow: 'auto',
                opacity: Number(this.showAffixFooter),
              }}
            >
              <div style={{ width: `${this.tableElmWidth}px`, height: '5px' }}></div>
            </div>
          </Affix>
        )}

        {/* 吸底的分页器 */}
        {this.paginationAffixedBottom ? <Affix offsetBottom={0}>{pagination}</Affix> : pagination}
      </div>
    );
  },
});
