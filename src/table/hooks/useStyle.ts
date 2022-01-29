import { computed } from '@vue/composition-api';
import { prefix } from '../../config';
import { TdBaseTableProps } from '../type';
import { ClassName, Styles } from '../../common';
import { SIZE_CLASSNAMES } from '../../utils/classnames';

export const TABLE_CLASS = `${prefix}-table`;
export const TABLE_ROOT_CLASS_HEADER_FIXED = `${prefix}-table--header-fixed`;
export const TABLE_ROOT_CLASS_COLUMN_FIXED = `${prefix}-table--column-fixed`;
export const TABLE_CLASS_CONTENT = `${prefix}-table__content`;
export const TABLE_CLASS_HEADER = `${prefix}-table__header`;
export const TABLE_CLASS_BODY = `${prefix}-table__body`;
export const TABLE_CLASS_FOOTER = `${prefix}-table__footer`;
export const TABLE_CLASS_BORDERED = `${prefix}-table--bordered`;
export const TABLE_CLASS_STRIPED = `${prefix}-table--striped`;
export const TABLE_CLASS_HOVER = `${prefix}-table--hoverable`;
export const TABLE_CLASS_HEADER_FIXED = `${prefix}-table__header--fixed`;
export const TABLE_CLASS_FOOTER_FIXED = `${prefix}-table__footer--fixed`;

export const TAVLE_CLASS_VERTICAL_ALIGN = {
  top: `${prefix}-vertical-align-top`,
  middle: `${prefix}-vertical-align-middle`,
  bottom: `${prefix}-vertical-align-bottom`,
};

export const TABLE_CLASS_ROW_FIXED = {
  top: `${prefix}-table__row--fixed-top`,
  bottom: `${prefix}-table__row--fixed-bottom`,
  firstBottom: `${prefix}-table__row--fixed-bottom-first`,
  withoutBorderBottom: `${prefix}-table__row--without-border-bottom`,
};

export const TABLE_CLASS_COLUMN_FIXED = {
  left: `${prefix}-table__cell--fixed-left`,
  right: `${prefix}-table__cell--fixed-right`,
  lastLeft: `${prefix}-table__cell--fixed-left-last`,
  firstRight: `${prefix}-table__cell--fixed-right-first`,
  leftShadow: `${prefix}-table__content--scrollable-to-left`,
  rightShadow: `${prefix}-table__content--scrollable-to-right`,
};

export const TABLE_CLASS_LAYOUT = {
  auto: `${prefix}-table--layout-auto`,
  fixed: `${prefix}-table--layout-fixed`,
};

export const TABLE_CLASS_ALIGN = {
  top: `${prefix}-table--align-top`,
  middle: `${prefix}-table--align-middle`,
  bottom: `${prefix}-table--align-bottom`,
};

export const TABLE_TD_ELLIPSIS_CLASS = `${prefix}-table-td--ellipsis`;

export const TABEL_CLASSNAMES = {
  TABLE_CLASS,
  TABLE_CLASS_CONTENT,
  TABLE_CLASS_HEADER,
  TABLE_CLASS_BODY,
  TABLE_CLASS_FOOTER,
};

export function formatCSSUnit(unit: string | number) {
  if (!unit) return unit;
  return isNaN(Number(unit)) ? unit : `${unit}px`;
}

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

  const tableContentStyles = computed<Styles>(() => ({
    height: formatCSSUnit(props.height),
    maxHeight: formatCSSUnit(props.maxHeight),
  }));

  const tableElementStyles = computed<Styles>(() => ({
    width: formatCSSUnit(props.tableContentWidth),
  }));

  return {
    tableClasses,
    tableElementStyles,
    tableContentStyles,
  };
}
