import {
  computed, defineComponent, SetupContext, toRefs, ref, provide, nextTick,
} from '@vue/composition-api';
import pick from 'lodash/pick';
import props from './base-table-props';
import useTableHeader from './hooks/useTableHeader';
import useTableBody from './hooks/useTableBody';
import useFixed from './hooks/useFixed';
import usePagination from './hooks/usePagination';
import useVirtualScroll from '../hooks/useVirtualScroll';
import Loading from '../loading';
import TBody, { extendTableProps } from './tbody';
import { BaseTableProps } from './interface';
import { useTNodeJSX } from '../hooks/tnode';
import useStyle, { formatCSSUnit } from './hooks/useStyle';
import useClassName from './hooks/useClassName';
import { TableConfig, useConfig } from '../config-provider/useConfig';
import { Affix } from '../affix';
import { ROW_LISTENERS } from './tr';
import useCommonClassName from '../hooks/useCommonClassName';
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
    /**
     * 渲染展开行，非公开属性，请勿在业务中使用
     */
    renderExpandedRow: Function,
  },

  setup(props: BaseTableProps, context: SetupContext) {
    const renderTNode = useTNodeJSX();
    const tableRef = ref<HTMLDivElement>();
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
    const { isMultipleHeader, spansAndLeafNodes, thList } = useTableHeader(props);
    const { renderTableBody } = useTableBody(props, context);
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

    const showRightDivider = computed(
      () => props.bordered
        && isFixedHeader.value
        && ((isMultipleHeader.value && isWidthOverflow.value) || !isMultipleHeader.value),
    );

    const onFixedChange = (val: number | false) => {
      if (val !== false) {
        nextTick(() => {
          updateHeaderScroll();
        });
      }
    };

    // Vue3 do not need getListenser
    const getListenser = () => {
      const listenser: TableListeners = {};
      BASE_TABLE_ALL_EVENTS.forEach((key) => {
        listenser[key] = (...args: any) => {
          context.emit(key, ...args);
        };
      });
      return listenser;
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
      handleScroll: handleVirtualScroll = null,
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

    let lastScrollY = -1;
    const onInnerScroll = isVirtual.value
      ? (e: WheelEvent) => {
        onTableContentScroll(e);
        const target = (e.target || e.srcElement) as HTMLElement;
        const top = target.scrollTop;
        // 排除横向滚动出发的纵向虚拟滚动计算
        if (Math.abs(lastScrollY - top) > 5) {
          handleVirtualScroll();
          lastScrollY = top;
        } else {
          lastScrollY = -1;
        }
      }
      : onTableContentScroll;

    return {
      thList,
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
      isMultipleHeader,
      showRightDivider,
      getListenser,
      renderTableBody,
      onTableContentScroll,
      renderPagination,
      renderTNode,
      handleRowMounted,
      onFixedChange,
      updateHeaderScroll,
      onInnerScroll,
    };
  },

  render(h) {
    const { rowAndColFixedPosition } = this;
    const data = this.isPaginateData ? this.dataSource : this.data;

    const colgroup = (
      <colgroup>
        {(this.spansAndLeafNodes?.leafColumns || this.columns).map((col) => (
          <col style={{ width: formatCSSUnit(col.width) }}></col>
        ))}
      </colgroup>
    );

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
          {
            <THead
              scopedSlots={this.$scopedSlots}
              isFixedHeader={this.isFixedHeader}
              rowAndColFixedPosition={this.rowAndColFixedPosition}
              isMultipleHeader={this.isMultipleHeader}
              bordered={this.bordered}
              spansAndLeafNodes={this.spansAndLeafNodes}
              thList={this.thList}
              thWidthList={this.thWidthList}
            />
          }
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
    const tableBodyProps = {
      rowAndColFixedPosition,
      showColumnShadow: this.showColumnShadow,
      data: this.isVirtual ? this.visibleData : data,
      columns: this.spansAndLeafNodes.leafColumns,
      tableElm: this.tableRef,
      // 虚拟滚动相关属性
      isVirtual: this.isVirtual,
      translateY: this.translateY,
      scrollType: this.scrollType,
      rowHeight: this.rowHeight,
      trs: this.trs,
      bufferSize: this.bufferSize,
      handleRowMounted: this.handleRowMounted,
      renderExpandedRow: this.renderExpandedRow,
      ...pick(this.$props, extendTableProps),
    };
    // Vue3 do not need getListenser
    const on = this.getListenser();
    const tableContent = (
      <div
        ref="tableContentRef"
        class={this.tableBaseClass.content}
        style={this.tableContentStyles}
        onScroll={this.onInnerScroll}
      >
        {this.isVirtual && <div class={this.virtualScrollClasses.cursor} style={virtualStyle} />}

        <table ref="tableElmRef" class={this.tableLayoutClasses[this.tableLayout]} style={this.tableElementStyles}>
          {colgroup}
          <THead
            scopedSlots={this.$scopedSlots}
            isFixedHeader={this.isFixedHeader}
            rowAndColFixedPosition={this.rowAndColFixedPosition}
            isMultipleHeader={this.isMultipleHeader}
            bordered={this.bordered}
            spansAndLeafNodes={this.spansAndLeafNodes}
            thList={this.thList}
          />
          {/* replace scopedSlots of slots in Vue3
           * 保留 TBody 和 renderTableBody，探索两种写法性能差异，目前没发现明显差异。
           * 就 tbody 而言，差异甚小，绝对部分的数据变化都会涉及到内容重绘。暂时使用 renderTableBody，因为 TBody 要多一层监听，且 TBody 的虚拟滚动会出现空白
           * */}
          <TBody scopedSlots={this.$scopedSlots} props={tableBodyProps} on={on} />
          {/* {this.renderTableBody(h, tableBodyProps)} */}
          <TFoot
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

        {this.showRightDivider && (
          <div
            class={this.tableBaseClass.scrollbarDivider}
            style={{ right: `${this.scrollbarWidth}px`, height: `${this.tableContentRef.offsetHeight}px` }}
          ></div>
        )}

        {this.renderPagination(h)}
      </div>
    );
  },
});
