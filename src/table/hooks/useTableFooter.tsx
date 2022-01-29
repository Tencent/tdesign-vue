import { SetupContext, h, computed } from '@vue/composition-api';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import { TdBaseTableProps } from '../type';
import { ColumnStickyLeftAndRight, getColumnFixedStyles } from './useFixed';
import { TABLE_CLASS_FOOTER, TABLE_CLASS_FOOTER_FIXED } from './useStyle';

export interface RenderTableHeaderParams {
  // 是否固定表头
  isFixedHeader: boolean;
  // 固定列 left/right 具体值
  columnStickyLeftAndRight: ColumnStickyLeftAndRight;
}

export default function useTableFooter(props: TdBaseTableProps, context: SetupContext) {
  const hasFooter = computed<boolean>(() => !!props.columns.find((col) => !!col.foot));

  const renderTFootCell = (col: TdBaseTableProps['columns'][0], index: number) => {
    const params = { col, colIndex: index };
    if (isFunction(col.foot)) {
      return col.foot(h, params);
    }
    if (isString(col.foot) && context.slots[col.foot]) {
      return context.slots[col.foot](params);
    }
    return col.foot;
  };

  const renderTableFooter = ({ isFixedHeader, columnStickyLeftAndRight }: RenderTableHeaderParams) => {
    if (!hasFooter.value) return null;
    const theadClasses = [TABLE_CLASS_FOOTER, { [TABLE_CLASS_FOOTER_FIXED]: isFixedHeader }];
    const columnLength = props.columns.length;
    return (
      <tfoot ref="tfooterRef" class={theadClasses}>
        <tr>
          {props.columns.map((item, index) => {
            const tdStyles = getColumnFixedStyles(item, index, columnStickyLeftAndRight, columnLength);
            return (
              <td class={tdStyles.classes} style={tdStyles.style}>
                {renderTFootCell(item, index)}
              </td>
            );
          })}
        </tr>
      </tfoot>
    );
  };

  return {
    renderTFootCell,
    renderTableFooter,
  };
}
