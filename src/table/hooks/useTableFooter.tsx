import { SetupContext, h } from '@vue/composition-api';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import { BaseTableCellParams, TableRowData, TdBaseTableProps } from '../type';
import { formatRowAttributes } from '../util/common';
import { ColumnStickyLeftAndRight, getColumnFixedStyles } from './useFixed';
import { TABLE_CLASS_FOOTER, TABLE_CLASS_FOOTER_FIXED } from './useStyle';

export interface RenderTableHeaderParams {
  // 是否固定表头
  isFixedHeader: boolean;
  // 固定列 left/right 具体值
  columnStickyLeftAndRight: ColumnStickyLeftAndRight;
}

export default function useTableFooter(props: TdBaseTableProps, context: SetupContext) {
  const renderTFootCell = (p: BaseTableCellParams<TableRowData>) => {
    const { col } = p;
    if (isFunction(col.foot)) {
      return col.foot(h, p);
    }
    if (isString(col.foot) && context.slots[col.foot]) {
      return context.slots[col.foot](p);
    }
    return col.foot;
  };

  const renderTableFooter = ({ isFixedHeader, columnStickyLeftAndRight }: RenderTableHeaderParams) => {
    if (!props.footData || !props.footData.length || !props.columns) return null;
    const theadClasses = [TABLE_CLASS_FOOTER, { [TABLE_CLASS_FOOTER_FIXED]: isFixedHeader }];
    const columnLength = props.columns.length;
    return (
      <tfoot ref="tfooterRef" class={theadClasses}>
        {props.footData.map((row, rowIndex) => {
          const trAttributes = formatRowAttributes(props.rowAttributes, { row, rowIndex, type: 'foot' });
          // 自定义行类名
          const customClasses = isFunction(props.rowClassName)
            ? props.rowClassName({ row, rowIndex, type: 'foot' })
            : props.rowClassName;
          return (
            <tr attrs={trAttributes} class={customClasses}>
              {props.columns.map((col, colIndex) => {
                const tdStyles = getColumnFixedStyles(col, colIndex, columnStickyLeftAndRight, columnLength);
                return (
                  <td class={tdStyles.classes} style={tdStyles.style}>
                    {renderTFootCell({
                      row,
                      rowIndex,
                      col,
                      colIndex,
                    })}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tfoot>
    );
  };

  return {
    renderTFootCell,
    renderTableFooter,
  };
}
