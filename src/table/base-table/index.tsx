import Vue, { VNode } from 'vue';
import throttle from 'lodash/throttle';
import mixins from '../../utils/mixins';
import getConfigReceiverMixins, { TableConfig } from '../../config-provider/config-receiver';
import { prefix } from '../../config';
import flatColumns from '../util/props-util';
import baseTableProps from '../base-table-props';
import { ClassName } from '../../common';
import {
  DataType, BaseTableCol, TdBaseTableProps, RowEventContext,
} from '../type';
import TableBody from './table-body';
import TableHeader from './table-header';
import TableColGroup from './col-group';
import Pagination from '../../pagination';
import Loading from '../../loading';
import { debounce, getScrollDirection, SCROLL_DIRECTION } from '../util/common';
import { PageInfo } from '../../pagination/type';
import { renderTNodeJSX } from '../../utils/render-tnode';
import { emitEvent } from '../../utils/event';
import { EventNameWithKebab } from '../util/interface';
import { SIZE_CLASSNAMES } from '../../utils/classnames';
import primaryTableProps from '../primary-table-props';

type PageChangeContext = Parameters<TdBaseTableProps['onPageChange']>;

export default mixins(getConfigReceiverMixins<Vue, TableConfig>('table')).extend({
  name: 'TBaseTable',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    ...baseTableProps,
    selectedRowKeys: primaryTableProps.selectedRowKeys,
    provider: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      scrollableToLeft: false,
      scrollableToRight: false,
      scrollBarWidth: 0,
      // 用于兼容处理 Pagination 的非受控属性（非受控属性仅有 change 事件变化，无 props 变化，因此只需监听事件）
      defaultCurrent: 0,
      // 用于兼容处理 Pagination 的非受控属性
      defaultPageSize: 0,
      useFixedHeader: false,
    };
  },
  computed: {
    // this.defaultCurrent 属于分页组件抛出的事件参数，非受控的情况也会有该事件触发
    // this.pagination.defaultCurrent 为表格组件传入的非受控属性
    current(): number {
      return this.pagination?.current || this.defaultCurrent || this.pagination?.defaultCurrent;
    },
    pageSize(): number {
      return this.pagination?.pageSize || this.defaultPageSize || this.pagination?.defaultPageSize;
    },
    dataSource(): Array<DataType> {
      if (!this.hasPagination) return this.data.slice(0);
      const { current, pageSize } = this;
      if (this.data.length > pageSize && !this.disableDataSort) {
        return this.data.slice((current - 1) * pageSize, current * pageSize);
      }
      return this.data;
    },
    flattedColumns(): Array<BaseTableCol> {
      return flatColumns(this.columns);
    },
    isEmpty(): boolean {
      return (!this.dataSource || this.dataSource.length === 0) && !this.loading;
    },
    hasFixedColumns(): boolean {
      const { columns } = this;
      return columns.some((item: BaseTableCol) => item.fixed === 'right' || item.fixed === 'left');
    },
    hasPagination(): boolean {
      return !!this.pagination;
    },
    isLoading(): boolean {
      return !!this.loading;
    },
    tableHeight(): number | string {
      const {
        height, maxHeight, useFixedHeader, isEmpty,
      } = this;
      if (isEmpty) {
        return 'auto';
      }
      if (height !== 'auto' && height) {
        return height;
      }
      if (maxHeight && useFixedHeader) {
        return maxHeight;
      }
      return 'auto';
    },
    // 是否固定表头
    fixedHeader(): boolean {
      const { tableHeight } = this;
      return tableHeight !== 'auto';
    },
    // common class
    commonClass(): ClassName {
      const classes = [
        `${prefix}-table`,
        {
          [SIZE_CLASSNAMES.small]: this.size === 'small',
          [SIZE_CLASSNAMES.large]: this.size === 'large',
          [`${prefix}-table--bordered`]: this.bordered,
          [`${prefix}-table--striped`]: this.stripe,
          [`${prefix}-table--hoverable`]: this.hover,
          [`${prefix}-table__row--draggable`]: this.provider.sortOnRowDraggable,
          [`${prefix}-table-table--align-top`]: this.verticalAlign === 'top',
          [`${prefix}-table-table--align-bottom`]: this.verticalAlign === 'bottom',
          [`${prefix}-table__cell--fixed`]: this.hasFixedColumns,
          [`${prefix}-table--has-fixed`]: this.hasFixedColumns,
          [`${prefix}-table__header--fixed`]: this.fixedHeader,
        },
      ];
      return classes;
    },
    usePadding(): boolean {
      return this.fixedHeader || this.scrollableToRight || this.scrollableToLeft;
    },
  },
  methods: {
    // 检查是否还可以向左或者向右滚动
    checkScrollableToLeftOrRight() {
      const scrollContainer = this.$refs[this.fixedHeader ? 'scrollBody' : 'tableContent'] as HTMLElement;
      if (!scrollContainer) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      this.scrollableToLeft = scrollLeft > 0;
      this.scrollableToRight = scrollLeft + clientWidth < scrollWidth;
    },
    // 窗口大小变化时横向滚动条可能出现或消失，故检查滚动条状态;
    addWindowResizeEventListener() {
      const checkScrollableToLeftOrRight = debounce(this.checkScrollableToLeftOrRight);
      window.addEventListener('resize', checkScrollableToLeftOrRight);
      this.$once('hook:beforeDestroy', () => window.removeEventListener('resize', checkScrollableToLeftOrRight));
    },
    renderHeader(): VNode {
      const { columns, $scopedSlots: scopedSlots, bordered } = this;
      return <TableHeader scopedSlots={scopedSlots} columns={columns} bordered={bordered} />;
    },
    registerRowEvents() {
      const events = {};
      EventNameWithKebab.forEach((eventName) => {
        events[eventName] = (params: RowEventContext<any>) => {
          emitEvent(this, eventName, params);
        };
      });
      return events;
    },
    renderBody(): VNode {
      const { $listeners: listener, $scopedSlots: scopedSlots } = this;
      const rowEvents = this.registerRowEvents();
      const props = {
        props: {
          ...this.$props,
          rowKey: this.rowKey,
          data: this.dataSource,
          provider: this.provider,
          columns: this.flattedColumns,
          rowClassName: this.rowClassName,
          current: this.current,
          selectedRowKeys: this.selectedRowKeys,
          rowspanAndColspan: this.rowspanAndColspan,
          firstFullRow: this.firstFullRow,
          lastFullRow: this.lastFullRow,
        },
        scopedSlots,
        on: {
          ...listener,
          ...rowEvents,
        },
      };
      return <TableBody {...props} />;
    },
    renderEmptyTable(): VNode {
      if (this.empty === null) return null;
      const useLocale = !this.empty && !this.$scopedSlots.empty;
      const { height } = this;
      const wrapperStyle: { height?: string | number } = {};
      if (height !== 'auto') {
        wrapperStyle.height = isNaN(Number(height)) ? height : `${height}px`;
      }
      return (
        <div style={wrapperStyle} class={`${prefix}-table__empty`}>
          {useLocale ? this.global.empty : renderTNodeJSX(this, 'empty')}
        </div>
      );
    },
    renderPagination(): VNode {
      const paginationProps = this.pagination;
      return (
        <div class={`${prefix}-table__pagination`}>
          <Pagination
            props={{ ...paginationProps }}
            {...{
              on: {
                change: (pageInfo: PageInfo) => {
                  const { current, pageSize } = pageInfo;
                  emitEvent<PageChangeContext>(this, 'page-change', pageInfo, this.dataSource);
                  this.defaultCurrent = current;
                  this.defaultPageSize = pageSize;
                },
              },
            }}
          />
        </div>
      );
    },
    renderTableWithFixedHeader(): Array<VNode> {
      const fixedTable: Array<VNode> = [];
      const {
        columns,
        provider: { asyncLoadingProps },
        tableLayout,
        scrollBarWidth,
        hasFixedColumns,
        tableHeight,
        usePadding,
      } = this;
      // handle scroll
      const handleScroll = throttle((e: Event) => {
        const { target } = e;
        const { scrollLeft } = target as HTMLElement;
        (this.$refs.scrollHeader as HTMLElement).scrollLeft = scrollLeft;
        this.handleScroll(e as WheelEvent);
      }, 10);
      //  fixed table header
      const paddingRight = `${scrollBarWidth}px`;
      const headerContainerStyle = columns.length > 1 && usePadding ? { paddingRight } : {};
      fixedTable.push(
        <div class={`${prefix}-table__header`} style={headerContainerStyle} ref="scrollHeader">
          <table style={{ tableLayout }}>
            <TableColGroup columns={columns} />
            {this.renderHeader()}
          </table>
        </div>,
      );
      const containerStyle = {
        height: isNaN(Number(tableHeight)) ? tableHeight : `${Number(tableHeight)}px`,
        width: hasFixedColumns ? '100%' : undefined,
      };
      // fixed table body
      fixedTable.push(
        <div
          class={`${prefix}-table__body`}
          style={containerStyle}
          {...asyncLoadingProps}
          ref="scrollBody"
          onScroll={handleScroll}
        >
          <table ref="table" style={{ tableLayout }}>
            <TableColGroup columns={columns} />
            {this.renderBody()}
            {this.renderFooter()}
          </table>
        </div>,
      );
      return fixedTable;
    },
    renderLoadingContent(): VNode {
      return renderTNodeJSX(this, 'loading', { defaultNode: <div /> });
    },
    renderFooter() {
      const {
        flattedColumns: { length: colspan },
      } = this;
      const footerContent: VNode = renderTNodeJSX(this, 'footer');
      return footerContent ? (
        <tfoot>
          <tr>
            <td colspan={colspan}>{footerContent}</td>
          </tr>
        </tfoot>
      ) : null;
    },
    handleScroll(e: WheelEvent) {
      this.checkScrollableToLeftOrRight();
      const { scrollLeft, scrollTop } = e.target as HTMLElement;
      const direction = getScrollDirection(scrollLeft, scrollTop);
      if (direction !== SCROLL_DIRECTION.UNKNOWN) {
        const scrollListenerName = direction === SCROLL_DIRECTION.X ? 'scroll-x' : 'scroll-y';
        const scrollParams = {
          e,
        };
        emitEvent(this, scrollListenerName, scrollParams);
      }
    },
    checkMaxHeight() {
      const { maxHeight } = this;
      if (maxHeight && (this.$refs.tableContent as HTMLElement).clientHeight > maxHeight) {
        this.useFixedHeader = true;
      }
    },
  },
  render() {
    const {
      hasPagination,
      commonClass,
      fixedHeader,
      columns,
      tableLayout,
      isLoading,
      isEmpty,
      useFixedHeader,
      hasFixedColumns,
    } = this;
    const body: Array<VNode> = [];
    // colgroup
    const tableColGroup = <TableColGroup columns={columns} />;
    // header
    const tableHeader = this.renderHeader();
    // table content
    const tableContent: Array<VNode> = [tableColGroup, tableHeader];
    // fixed table
    let fixedTableContent: Array<VNode>;
    // 渲染带有固定列的表格或者固定表头的表格
    if (fixedHeader || useFixedHeader) {
      fixedTableContent = this.renderTableWithFixedHeader();
    } else {
      // table body
      tableContent.push(this.renderBody());
      tableContent.push(this.renderFooter());
    }
    if (isEmpty) {
      const empty = this.renderEmptyTable();
      empty && body.push(empty);
    }
    // 渲染分页
    if (hasPagination) {
      body.push(this.renderPagination());
    }
    const handleScroll = throttle(this.handleScroll, 100);
    const tableContentClass = [
      `${prefix}-table__content`,
      {
        [`${prefix}-table__content--scrollable-to-right`]: this.scrollableToRight,
        [`${prefix}-table__content--scrollable-to-left`]: this.scrollableToLeft,
      },
    ];
    let width;
    const { tableContent: tableContentEl, table: tableEl } = this.$refs as Record<string, HTMLElement>;
    if (!hasFixedColumns && tableContentEl && tableContentEl.clientWidth < tableEl.clientWidth) {
      width = `${tableEl.clientWidth}px`;
    }
    return (
      <div class={commonClass} style={{ width }}>
        {renderTNodeJSX(this, 'topContent')}
        <Loading loading={isLoading} showOverlay text={this.renderLoadingContent}>
          <div ref="tableContent" class={tableContentClass} onScroll={handleScroll}>
            {fixedTableContent || (
              <table ref="table" style={{ tableLayout }}>
                {tableContent}
              </table>
            )}
          </div>
          {body}
        </Loading>
      </div>
    );
  },
  updated() {
    this.checkMaxHeight();
  },

  mounted() {
    if (this.hasFixedColumns) {
      // 首次检查滚动条状态；设置settimeout 是为了等待父组件渲染完
      let timer = setTimeout(() => {
        this.checkScrollableToLeftOrRight();
        clearTimeout(timer);
        timer = null;
      }, 0);
      this.addWindowResizeEventListener();
    }

    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = `
      width: 99px;
      height: 99px;
      overflow: scroll;
      position: absolute;
      top: -9999px;`;
    scrollDiv.classList.add('scrollbar');
    document.body.appendChild(scrollDiv);
    this.scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    this.checkMaxHeight();
  },
});
