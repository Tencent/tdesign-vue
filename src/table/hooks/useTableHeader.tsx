import { SetupContext, h } from '@vue/composition-api';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import { TdBaseTableProps } from '../type';
import { TABLE_CLASS_HEADER } from './useStyle';

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
        col, colIndex: index, type: 'title', row: {}, rowIndex: -1,
      });
    }
    return col.title;
  };

  const tableHeader = (
    <thead class={TABLE_CLASS_HEADER}>
      <tr>
        {props.columns.map((item, index) => (
          <th>{renderTitle(item, index)}</th>
        ))}
      </tr>
    </thead>
  );

  return {
    renderTitle,
    tableHeader,
  };
}
