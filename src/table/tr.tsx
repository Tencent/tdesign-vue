import {
  defineComponent, PropType, SetupContext, h, computed,
} from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import upperFirst from 'lodash/upperFirst';
import isString from 'lodash/isString';
import pick from 'lodash/pick';
import get from 'lodash/get';
import { CreateElement } from 'vue';
import { formatRowAttributes, formatRowClassNames } from './util/common';
import { ColumnStickyLeftAndRight, getRowFixedStyles, getColumnFixedStyles } from './hooks/useFixed';
import useClassName from './hooks/useClassName';
import TEllipsis from './ellipsis';
import {
  BaseTableCellParams, TableRowData, RowspanColspan, TdPrimaryTableProps, PrimaryTableCellParams,
} from './type';
import baseTableProps from './base-table-props';

export interface RenderTdExtra {
  columnStickyLeftAndRight: ColumnStickyLeftAndRight;
  columnLength: number;
  dataLength: number;
  cellSpans: RowspanColspan;
}

export interface RenderEllipsisCellParams {
  columnLength: number;
  cellNode: any;
}

export type TrPropsKeys =
  | 'rowKey'
  | 'rowClassName'
  | 'columns'
  | 'fixedRows'
  | 'footData'
  | 'rowAttributes'
  | 'rowspanAndColspan'
  | 'onCellClick'
  | 'onRowClick'
  | 'onRowDbClick'
  | 'onRowHover'
  | 'onRowMousedown'
  | 'onRowMouseenter'
  | 'onRowMouseleave'
  | 'onRowMouseup';

export type TrCommonProps = Pick<TdPrimaryTableProps, TrPropsKeys>;

export const TABLE_PROPS: TrPropsKeys[] = [
  'rowKey',
  'rowClassName',
  'columns',
  'fixedRows',
  'footData',
  'rowAttributes',
  'rowspanAndColspan',
  'onCellClick',
  'onRowClick',
  'onRowDbClick',
  'onRowHover',
  'onRowMousedown',
  'onRowMouseenter',
  'onRowMouseleave',
  'onRowMouseup',
];

export interface TrProps extends TrCommonProps {
  row: TableRowData;
  rowIndex: number;
  dataLength: number;
  columnStickyLeftAndRight: ColumnStickyLeftAndRight;
  // 属性透传，引用传值，可内部改变
  skipSpansMap: Map<any, boolean>;
  onTrRowspanOrColspan?: (params: PrimaryTableCellParams<TableRowData>, cellSpans: RowspanColspan) => void;
}

export const ROW_LISTENERS = ['click', 'dbclick', 'hover', 'mousedown', 'mouseenter', 'mouseleave', 'mouseup'];

export function renderCell(params: BaseTableCellParams<TableRowData>, slots: SetupContext['slots']) {
  const { col, row } = params;
  if (isFunction(col.cell)) {
    return col.cell(h, params);
  }
  if (slots[col.colKey]) {
    return slots[col.colKey](params);
  }
  if (isString(col.cell) && slots[col.cell]) {
    return slots[col.cell](params);
  }
  if (isFunction(col.render)) {
    return col.render(h, { ...params, type: 'cell' });
  }
  return get(row, col.colKey);
}

