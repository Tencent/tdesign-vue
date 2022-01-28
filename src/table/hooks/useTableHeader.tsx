import { SetupContext, h } from '@vue/composition-api';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import { TdBaseTableProps } from '../type';
import { ColumnStickyLeftAndRight, getColumnFixedStyles } from './useFixed';
import { formatCSSUnit, TABLE_CLASS_HEADER, TABLE_CLASS_HEADER_FIXED } from './useStyle';

export interface RenderTableHeaderParams {
  // 是否固定表头
  isFixedHeader: boolean;
  // 固定列 left/right 具体值
  columnStickyLeftAndRight: ColumnStickyLeftAndRight;
}

export default function useTableHeader(props: TdBaseTableProps, context: SetupContext) {
  const renderTitle = (col: TdBaseTableProps['columns'][0], index: number) => {
    if (isFunction(col.title)) {
      return col.title(h, { col, colIndex: index });
    }
    if (isString(col.title) && context.slots[col.title]) {
      return context.slots[col.title];
    }
    if (isFunction(col.render)) {
      return col.render(h, {
        col,
        colIndex: index,
        type: 'title',
        row: {},
        rowIndex: -1,
      });
    }
    return col.title;
  };

  const renderColgroup = () => props.columns.map((col) => <col style={{ width: formatCSSUnit(col.width) }}></col>);

  const renderTableHeader = ({ isFixedHeader, columnStickyLeftAndRight }: RenderTableHeaderParams) => {
    const theadClasses = [TABLE_CLASS_HEADER, { [TABLE_CLASS_HEADER_FIXED]: isFixedHeader }];
    const columnLength = props.columns.length;
    return (
      <thead ref="theadRef" class={theadClasses}>
        <tr>
          {props.columns.map((item, index) => {
            const thStyles = getColumnFixedStyles(item, index, columnStickyLeftAndRight, columnLength);
            return (
              <th class={thStyles.classes} style={thStyles.style}>
                {renderTitle(item, index)}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  };

  return {
    renderTitle,
    renderTableHeader,
    renderColgroup,
  };
}
