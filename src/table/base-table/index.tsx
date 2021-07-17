import { VNode } from 'vue';
import mixins from '../../utils/mixins';
import getLocalRecevierMixins from '../../locale/local-receiver';
import { prefix } from '../../config';
import { flatColumns } from '../util/props-util';
import baseTableProps from '../base-table-props';
import { DataType, BaseTableCol, TdBaseTableProps, RowEventContext } from '../type';
import TableBody from './table-body';
import TableHeader from './table-header';
import Loading from './loading-content';
import TableColGroup from './col-group';
import Pagination from '../../pagination';
import { getScrollDirection, SCROLL_DIRECTION } from '../util/common';
import { PageInfo } from '../../pagination/type';
import throttle from 'lodash/throttle';
import { renderTNodeJSX } from '../../utils/render-tnode';
import { emitEvent } from '../../utils/event';
import { EventNameWithKebab } from '../util/interface';

type PageChangeContext = Parameters<TdBaseTableProps['onPageChange']>;

export default mixins(getLocalRecevierMixins('table')).extend({
  name: `${prefix}-base-table`,
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    ...baseTableProps,
    provider: {
      type: Object,
      default() {
        return {
          renderRows(): void {
            return;
          },
        };
      },
    },
  },
  data() {
    return {
      scrollBarWidth: 0,
      // 用于兼容处理 Pagination 的非受控属性（非受控属性仅有 change 事件变化，无 props 变化，因此只需监听事件）
      defaultCurrent: 0,
      // 用于兼容处理 Pagination 的非受控属性
      defaultPageSize: 0,
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
    tableHeight(): number {
      const { height } = this;
      if (typeof height === 'string') {
        return parseInt(height, 10);
      }
      return height || 0;
    },
    // 是否固定表头
    fixedHeader(): boolean {
      return this.tableHeight > 0;
    },
    // common class
    commonClass(): Array<string> {
      const { bordered, stripe, hover, size, verticalAlign, hasFixedColumns, fixedHeader } = this;
      const commonClass: Array<string> = ['t-table'];
      if (bordered) {
        commonClass.push('t-table--bordered');
      }
      if (stripe) {
        commonClass.push('t-table--striped');
      }
      if (hover) {
        commonClass.push('t-table--hoverable');
      }
      // table size
      switch (size) {
        case 'small':
          commonClass.push('t-size-s');
          break;
        case 'large':
          commonClass.push('t-size-l');
          break;
        default:
      }
      // table verticalAlign
      switch (verticalAlign) {
        case 'top':
          commonClass.push('t-table-valign__top');
          break;
        case 'bottom':
          commonClass.push('t-table-valign__bottom');
          break;
        default:
      }
      // fixed table
      if (hasFixedColumns) {
        commonClass.push('t-table__cell--fixed t-table--has-fixed');
      }
      if (fixedHeader) {
        commonClass.push('t-table__header--fixed');
      }
      return commonClass;
    },
  },
  methods: {
    renderHeader(): VNode {
      const { columns, flattedColumns, $scopedSlots: scopedSlots, bordered } = this;
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
        <div class="t-table--empty">
          {useLocale ? this.t(this.locale.empty) : renderTNodeJSX(this, 'empty')}
        </div>
      );
    },
    renderPagination(): VNode {
      const paginationProps = this.pagination;
      return (
        <div class="t-table-pagination">
          <Pagination
            props={{ ...paginationProps }}
            {...{ on: {
              change: (pageInfo: PageInfo) => {
                paginationProps.onChange && paginationProps.onChange(pageInfo);
              },
              'current-change': (current: number, pageInfo: PageInfo) => {
                emitEvent<PageChangeContext>(this, 'page-change', pageInfo, this.dataSource);
                this.defaultCurrent = current;
                paginationProps.onCurrentChange && paginationProps.onCurrentChange(current, pageInfo);
              },
              'page-size-change': (pageSize: number, pageInfo: PageInfo) => {
                emitEvent<PageChangeContext>(this, 'page-change', pageInfo, this.dataSource);
                this.defaultPageSize = pageSize;
                paginationProps.onPageSizeChange && paginationProps.onPageSizeChange(pageSize, pageInfo);
              },
            } }}
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
        fixedHeader,
        scrollBarWidth,
        hasFixedColumns,
      } = this;
      // handle scroll
      const handleScroll = throttle((e: Event) => {
        const { target } = e;
        const { scrollLeft } = target as HTMLElement;
        (this.$refs.scrollHeader as HTMLElement).scrollLeft = scrollLeft;
        this.handleScroll(e as WheelEvent);
      }, 10);
      //  fixed table header
      const headerContainerWidth = fixedHeader && scrollBarWidth > 0 ? `calc(100% - ${scrollBarWidth}px)` : 'fit-content';
      fixedTable.push(<div class="t-table__header" style={{ width: headerContainerWidth }} ref="scrollHeader">
          <table style={{ tableLayout }}>
            <TableColGroup columns={columns} />
            {this.renderHeader()}
          </table>
        </div>);
      const containerStyle = {
        height: isNaN(Number(this.height)) ? this.height : `${Number(this.height)}px`,
        maxHeight: isNaN(Number(this.maxHeight)) ? this.maxHeight : `${Number(this.maxHeight)}px`,
        width: hasFixedColumns ? '100%' : undefined,
      };
      // fixed table body
      fixedTable.push(<div
          class="t-table__body"
          style={containerStyle}
          {...asyncLoadingProps}
          ref="scrollBody"
          onScroll={handleScroll}
        >
          <table style={{ tableLayout }}>
            <TableColGroup columns={columns} />
            {this.renderBody()}
            {this.renderFooter()}
          </table>
        </div>);
      return fixedTable;
    },
    renderLoadingContent(): VNode {
      return renderTNodeJSX(this, 'loading', <Loading />);
    },
    renderFooter() {
      const { flattedColumns: {
        length: colspan,
      }, isEmpty } = this;
      let footerContent: VNode;
      if (isEmpty) {
        footerContent = this.renderEmptyTable();
      } else {
        footerContent = renderTNodeJSX(this, 'footer');
      }
      return footerContent ? <tfoot>
                <tr>
                  <td colspan={colspan}>
                    {footerContent}
                  </td>
                </tr>
              </tfoot> : null;
    },
    handleScroll(e: WheelEvent) {
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
    // loading
    if (isLoading) {
      body.push(this.renderLoadingContent());
    } else {
      // 渲染带有固定列的表格或者固定表头的表格
      if (fixedHeader) {
        fixedTableContent = this.renderTableWithFixedHeader();
      } else {
        // table body
        tableContent.push(this.renderBody());
        tableContent.push(this.renderFooter());
      }
      // 渲染分页
      if (hasPagination) {
        body.push(this.renderPagination());
      }
    }
    const handleScroll = throttle(this.handleScroll, 100);
    return (
      <div class={commonClass}>
        <div class="t-table-content" style="overflow: auto;" onScroll={handleScroll}>
          {fixedTableContent ? fixedTableContent : <table style={{ tableLayout }}>{tableContent}</table>}
        </div>
        {body}
      </div>
    );
  },
  mounted() {
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
  },
});
