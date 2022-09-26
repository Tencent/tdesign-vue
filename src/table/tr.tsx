import {
  defineComponent,
  PropType,
  SetupContext,
  h,
  ref,
  reactive,
  computed,
  onBeforeUnmount,
  onMounted,
  toRefs,
} from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import upperFirst from 'lodash/upperFirst';
import isString from 'lodash/isString';
import pick from 'lodash/pick';
import get from 'lodash/get';
import { CreateElement } from 'vue';
import { formatClassNames, formatRowAttributes, formatRowClassNames } from './utils';
import { getRowFixedStyles, getColumnFixedStyles } from './hooks/useFixed';
import { RowAndColFixedPosition } from './interface';
import useClassName from './hooks/useClassName';
import TEllipsis from './ellipsis';
import {
  BaseTableCellParams, TableRowData, RowspanColspan, TdPrimaryTableProps, TdBaseTableProps,
} from './type';
import baseTableProps from './base-table-props';
import { getCellKey, SkipSpansValue } from './hooks/useRowspanAndColspan';
import useLazyLoad from '../hooks/useLazyLoad';

export interface RenderTdExtra {
  rowAndColFixedPosition: RowAndColFixedPosition;
  columnLength: number;
  dataLength: number;
  cellSpans: RowspanColspan;
  cellEmptyContent: TdBaseTableProps['cellEmptyContent'];
}

export interface RenderEllipsisCellParams {
  cellNode: any;
}

export type TrCommonProps = Pick<TdPrimaryTableProps, TrPropsKeys>;

export const TABLE_PROPS = [
  'rowKey',
  'rowClassName',
  'columns',
  'fixedRows',
  'footData',
  'rowAttributes',
  'rowspanAndColspan',
  'scroll',
  'cellEmptyContent',
  'onCellClick',
  'onRowClick',
  'onRowDblclick',
  'onRowMouseover',
  'onRowMousedown',
  'onRowMouseenter',
  'onRowMouseleave',
  'onRowMouseup',
] as const;

export type TrPropsKeys = typeof TABLE_PROPS[number];

export interface TrProps extends TrCommonProps {
  row: TableRowData;
  rowIndex: number;
  dataLength: number;
  rowAndColFixedPosition?: RowAndColFixedPosition;
  skipSpansMap?: Map<string, SkipSpansValue>;
  tableElm?: HTMLDivElement;
  scrollType?: string;
  isVirtual?: boolean;
  rowHeight?: number;
  trs?: Map<number, object>;
  bufferSize?: number;
  tableContentElm?: HTMLDivElement;
  cellEmptyContent: TdBaseTableProps['cellEmptyContent'];
}

export const ROW_LISTENERS = ['click', 'dblclick', 'mouseover', 'mousedown', 'mouseenter', 'mouseleave', 'mouseup'];

export function renderCell(
  params: BaseTableCellParams<TableRowData>,
  slots: SetupContext['slots'],
  extra?: {
    cellEmptyContent?: TdBaseTableProps['cellEmptyContent'];
  },
) {
  const { col, row, rowIndex } = params;
  // support serial number column
  if (col.colKey === 'serial-number') {
    return rowIndex + 1;
  }
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
  const r = get(row, col.colKey);
  // 0 和 false 属于正常可用之，不能使用兜底逻辑 cellEmptyContent
  if (![undefined, '', null].includes(r)) return r;
  // cellEmptyContent 作为空数据兜底显示，用户可自定义
  if (extra?.cellEmptyContent) {
    return isFunction(extra.cellEmptyContent) ? extra.cellEmptyContent(h, params) : extra.cellEmptyContent;
  }
  if (slots.cellEmptyContent) return slots.cellEmptyContent(params);
  return r;
}

