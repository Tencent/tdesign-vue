import {
  defineComponent, computed, PropType, SetupContext, toRefs,
} from '@vue/composition-api';
import { CreateElement } from 'vue';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import pick from 'lodash/pick';
import TrElement, { TrProps, ROW_LISTENERS, TABLE_PROPS } from './tr';
import { useConfig } from '../config-provider/useConfig';
import { BaseTableProps, RowAndColFixedPosition } from './interface';

import { useTNodeJSX } from '../hooks/tnode';
import useClassName from './hooks/useClassName';
import baseTableProps from './base-table-props';
import useRowspanAndColspan from './hooks/useRowspanAndColspan';

export const ROW_AND_TD_LISTENERS = ROW_LISTENERS.concat('cell-click');
export interface TableBodyProps extends BaseTableProps {
  // 固定列 left/right 具体值
  rowAndColFixedPosition: RowAndColFixedPosition;
  showColumnShadow: { left: boolean; right: boolean };
  tableElm: HTMLDivElement;
  tableWidth: number;
  isWidthOverflow: boolean;

  // 以下内容为虚拟滚动所需参数
  translateY: number;
  scrollType: string;
  isVirtual: boolean;
  rowHeight: number;
  trs: Map<number, object>;
  bufferSize: number;
  tableContentElm: HTMLDivElement;
  handleRowMounted: () => void;
}

// table 到 body 的相同属性
export const extendTableProps = [
  'rowKey',
  'rowClassName',
  'rowAttributes',
  'loading',
  'empty',
  'fixedRows',
  'firstFullRow',
  'lastFullRow',
  'rowspanAndColspan',
  'scroll',
  'onCellClick',
  'onPageChange',
  'onRowClick',
  'onRowDblclick',
  'onRowMouseover',
  'onRowMousedown',
  'onRowMouseenter',
  'onRowMouseleave',
  'onRowMouseup',
  'onScroll',
  'onScrollX',
  'onScrollY',
];