// 表格行组件
export default defineComponent({
  props: {
    row: Object as PropType<TableRowData>,
    rowIndex: Number,
    dataLength: Number,
    columnStickyLeftAndRight: Object as PropType<ColumnStickyLeftAndRight>,
    // 合并单元格，是否跳过渲染
    skipSpansMap: Map as PropType<TrProps['skipSpansMap']>,
    // 扫描到 rowspan 或者 colspan 时触发
    onTrRowspanOrColspan: Function as PropType<TrProps['onTrRowspanOrColspan']>,
    ...pick(baseTableProps, TABLE_PROPS),
  },

  setup(props: TrProps, context: SetupContext) {
    const { tdEllipsisClass, tableBaseClass } = useClassName();
    const {
      row, rowIndex, dataLength, columnStickyLeftAndRight,
    } = props;
    // 固定列、固定行样式和类名
    const trStyles = computed(() => getRowFixedStyles(rowIndex, columnStickyLeftAndRight, dataLength, props.fixedRows, !!props.footData?.length));

    const trAttributes = computed(() => formatRowAttributes(props.rowAttributes, { row, rowIndex, type: 'body' }));

    const classes = computed(() => {
      const customClasses = formatRowClassNames(
        props.rowClassName,
        { row, rowIndex, type: 'body' },
        props.rowKey || 'id',
      );
      return [trStyles.value.classes, customClasses];
    });

    const getTrListeners = (row: TableRowData, rowIndex: number) => {
      const trListeners: { [eventName: string]: (e: MouseEvent) => void } = {};
      // add events to row
      ROW_LISTENERS.forEach((eventName) => {
        trListeners[eventName] = (e: MouseEvent) => {
          const p = { e, row, index: rowIndex };
          props[`onRow${upperFirst(eventName)}`]?.(p);
          // Vue3 ignore this line
          context.emit(`row-${eventName}`, p);
        };
      });
      return trListeners;
    };

    return {
      tSlots: context.slots,
      tdEllipsisClass,
      tableBaseClass,
      trStyles,
      classes,
      trAttributes,
      getTrListeners,
    };
  },

  methods: {
    renderEllipsisCell(
      h: CreateElement,
      cellParams: BaseTableCellParams<TableRowData>,
      params: RenderEllipsisCellParams,
    ) {
      const { columnLength, cellNode } = params;
      const { col, colIndex } = cellParams;
      // 最后一个元素，底部有对齐，避免信息右侧超出父元素
      const placement = colIndex === columnLength - 1 ? 'bottom-right' : 'bottom-left';
      const content = isFunction(col.ellipsis) ? col.ellipsis(h, cellParams) : undefined;

      return (
        <TEllipsis
          placement={placement}
          popupContent={content && (() => content)}
          popupProps={typeof col.ellipsis === 'object' ? col.ellipsis : undefined}
        >
          {cellNode}
        </TEllipsis>
      );
    },
    renderTd(h: CreateElement, params: BaseTableCellParams<TableRowData>, extra: RenderTdExtra) {
      const { col, colIndex, rowIndex } = params;
      const { columnLength, cellSpans, dataLength } = extra;
      const cellNode = renderCell(params, this.tSlots);
      const tdStyles = getColumnFixedStyles(col, colIndex, extra.columnStickyLeftAndRight, columnLength);
      const customClasses = isFunction(col.className) ? col.className({ ...params, type: 'td' }) : col.className;
      const classes = [
        tdStyles.classes,
        customClasses,
        {
          [this.tdEllipsisClass]: col.ellipsis,
          [this.tableBaseClass.tdLastRow]: rowIndex + cellSpans.rowspan === dataLength,
        },
      ];
      // const attrs: { [key: string]: any } = col.attrs ? col.attrs : {};
      const onClick = (e: MouseEvent) => {
        const p = { ...params, e };
        this.onCellClick?.(p);
        // Vue3 ignore this line
        this.$emit('cell-click', p);
      };
      return (
        <td class={classes} style={tdStyles.style} attrs={{ ...col.attrs, ...cellSpans }} onClick={onClick}>
          {col.ellipsis ? this.renderEllipsisCell(h, params, { cellNode, columnLength }) : cellNode}
        </td>
      );
    },
  },

  render(h) {
    const {
      row, rowIndex, dataLength, columnStickyLeftAndRight,
    } = this;
    return (
      <tr
        on={this.getTrListeners(row, rowIndex)}
        attrs={this.trAttributes}
        style={this.trStyles.style}
        class={this.classes}
      >
        {this.columns?.map((col, colIndex) => {
          const cellSpans: RowspanColspan = {};
          const params = {
            row,
            col,
            rowIndex,
            colIndex,
          };
          if (isFunction(this.rowspanAndColspan)) {
            const o = this.rowspanAndColspan(params);
            o?.rowspan > 1 && (cellSpans.rowspan = o.rowspan);
            o?.colspan > 1 && (cellSpans.colspan = o.colspan);
            this.onTrRowspanOrColspan?.(params, cellSpans);
          }
          const skipped = this.skipSpansMap?.get([rowIndex, colIndex].join());
          if (skipped) return null;
          return this.renderTd(h, params, {
            dataLength,
            columnStickyLeftAndRight,
            columnLength: this.columns.length,
            cellSpans,
          });
        })}
      </tr>
    );
  },
});
