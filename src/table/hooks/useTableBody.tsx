import { SetupContext, h } from '@vue/composition-api';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import { TABLE_CLASS_BODY, TABLE_TD_ELLIPSIS_CLASS } from './useStyle';
import { TdBaseTableProps, BaseTableCellParams, TableRowData } from '../type';
// import isObject from 'lodash/isObject';
import TEllipsis from '../ellipsis';

export interface RenderEllipsisCellParams {
  columnLength: number;
  cellNode: any;
}

export default function useTableBody(props: TdBaseTableProps, context: SetupContext) {
  const renderCell = (params: BaseTableCellParams<TableRowData>) => {
    const { col, row } = params;
    if (isFunction(col.cell)) {
      return col.cell(h, params);
    }
    if (isString(col.cell) && context.slots[col.cell]) {
      return context.slots[col.cell];
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

  const tableBody = (
    <tbody class={TABLE_CLASS_BODY}>
      {props.data?.map((row, rowIndex) => {
        const columnLength = props.columns.length;
        return (
          <tr>
            {props.columns.map((col, colIndex) => {
              const cellNode = renderCell({
                row, col, rowIndex, colIndex,
              });
              const classes = { [TABLE_TD_ELLIPSIS_CLASS]: col.ellipsis };
              return (
                <td class={classes}>
                  {col.ellipsis
                    ? renderEllipsisCell({
                      row, rowIndex, col, colIndex,
                    }, { cellNode, columnLength })
                    : cellNode}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );

  return {
    tableBody,
  };
}