export default defineComponent({
  name: 'TBody',

  props: {
    data: Array as PropType<TableBodyProps['data']>,
    columns: Array as PropType<TableBodyProps['columns']>,
    rowAndColFixedPosition: Map as PropType<TableBodyProps['rowAndColFixedPosition']>,
    showColumnShadow: Object as PropType<TableBodyProps['showColumnShadow']>,
    tableElm: {},
    tableWidth: Number,
    isWidthOverflow: Boolean,
    // 以下内容为虚拟滚动所需参数
    translateY: Number,
    scrollType: String,
    isVirtual: Boolean,
    rowHeight: Number,
    trs: Map as PropType<TableBodyProps['trs']>,
    bufferSize: Number,
    // eslint-disable-next-line
    tableContentElm: {},
    handleRowMounted: Function as PropType<TableBodyProps['handleRowMounted']>,
    renderExpandedRow: Function as PropType<TableBodyProps['renderExpandedRow']>,
    firstFullRow: [String, Function] as PropType<TableBodyProps['firstFullRow']>,
    lastFullRow: [String, Function] as PropType<TableBodyProps['lastFullRow']>,
    ...pick(baseTableProps, extendTableProps),
  },

  // eslint-disable-next-line
  setup(props: TableBodyProps, { emit }: SetupContext) {
    const renderTNode = useTNodeJSX();
    const {
      data, columns, rowKey, rowspanAndColspan,
    } = toRefs(props);
    const { t, global } = useConfig('table');
    const { tableFullRowClasses, tableBaseClass } = useClassName();
    const { skipSpansMap } = useRowspanAndColspan(data, columns, rowKey, rowspanAndColspan);

    const tbodyClasses = computed(() => [tableBaseClass.body]);

    const isFixedLeftColumn = computed(
      () => props.isWidthOverflow && !!props.columns.find((col) => col.fixed === 'left'),
    );

    const getTrListeners = () => {
      const trListeners: { [eventName: string]: (e: MouseEvent) => void } = {};
      // add events to row
      ROW_AND_TD_LISTENERS.forEach((eventName) => {
        const name = ['cell-click'].includes(eventName) ? eventName : `row-${eventName}`;
        trListeners[name] = (context) => {
          // props[`onRow${upperFirst(eventName)}`]?.(context);
          // Vue3 ignore this line
          emit(name, context);
        };
      });
      return trListeners;
    };

    return {
      t,
      global,
      tableFullRowClasses,
      tbodyClasses,
      tableBaseClass,
      isFixedLeftColumn,
      skipSpansMap,
      renderTNode,
      getTrListeners,
    };
  },

  render(h) {
    // eslint-disable-next-line
    const renderEmpty = (h: CreateElement, columns: TableBodyProps['columns']) => {
      return (
        <tr class={[this.tableBaseClass.emptyRow, { [this.tableFullRowClasses.base]: this.isWidthOverflow }]}>
          <td colspan={columns.length}>
            <div
              class={[this.tableBaseClass.empty, { [this.tableFullRowClasses.innerFullRow]: this.isWidthOverflow }]}
              style={this.isWidthOverflow ? { width: `${this.tableWidth}px` } : {}}
            >
              {this.renderTNode('empty') || this.t(this.global.empty)}
            </div>
          </td>
        </tr>
      );
    };

    const getFullRow = (
      // eslint-disable-next-line
      h: CreateElement,
      columnLength: number,
      type: 'first-full-row' | 'last-full-row',
    ) => {
      const tType = camelCase(type);
      const fullRowNode = this.renderTNode(tType);
      if (['', null, undefined, false].includes(fullRowNode)) return null;
      // const isFixedToLeft = this.isWidthOverflow && this.columns.find((col) => col.fixed === 'left');
      const classes = [this.tableFullRowClasses.base, this.tableFullRowClasses[tType]];
      /** innerFullRow 和 innerFullElement 同时存在，是为了保证 固定列时，当前行不随内容进行横向滚动 */
      return (
        <tr class={classes}>
          <td colspan={columnLength}>
            <div
              class={{ [this.tableFullRowClasses.innerFullRow]: this.isFixedToLeft }}
              style={this.isFixedToLeft ? { width: `${this.tableWidth}px` } : {}}
            >
              <div class={this.tableFullRowClasses.innerFullElement}>{fullRowNode}</div>
            </div>
          </td>
        </tr>
      );
    };

    const columnLength = this.columns.length;
    const dataLength = this.data.length;
    const trNodeList: JSX.Element[] = [];

    const properties = [
      'rowAndColFixedPosition',
      'scroll',
      'tableElm',
      'tableContentElm',
      'trs',
      'bufferSize',
      'isVirtual',
      'rowHeight',
      'scrollType',
    ];
    this.data?.forEach((row, rowIndex) => {
      const trProps: TrProps = {
        ...pick(this.$props, TABLE_PROPS),
        row,
        columns: this.columns,
        rowIndex,
        dataLength,
        skipSpansMap: this.skipSpansMap,
        ...pick(this.$props, properties),
      };
      if (this.onCellClick) {
        trProps.onCellClick = this.onCellClick;
      }
      // Vue3 do not need getTrListeners
      const on: { [keys: string]: Function } = this.getTrListeners();
      if (this.handleRowMounted) {
        on.onRowMounted = this.handleRowMounted;
      }

      // replace scopedSlots of slots in Vue3
      const trNode = (
        <TrElement
          scopedSlots={this.$scopedSlots}
          key={get(row, this.rowKey || 'id')}
          on={on}
          props={trProps}
        ></TrElement>
      );
      trNodeList.push(trNode);

      // 执行展开行渲染
      if (this.renderExpandedRow) {
        const p = {
          row,
          index: rowIndex,
          columns: this.columns,
          tableWidth: this.tableWidth,
          isWidthOverflow: this.isWidthOverflow,
        };
        const expandedContent = this.renderExpandedRow(h, p);
        expandedContent && trNodeList.push(expandedContent);
      }
    });

    const list = [
      getFullRow(h, columnLength, 'first-full-row'),
      trNodeList,
      getFullRow(h, columnLength, 'last-full-row'),
    ];
    const isEmpty = !this.data?.length && !this.loading && !this.firstFullRow && !this.lastFullRow;

    const translate = `translate(0, ${this.translateY}px)`;
    const posStyle = {
      transform: translate,
      '-ms-transform': translate,
      '-moz-transform': translate,
      '-webkit-transform': translate,
    };
    return (
      <tbody class={this.tbodyClasses} style={this.isVirtual && { ...posStyle }}>
        {isEmpty ? renderEmpty(h, this.columns) : list}
      </tbody>
    );
  },
});
