import { computed, toRefs } from '@vue/composition-api';
import { prefix } from '../../config';
import { TdBaseTableProps } from '../type';
import { ClassName, Styles } from '../../common';
import { SIZE_CLASSNAMES } from '../../utils/classnames';

// 定义为固定变量大写，方便后期动态化时搜索替换
export const TABLE_CLASS = `${prefix}-table`;
export const TABLE_CLASS_EMPTY = `${prefix}-table__empty`;
export const TABLE_CLASS_EMPTY_ROW = `${prefix}-table__empty-row`;
export const TABLE_ROOT_CLASS_HEADER_FIXED = `${prefix}-table--header-fixed`;
export const TABLE_ROOT_CLASS_COLUMN_FIXED = `${prefix}-table--column-fixed`;
export const TABLE_CLASS_CONTENT = `${prefix}-table__content`;
export const TABLE_CLASS_HEADER = `${prefix}-table__header`;
export const TABLE_CLASS_HEADER_TH_BORDERED = `${prefix}-table__header-th--bordered`;
export const TABLE_TD_LAST_ROW = `${prefix}-table__td-last-row`;
export const TABLE_CLASS_BODY = `${prefix}-table__body`;
export const TABLE_CLASS_FOOTER = `${prefix}-table__footer`;
export const TABLE_CLASS_BORDERED = `${prefix}-table--bordered`;
export const TABLE_CLASS_STRIPED = `${prefix}-table--striped`;
export const TABLE_CLASS_HOVER = `${prefix}-table--hoverable`;
export const TABLE_CLASS_HEADER_FIXED = `${prefix}-table__header--fixed`;
export const TABLE_CLASS_FOOTER_FIXED = `${prefix}-table__footer--fixed`;
// 多级表头类名
export const TABLE_CLASS_HEADER_MULTIPLE = `${prefix}-table__header--multiple`;
export const TABLE_ROOT_CLASS_MULTIPLE_HEADER = `${prefix}-table--multiple-header`;

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
  const {
    size, bordered, stripe, hover, verticalAlign, height, maxHeight, tableContentWidth,
  } = toRefs(props);
  const tableClasses = computed<ClassName>(() => [
    TABLE_CLASS,
    {
      [SIZE_CLASSNAMES[size.value]]: size.value,
      [TABLE_CLASS_BORDERED]: bordered.value,
      [TABLE_CLASS_STRIPED]: stripe.value,
      [TABLE_CLASS_HOVER]: hover.value,
      [TABLE_CLASS_ALIGN[verticalAlign.value]]: verticalAlign.value !== 'middle',
    },
  ]);

  const tableContentStyles = computed<Styles>(() => ({
    height: formatCSSUnit(height.value),
    maxHeight: formatCSSUnit(maxHeight.value),
  }));

  const tableElementStyles = computed<Styles>(() => ({
    width: formatCSSUnit(tableContentWidth.value),
  }));

  return {
    tableClasses,
    tableElementStyles,
    tableContentStyles,
  };
}
