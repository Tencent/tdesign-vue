import {
  defineComponent, computed, PropType, SetupContext,
} from '@vue/composition-api';
import { CreateElement } from 'vue';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import pick from 'lodash/pick';
import TrElement, { TrProps, ROW_LISTENERS, TABLE_PROPS } from './tr';
import { TableConfig, useConfig } from '../config-provider/useConfig';
import { RowspanColspan, TableRowData, BaseTableCellParams } from './type';
import { BaseTableProps } from './interface';
import { RowAndColFixedPosition } from './hooks/useFixed';
import { useTNodeJSX } from '../hooks/tnode';
import useClassName from './hooks/useClassName';
import baseTableProps from './base-table-props';

export const ROW_AND_TD_LISTENERS = ROW_LISTENERS.concat('cell-click');
export interface TableBodyProps extends BaseTableProps {
  // 固定列 left/right 具体值
  rowAndColFixedPosition: RowAndColFixedPosition;
  showColumnShadow: { left: boolean; right: boolean };
  tableElm: HTMLDivElement;

  // 以下内容为虚拟滚动所需参数
  translateY: number;
  scrollType: string;
  isVirtual: boolean;
  rowHeight: number;
  trs: Map<number, object>;
  bufferSize: number;
  handleRowMounted: Function;
}

// table 到 body 的相同属性
export const extendTableProps = [
  'rowKey',
  'loading',
  'empty',
  'firstFullRow',
  'lastFullRow',
  'onCellClick',
  'onPageChange',
  'onRowClick',
  'onRowDbClick',
  'onRowHover',
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
    tableElm: HTMLDivElement as PropType<TableBodyProps['tableElm']>,
    // 以下内容为虚拟滚动所需参数
    translateY: Number,
    scrollType: String,
    isVirtual: Boolean,
    rowHeight: Number,
    trs: Map as PropType<TableBodyProps['trs']>,
    bufferSize: Number,
    handleRowMounted: Function as PropType<TableBodyProps['handleRowMounted']>,
    renderExpandedRow: Function as PropType<TableBodyProps['renderExpandedRow']>,
    firstFullRow: Function as PropType<TableBodyProps['renderExpandedRow']>,
    lastFullRow: Function as PropType<TableBodyProps['renderExpandedRow']>,
    ...pick(baseTableProps, extendTableProps),
  },

  // eslint-disable-next-line
  setup(props: TableBodyProps, { emit }: SetupContext) {
    const renderTNode = useTNodeJSX();
    const { t, global } = useConfig<TableConfig>('table');
    const { tableFullRowClasses, tableBaseClass } = useClassName();

    const tbodyClases = computed(() => [tableBaseClass.body]);

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
      renderTNode,
      tableFullRowClasses,
      tbodyClases,
      tableBaseClass,
      getTrListeners,
    };
  },

  render(h) {
    // eslint-disable-next-line
    const renderEmpty = (h: CreateElement, columns: TableBodyProps['columns']) => {
      return (
        <tr class={this.tableBaseClass.emptyRow}>
          <td colspan={columns.length}>
            <div class={this.tableBaseClass.empty}>{this.renderTNode('empty') || this.t(this.global.empty)}</div>
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
      const classes = [this.tableFullRowClasses.base, this.tableFullRowClasses[tType]];
      return (
        <tr class={classes}>
          <td colspan={columnLength}>{fullRowNode}</td>
        </tr>
      );
    };

    // 受合并单元格影响，部分单元格不显示
    let skipSpansMap = new Map<any, boolean>();

    const onTrRowspanOrColspan = (params: BaseTableCellParams<TableRowData>, cellSpans: RowspanColspan) => {
      const { rowIndex, colIndex } = params;
      if (!cellSpans.rowspan && !cellSpans.colspan) return;
      const maxRowIndex = rowIndex + (cellSpans.rowspan || 1);
      const maxColIndex = colIndex + (cellSpans.colspan || 1);
      for (let i = rowIndex; i < maxRowIndex; i++) {
        for (let j = colIndex; j < maxColIndex; j++) {
          if (i !== rowIndex || j !== colIndex) {
            skipSpansMap.set([i, j].join(), true);
          }
        }
      }
    };

    const columnLength = this.columns.length;
    const dataLength = this.data.length;
    const trNodeList: JSX.Element[] = [];
    // 每次渲染清空合并单元格信息
    skipSpansMap = new Map<any, boolean>();

    this.data?.forEach((row, rowIndex) => {
      const trProps: TrProps = {
        ...pick(this.$props, TABLE_PROPS),
        row,
        columns: this.columns,
        rowIndex,
        dataLength,
        rowAndColFixedPosition: this.rowAndColFixedPosition,
        skipSpansMap,
        // 遍历的同时，计算后面的节点，是否会因为合并单元格跳过渲染
        onTrRowspanOrColspan,
        isVirtual: this.isVirtual,
        scrollType: this.scrollType,
        rowHeight: this.rowHeight,
        trs: this.trs,
        bufferSize: this.bufferSize,
        tableElm: this.tableElm,
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
        <TrElement scopedSlots={this.$slots} key={get(row, this.rowKey || 'id')} on={on} props={trProps}></TrElement>
      );
      trNodeList.push(trNode);

      // 执行展开行渲染
      if (this.renderExpandedRow) {
        const expandedContent = this.renderExpandedRow(h, { row, index: rowIndex, columns: this.columns });
        expandedContent && trNodeList.push(expandedContent);
      }
    });

    const list = [
      getFullRow(h, columnLength, 'first-full-row'),
      trNodeList,
      getFullRow(h, columnLength, 'last-full-row'),
    ];
    const isEmpty = !this.data?.length && !this.loading;

    const translate = `translate(0, ${this.translateY}px)`;
    const posStyle = {
      transform: translate,
      '-ms-transform': translate,
      '-moz-transform': translate,
      '-webkit-transform': translate,
    };

    return (
      <tbody class={this.tbodyClases} style={this.isVirtual && { ...posStyle }}>
        {isEmpty ? renderEmpty(h, this.columns) : list}
      </tbody>
    );
  },
});