// 表格行组件
export default defineComponent({
  name: 'TR',

  props: {
    row: Object as PropType<TableRowData>,
    rowIndex: Number,
    dataLength: Number,
    rowAndColFixedPosition: Map as PropType<RowAndColFixedPosition>,
    // 合并单元格，是否跳过渲染
    skipSpansMap: Map as PropType<TrProps['skipSpansMap']>,
    ...pick(baseTableProps, TABLE_PROPS),
    scrollType: String,
    rowHeight: Number,
    trs: Map as PropType<TrProps['trs']>,
    bufferSize: Number,
    isVirtual: Boolean,
    // eslint-disabled-next-line
    tableElm: {},
    // eslint-disabled-next-line
    tableContentElm: {},
  },

  setup(props: TrProps, context: SetupContext) {
    const { tableContentElm } = toRefs(props);
    const trRef = ref(null);
    const {
      tdEllipsisClass,
      tableBaseClass,
      tableColFixedClasses,
      tableRowFixedClasses,
      tdAlignClasses,
      tableDraggableClasses,
    } = useClassName();

    const trStyles = computed(() => getRowFixedStyles(
      get(props.row, props.rowKey || 'id'),
      props.rowIndex,
      props.dataLength,
      props.fixedRows,
      props.rowAndColFixedPosition,
      tableRowFixedClasses,
    ));

    const trAttributes = computed(() => formatRowAttributes(props.rowAttributes, { row: props.row, rowIndex: props.rowIndex, type: 'body' }));

    const classes = computed(() => {
      const customClasses = formatRowClassNames(
        props.rowClassName,
        { row: props.row, rowIndex: props.rowIndex, type: 'body' },
        props.rowKey || 'id',
      );
      return [trStyles.value?.classes, customClasses];
    });

    const { hasLazyLoadHolder, tRowHeight } = useLazyLoad(
      tableContentElm,
      trRef,
      reactive({ ...props.scroll, rowIndex: props.rowIndex }),
    );
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

    onMounted(() => {
      const {
        trs, row: rowData, scrollType, isVirtual,
      } = props;
      if (scrollType === 'virtual') {
        if (isVirtual) {
          const { $index } = rowData;
          trs.set($index, trRef.value);
          context.emit('onRowMounted');
        }
      }
    });

    onBeforeUnmount(() => {
      if (props.isVirtual) {
        const { trs, row } = props;
        const { $index } = row;
        trs.delete($index);
      }
    });

    return {
      trRef,
      tableColFixedClasses,
      tableDraggableClasses,
      tSlots: context.slots,
      tdEllipsisClass,
      tableBaseClass,
      tdAlignClasses,
      trStyles,
      classes,
      trAttributes,
      tRowHeight,
      hasLazyLoadHolder,
      getTrListeners,
    };
  },

  methods: {
    renderEllipsisCell(
      h: CreateElement,
      cellParams: BaseTableCellParams<TableRowData>,
      params: RenderEllipsisCellParams,
    ) {
      const { cellNode } = params;
      const { col } = cellParams;
      const content = isFunction(col.ellipsis) ? col.ellipsis(h, cellParams) : undefined;
      return (
        <TEllipsis
          placement={'top'}
          attach={this.tableElm ? () => this.tableElm : undefined}
          tooltipContent={content && (() => content)}
          tooltipProps={typeof col.ellipsis === 'object' ? col.ellipsis : undefined}
        >
          {cellNode}
        </TEllipsis>
      );
    },

    renderTd(h: CreateElement, params: BaseTableCellParams<TableRowData>, extra: RenderTdExtra) {
      const { col, colIndex, rowIndex } = params;
      const { cellSpans, dataLength, rowAndColFixedPosition } = extra;
      const cellNode = renderCell(params, this.tSlots, { cellEmptyContent: extra.cellEmptyContent });
      const tdStyles = getColumnFixedStyles(col, colIndex, rowAndColFixedPosition, this.tableColFixedClasses);
      const customClasses = formatClassNames(col.className, { ...params, type: 'td' });
      const classes = [
        tdStyles.classes,
        customClasses,
        {
          [this.tdEllipsisClass]: col.ellipsis,
          [this.tableBaseClass.tdLastRow]: rowIndex + cellSpans.rowspan === dataLength,
          [this.tableBaseClass.tdFirstCol]: colIndex === 0 && this.rowspanAndColspan,
          [this.tdAlignClasses[col.align]]: col.align && col.align !== 'left',
          // 标记可拖拽列
          [this.tableDraggableClasses.handle]: col.colKey === 'drag',
        },
      ];
      const onClick = (e: MouseEvent) => {
        const p = { ...params, e };
        this.onCellClick?.(p);
        // Vue3 ignore this line
        this.$emit('cell-click', p);
      };
      return (
        <td class={classes} style={tdStyles.style} attrs={{ ...col.attrs, ...cellSpans }} onClick={onClick}>
          {col.ellipsis ? this.renderEllipsisCell(h, params, { cellNode }) : cellNode}
        </td>
      );
    },
  },

  render(h) {
    const {
      row, rowIndex, dataLength, rowAndColFixedPosition,
    } = this;
    const columnVNodeList = this.columns?.map((col, colIndex) => {
      const cellSpans: RowspanColspan = {};
      const params = {
        row,
        col,
        rowIndex,
        colIndex,
      };
      let spanState = null;
      if (this.skipSpansMap.size) {
        const cellKey = getCellKey(row, this.rowKey, col.colKey, colIndex);
        spanState = this.skipSpansMap.get(cellKey) || {};
        spanState?.rowspan > 1 && (cellSpans.rowspan = spanState.rowspan);
        spanState?.colspan > 1 && (cellSpans.colspan = spanState.colspan);
        if (spanState.skipped) return null;
      }
      return this.renderTd(h, params, {
        dataLength,
        rowAndColFixedPosition,
        columnLength: this.columns.length,
        cellSpans,
        cellEmptyContent: this.cellEmptyContent,
      });
    });
    const attrs = this.trAttributes || {};
    return (
      <tr
        ref="trRef"
        attrs={attrs}
        style={this.trStyles?.style}
        class={this.classes}
        on={this.getTrListeners(row, rowIndex)}
      >
        {this.hasLazyLoadHolder ? [<td style={{ height: `${this.tRowHeight}px`, border: 'none' }} />] : columnVNodeList}
      </tr>
    );
  },
});
