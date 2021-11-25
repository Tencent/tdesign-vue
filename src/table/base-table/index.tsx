import Vue, { VNode } from 'vue';
import throttle from 'lodash/throttle';
import mixins from '../../utils/mixins';
import getConfigReceiverMixins, { TableConfig } from '../../config-provider/config-receiver';
import { prefix } from '../../config';
import flatColumns from '../util/props-util';
import baseTableProps from '../base-table-props';
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
        return {
          renderRows(): void {

          },
        };
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
      if (this.data.length > pageSize) {
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
    commonClass(): Array<string> {
      const {
        bordered, stripe, hover, size, verticalAlign, hasFixedColumns, fixedHeader,
      } = this;
      const commonClass: Array<string> = [`${prefix}-table`];
      if (bordered) {
        commonClass.push(`${prefix}-table--bordered`);
      }
      if (stripe) {
        commonClass.push(`${prefix}-table--striped`);
      }
      if (hover) {
        commonClass.push(`${prefix}-table--hoverable`);
      }
      if (this.provider.sortOnRowDraggable) {
        commonClass.push(`${prefix}-table__row--draggable`);
      }
      // table size
      switch (size) {
        case 'small':
          commonClass.push(`${prefix}-size-s`);
          break;
        case 'large':
          commonClass.push(`${prefix}-size-l`);
          break;
        default:
      }
      // table verticalAlign
      switch (verticalAlign) {
        case 'top':
          commonClass.push(`${prefix}-table-valign__top`);
          break;
        case 'bottom':
          commonClass.push(`${prefix}-table-valign__bottom`);
          break;
        default:
      }
      // fixed table
      if (hasFixedColumns) {
        commonClass.push(`${prefix}-table__cell--fixed ${prefix}-table--has-fixed`);
      }
      if (fixedHeader) {
        commonClass.push(`${prefix}-table__header--fixed`);
      }
      return commonClass;
    },
  },
  methods: {
    // 检查是否还可以向左或者向右滚动
    checkScrollableToLeftOrRight() {
      const scrollContainer = this.$refs[this.fixedHeader ? 'scrollBody' : 'tableContent'] as HTMLElement;
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
      const {
        columns, flattedColumns, $scopedSlots: scopedSlots, bordered,
      } = this;
      return <TableHeader
              scopedSlots={scopedSlots}
              columns={columns}
              columnsProps={flattedColumns}
              bordered={bordered}
            />;
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
      const {
        $listeners: listener,
        $scopedSlots: scopedSlots,
      } = this;
      const rowEvents = this.registerRowEvents();
      const props = {
        props: {
          rowKey: this.rowKey,
          data: this.dataSource,
          provider: this.provider,
          columns: this.flattedColumns,
          rowClassName: this.rowClassName,
          current: this.current,
          selectedRowKeys: this.selectedRowKeys,
          rowspanAndColspan: this.rowspanAndColspan,
        },
        scopedSlots,
        on: {
          ...listener,
          ...rowEvents,
        },
      };
      return (
        <TableBody { ...props } />
      );
    },
    renderEmptyTable(): VNode {
      const useLocale = !this.empty && !this.$scopedSlots.empty;
      return (
        <div class={`${prefix}-table--empty`}>
          {useLocale ? this.global.empty : renderTNodeJSX(this, 'empty')}
        </div>
      );
    },
    renderPagination(): VNode {
      const paginationProps = this.pagination;
      return (
        <div class={`${prefix}-table-pagination`}>
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
      fixedTable.push(<div class={`${prefix}-table__header`} style={{ paddingRight: columns.length > 1 ? paddingRight : '' }} ref="scrollHeader">
          <table style={{ tableLayout, paddingRight }}>
            <TableColGroup columns={columns} />
            {this.renderHeader()}
          </table>
        </div>);
      const containerStyle = {
        height: isNaN(Number(tableHeight)) ? tableHeight : `${Number(tableHeight)}px`,
        width: hasFixedColumns ? '100%' : undefined,
      };
      // fixed table body
      fixedTable.push(<div
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
        </div>);
      return fixedTable;
    },
    renderLoadingContent(): VNode {
      return renderTNodeJSX(this, 'loading', { defaultNode: <div /> });
    },
    renderFooter() {
      const {
        flattedColumns: {
          length: colspan,
        },
      } = this;
      const footerContent: VNode = renderTNodeJSX(this, 'footer');
      return footerContent ? <tfoot>
                <tr>
                  <td colspan={colspan}>
                    {footerContent}
                  </td>
                </tr>
              </tfoot> : null;
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
      body.push(this.renderEmptyTable());
    }
    // 渲染分页
    if (hasPagination) {
      body.push(this.renderPagination());
    }
    const handleScroll = throttle(this.handleScroll, 100);
    const tableContentClass = [`${prefix}-table-content`, {
      [`${prefix}-table-content--scrollable-to-right`]: this.scrollableToRight,
      [`${prefix}-table-content--scrollable-to-left`]: this.scrollableToLeft,
    }];
    let width;
    const { tableContent: tableContentEl, table: tableEl } = this.$refs as Record<string, HTMLElement>;
    if (!hasFixedColumns && tableContentEl && tableContentEl.clientWidth < tableEl.clientWidth) {
      width = `${tableEl.clientWidth}px`;
    }
    return (
      <div class={commonClass} style={{ width }}>
        <Loading loading={isLoading} showOverlay text={this.renderLoadingContent}>
          <div
            ref='tableContent'
            class={tableContentClass}
            onScroll={handleScroll}
          >
            {fixedTableContent || <table ref="table" style={{ tableLayout }}>{tableContent}</table>}
          </div>
          {body}
        </Loading>
      </div>
    );
  },
  mounted() {
    if (this.hasFixedColumns) {
      // 首次检查滚动条状态；设置settimeout 是为了等待父组件渲染完
      setTimeout(() => {
        this.checkScrollableToLeftOrRight();
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
    const { maxHeight } = this;
    if (maxHeight && (this.$refs.tableContent as HTMLElement).clientHeight > maxHeight) {
      this.useFixedHeader = true;
    }
  },
});
