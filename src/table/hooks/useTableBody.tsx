import { SetupContext, h, computed } from '@vue/composition-api';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import upperFirst from 'lodash/upperFirst';
import { TABLE_CLASS_BODY, TABLE_TD_ELLIPSIS_CLASS, TAVLE_CLASS_VERTICAL_ALIGN } from './useStyle';
import { BaseTableCellParams, TableRowData } from '../type';
import { BaseTableProps } from '../interface';
import { ColumnStickyLeftAndRight, getColumnFixedStyles } from './useFixed';
// import isObject from 'lodash/isObject';
import TEllipsis from '../ellipsis';

export interface RenderEllipsisCellParams {
  columnLength: number;
  cellNode: any;
}

export interface RenderTableBodyParams {
  // 固定列 left/right 具体值
  columnStickyLeftAndRight: ColumnStickyLeftAndRight;
  showColumnShadow: { left: boolean; right: boolean };
}

export const ROW_LISTENERS = {
  click: 'onRowClick',
  dbclick: 'onRowDbClick',
  hover: 'onRowHover',
  mousedown: 'onRowMousedown',
  mouseenter: 'onRowMouseenter',
  mouseleave: 'onRowMouseleave',
  mouseup: 'onRowMouseup',
};

export default function useTableBody(props: BaseTableProps, context: SetupContext) {
  const tbodyClases = computed(() => [
    TABLE_CLASS_BODY,
    { [TAVLE_CLASS_VERTICAL_ALIGN[props.verticalAlign]]: props.verticalAlign },
  ]);

  const renderCell = (params: BaseTableCellParams<TableRowData>) => {
    const { col, row } = params;
    if (isFunction(col.cell)) {
      return col.cell(h, params);
    }
    if (context.slots[col.colKey]) {
      return context.slots[col.colKey](params);
    }
    if (isString(col.cell) && context.slots[col.cell]) {
      return context.slots[col.cell](params);
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

  const renderTableBody = ({ columnStickyLeftAndRight }: RenderTableBodyParams) => {
    const columnLength = props.columns.length;
    const trNodeList: JSX.Element[] = [];
    props.data?.forEach((row, rowIndex) => {
      const trListeners: { [eventName: string]: (e: MouseEvent) => void } = {};
      // add events to row
      Object.keys(ROW_LISTENERS).forEach((eventName) => {
        trListeners[eventName] = (e: MouseEvent) => {
          const p = { e, row, index: rowIndex };
          props[`onRow${upperFirst(eventName)}`]?.(p);
          props.onRowClick?.(p);
          // Vue3 ignore this line
          context.emit(`row-${eventName}`, p);
        };
      });
      const trNode = (
        <tr on={trListeners}>
          {props.columns.map((col, colIndex) => {
            const params = {
              row,
              rowIndex,
              col,
              colIndex,
            };
            const cellNode = renderCell(params);
            const tdStyles = getColumnFixedStyles(col, colIndex, columnStickyLeftAndRight, columnLength);
            const classes = [tdStyles.classes, col.className, { [TABLE_TD_ELLIPSIS_CLASS]: col.ellipsis }];
            const onClick = (e: MouseEvent) => {
              const p = { ...params, e };
              props.onCellClick?.(p);
              // Vue3 ignore this line
              context.emit('cell-click', p);
            };
            return (
              <td class={classes} style={tdStyles.style} {...col.attrs} onClick={onClick}>
                {col.ellipsis ? renderEllipsisCell(params, { cellNode, columnLength }) : cellNode}
              </td>
            );
          })}
        </tr>
      );
      trNodeList.push(trNode);
      // 执行展开行渲染
      if (props.renderExpandedRow) {
        trNodeList.push(props.renderExpandedRow({ row, index: rowIndex }));
      }
    });
    return <tbody class={tbodyClases.value}>{trNodeList}</tbody>;
  };

  return {
    renderCell,
    renderTableBody,
  };
}
