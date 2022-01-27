import { computed } from '@vue/composition-api';
import { prefix } from '../../config';
import { TdBaseTableProps } from '../type';
import { ClassName } from '../../common';
import { SIZE_CLASSNAMES } from '../../utils/classnames';

export const TABLE_CLASS = `${prefix}-table`;
export const TABLE_CLASS_CONTENT = `${prefix}-table__content`;
export const TABLE_CLASS_HEADER = `${prefix}-table__header`;
export const TABLE_CLASS_BODY = `${prefix}-table__body`;
export const TABLE_CLASS_FOOTER = `${prefix}-table__footer`;
export const TABLE_CLASS_BORDERED = `${prefix}-table--bordered`;
export const TABLE_CLASS_STRIPED = `${prefix}-table--striped`;
export const TABLE_CLASS_HOVER = `${prefix}-table--hoverable`;
export const TABLE_CLASS_LAYOUT = {
  auto: `${prefix}-table--layout-auto`,
  fixed: `${prefix}-table--layout-fixed`,
};
export const TABLE_CLASS_ALIGN = {
  top: `${prefix}-table-table--align-top`,
  bottom: `${prefix}-table-table--align-bottom`,
};

export const TABLE_TD_ELLIPSIS_CLASS = `${prefix}-table-td--ellipsis`;

export const TABEL_CLASSNAMES = {
  TABLE_CLASS,
  TABLE_CLASS_CONTENT,
  TABLE_CLASS_HEADER,
  TABLE_CLASS_BODY,
  TABLE_CLASS_FOOTER,
};

export default function useStyle(props: TdBaseTableProps) {
  const tableClasses = computed<ClassName>(() => [
    TABLE_CLASS,
    {
      [SIZE_CLASSNAMES[props.size]]: props.size,
      [TABLE_CLASS_BORDERED]: props.bordered,
      [TABLE_CLASS_STRIPED]: props.stripe,
      [TABLE_CLASS_HOVER]: props.hover,
      [TABLE_CLASS_ALIGN[props.verticalAlign]]: props.verticalAlign !== 'middle',
    },
  ]);

  return {
    tableClasses,
  };
}
