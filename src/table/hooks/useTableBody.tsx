import { SetupContext, h, computed } from '@vue/composition-api';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { formatRowAttributes, formatRowClassNames } from '../util/common';
import {
  TABLE_CLASS_BODY,
  TABLE_TD_ELLIPSIS_CLASS,
  TAVLE_CLASS_VERTICAL_ALIGN,
  TABLE_CLASS_EMPTY,
  TABLE_CLASS_EMPTY_ROW,
  TABLE_TD_LAST_ROW,
} from './useStyle';
import {
  BaseTableCellParams, RowspanColspan, TableRowData, TdBaseTableProps,
} from '../type';
import { BaseTableProps } from '../interface';
import { ColumnStickyLeftAndRight, getColumnFixedStyles, getRowFixedStyles } from './useFixed';
import { useTNodeJSX } from '../../hooks/tnode';
// import isObject from 'lodash/isObject';
import TEllipsis from '../ellipsis';
import useClassName from './useClassName';

export interface RenderEllipsisCellParams {
  columnLength: number;
  cellNode: any;
}

export interface RenderTableBodyParams {
  data: TdBaseTableProps['data'];
  columns: TdBaseTableProps['columns'];
  // 固定列 left/right 具体值
  columnStickyLeftAndRight: ColumnStickyLeftAndRight;
  showColumnShadow: { left: boolean; right: boolean };
}

export interface RenderTdExtra {
  columnStickyLeftAndRight: ColumnStickyLeftAndRight;
  columnLength: number;
  dataLength: number;
  cellSpans: RowspanColspan;
}

export const ROW_LISTENERS = ['click', 'dbclick', 'hover', 'mousedown', 'mouseenter', 'mouseleave', 'mouseup'];

export default function useTableBody(props: BaseTableProps, { emit, slots }: SetupContext) {
  const renderTNode = useTNodeJSX();

  const { tableFullRowClasses } = useClassName();

  const tbodyClases = computed(() => [
    TABLE_CLASS_BODY,
    { [TAVLE_CLASS_VERTICAL_ALIGN[props.verticalAlign]]: props.verticalAlign },
  ]);

  const renderCell = (params: BaseTableCellParams<TableRowData>) => {
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
  };

  const renderEllipsisCell = (cellParams: BaseTableCellParams<TableRowData>, params: RenderEllipsisCellParams) => {
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
  };

  const getFullRow = (
    columnLength: number,
    fullRow: TdBaseTableProps['firstFullRow'],
    type: 'first-full-row' | 'last-full-row',
  ) => {
    if (!fullRow) return null;
    const fullRowNode = renderTNode(camelCase(type));
    if (['', null, undefined, false].includes(fullRowNode)) return null;
    const classes = [tableFullRowClasses.base, tableFullRowClasses[type]];
    return (
      <tr class={classes}>
        <td colspan={columnLength}>{fullRowNode}</td>
      </tr>
    );
  };

  const renderEmpty = (columns: RenderTableBodyParams['columns']) => (
    <tr class={TABLE_CLASS_EMPTY_ROW}>
      <td colspan={columns.length}>
        <div class={TABLE_CLASS_EMPTY}>{renderTNode('empty') || '暂无数据'}</div>
      </td>
    </tr>
  );

  const setSkippedCell = (
    skipSpansMap: Map<any, boolean>,
    { rowIndex, colIndex }: BaseTableCellParams<TableRowData>,
    cellSpans: RowspanColspan,
  ) => {
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

  const renderTd = (params: BaseTableCellParams<TableRowData>, extra: RenderTdExtra) => {
    const { col, colIndex, rowIndex } = params;
    const { columnLength, cellSpans, dataLength } = extra;
    const cellNode = renderCell(params);
    const tdStyles = getColumnFixedStyles(col, colIndex, extra.columnStickyLeftAndRight, columnLength);
    const customClasses = isFunction(col.className) ? col.className({ ...params, type: 'td' }) : col.className;
    const classes = [
      tdStyles.classes,
      customClasses,
      {
        [TABLE_TD_ELLIPSIS_CLASS]: col.ellipsis,
        [TABLE_TD_LAST_ROW]: rowIndex + cellSpans.rowspan === dataLength,
      },
    ];
    // const attrs: { [key: string]: any } = col.attrs ? col.attrs : {};
    const onClick = (e: MouseEvent) => {
      const p = { ...params, e };
      props.onCellClick?.(p);
      // Vue3 ignore this line
      emit('cell-click', p);
    };
    return (
      <td class={classes} style={tdStyles.style} attrs={{ ...col.attrs, ...cellSpans }} onClick={onClick}>
        {col.ellipsis ? renderEllipsisCell(params, { cellNode, columnLength }) : cellNode}
      </td>
    );
  };

  const getTrListeners = (row: TableRowData, rowIndex: number) => {
    const trListeners: { [eventName: string]: (e: MouseEvent) => void } = {};
    // add events to row
    ROW_LISTENERS.forEach((eventName) => {
      trListeners[eventName] = (e: MouseEvent) => {
        const p = { e, row, index: rowIndex };
        props[`onRow${upperFirst(eventName)}`]?.(p);
        // Vue3 ignore this line
        emit(`row-${eventName}`, p);
      };
    });
    return trListeners;
  };

  const renderTableBody = (p: RenderTableBodyParams) => {
    const { columnStickyLeftAndRight, data, columns } = p;
    const columnLength = columns.length;
    const trNodeList: JSX.Element[] = [];
    // 受合并单元格影响，部分单元格不显示
    const skipSpansMap = new Map<any, boolean>();
    const dataLength = data.length;
    data?.forEach((row, rowIndex) => {
      const trStyles = getRowFixedStyles(
        rowIndex,
        columnStickyLeftAndRight,
        data.length,
        props.fixedRows,
        !!props.footData?.length,
      );
      const trAttributes = formatRowAttributes(props.rowAttributes, { row, rowIndex, type: 'body' });
      const customClasses = formatRowClassNames(props.rowClassName, { row, rowIndex, type: 'body' }, props.rowKey);
      const classes = [trStyles.classes, customClasses];
      const trNode = (
        <tr on={getTrListeners(row, rowIndex)} attrs={trAttributes} style={trStyles.style} class={classes}>
          {columns.map((col, colIndex) => {
            const cellSpans: RowspanColspan = {};
            const params = {
              row,
              col,
              rowIndex,
              colIndex,
            };
            if (isFunction(props.rowspanAndColspan)) {
              const o = props.rowspanAndColspan(params);
              o?.rowspan > 1 && (cellSpans.rowspan = o.rowspan);
              o?.colspan > 1 && (cellSpans.colspan = o.colspan);
            }
            const skipped = skipSpansMap.get([rowIndex, colIndex].join());
            if (skipped) return null;
            setSkippedCell(skipSpansMap, params, cellSpans);
            return renderTd(params, {
              dataLength,
              columnStickyLeftAndRight,
              columnLength,
              cellSpans,
            });
          })}
        </tr>
      );
      trNodeList.push(trNode);
      // 执行展开行渲染
      if (props.renderExpandedRow) {
        trNodeList.push(props.renderExpandedRow(h, { row, index: rowIndex, columns }));
      }
    });

    const list = [
      getFullRow(columnLength, props.firstFullRow, 'first-full-row'),
      trNodeList,
      getFullRow(columnLength, props.lastFullRow, 'last-full-row'),
    ];
    const isEmpty = !data?.length && !props.loading;
    return <tbody class={tbodyClases.value}>{isEmpty ? renderEmpty(columns) : list}</tbody>;
  };

  return {
    renderCell,
    renderTableBody,
  };
}
