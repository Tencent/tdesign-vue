import { prefix } from '../../config';

export default function useClassName() {
  // TODO: const { prefix } = useConfig();
  const classNames = {
    // 定义为固定变量大写，方便后期动态化时搜索替换
    TABLE_CLASS: `${prefix}-table`,
    TABLE_CLASS_EMPTY: `${prefix}-table__empty`,
    TABLE_CLASS_EMPTY_ROW: `${prefix}-table__empty-row`,
    TABLE_ROOT_CLASS_HEADER_FIXED: `${prefix}-table--header-fixed`,
    TABLE_ROOT_CLASS_COLUMN_FIXED: `${prefix}-table--column-fixed`,
    TABLE_CLASS_CONTENT: `${prefix}-table__content`,
    TABLE_CLASS_HEADER: `${prefix}-table__header`,
    TABLE_CLASS_HEADER_TH_BORDERED: `${prefix}-table__header-th--bordered`,
    TABLE_TD_LAST_ROW: `${prefix}-table__td-last-row`,
    TABLE_CLASS_BODY: `${prefix}-table__body`,
    TABLE_CLASS_FOOTER: `${prefix}-table__footer`,
    TABLE_CLASS_BORDERED: `${prefix}-table--bordered`,
    TABLE_CLASS_STRIPED: `${prefix}-table--striped`,
    TABLE_CLASS_HOVER: `${prefix}-table--hoverable`,
    TABLE_CLASS_HEADER_FIXED: `${prefix}-table__header--fixed`,
    TABLE_CLASS_FOOTER_FIXED: `${prefix}-table__footer--fixed`,
    // 多级表头类名
    TABLE_CLASS_HEADER_MULTIPLE: `${prefix}-table__header--multiple`,
    TABLE_ROOT_CLASS_MULTIPLE_HEADER: `${prefix}-table--multiple-header`,

    TAVLE_CLASS_VERTICAL_ALIGN: {
      top: `${prefix}-vertical-align-top`,
      middle: `${prefix}-vertical-align-middle`,
      bottom: `${prefix}-vertical-align-bottom`,
    },

    TABLE_CLASS_ROW_FIXED: {
      top: `${prefix}-table__row--fixed-top`,
      bottom: `${prefix}-table__row--fixed-bottom`,
      firstBottom: `${prefix}-table__row--fixed-bottom-first`,
      withoutBorderBottom: `${prefix}-table__row--without-border-bottom`,
    },

    TABLE_CLASS_COLUMN_FIXED: {
      left: `${prefix}-table__cell--fixed-left`,
      right: `${prefix}-table__cell--fixed-right`,
      lastLeft: `${prefix}-table__cell--fixed-left-last`,
      firstRight: `${prefix}-table__cell--fixed-right-first`,
      leftShadow: `${prefix}-table__content--scrollable-to-left`,
      rightShadow: `${prefix}-table__content--scrollable-to-right`,
    },

    TABLE_CLASS_LAYOUT: {
      auto: `${prefix}-table--layout-auto`,
      fixed: `${prefix}-table--layout-fixed`,
    },

    TABLE_CLASS_ALIGN: {
      top: `${prefix}-table--align-top`,
      middle: `${prefix}-table--align-middle`,
      bottom: `${prefix}-table--align-bottom`,
    },

    TABLE_TD_ELLIPSIS_CLASS: `${prefix}-table-td--ellipsis`,

    // 行通栏，一列铺满整行
    tableFullRowClasses: {
      base: `${prefix}-table__row--full`,
      firstRow: `${prefix}-table__row-first-full-row`,
      lastRow: `${prefix}-table__row-last-full-row`,
    },

    // 展开/收起行，全部类名
    tableExpandClasses: {
      iconBox: `${prefix}-table__expand-box`,
      iconCell: `${prefix}-table__expandable-icon-cell`,
      row: `${prefix}-table__expanded-row`,
      rowInner: `${prefix}-table__expanded-row-inner`,
      td: `${prefix}-table__row--full`,
    },

    // 排序功能，全部类名
    tableSortClasses: {
      sortable: `${prefix}-table__cell--sortable`,
      title: `${prefix}-table__cell--title`,
      trigger: `${prefix}-table__cell--sort-trigger`,
      doubleIcon: `${prefix}-table__double-icons`,
      sortIcon: `${prefix}-table__sort-icon`,
      iconDirection: {
        asc: `${prefix}-table-sort-asc`,
        desc: `${prefix}-table-sort-desc`,
      },
      iconActive: `${prefix}-table__sort-icon--active`,
      iconDefault: `${prefix}-icon-sort--default`,
    },

    // 行选中功能，全部类名
    tableSelectedClasses: {
      selected: `${prefix}-table__row--selected`,
      disabled: `${prefix}-table__row--disabled`,
    },

    // 过滤功能，全部类名
    tableFilterClasses: {
      filterable: `${prefix}-table__cell--filterable`,
      popup: `${prefix}-table__filter-pop`,
      icon: `${prefix}-table__filter-icon`,
      popupContent: `${prefix}-table__filter-pop-content`,
      result: `${prefix}-table__filter-result`,
      inner: `${prefix}-table__row-filter-inner`,
      bottomButtons: `${prefix}-table__filter--bottom-buttons`,
      contentInner: `${prefix}-table__filter-pop-content-inner`,
    },

    // 通用类名
    asyncLoadingClass: `${prefix}-table__async-loading`,
    isFocusClass: `${prefix}-is-focus`,
    isLoadingClass: `${prefix}-is-loading`,
    isLoadMoreClass: `${prefix}-is-load-more`,

    // 树形结构类名
    tableTreeClasses: {
      col: `${prefix}-table__tree-col`,
      icon: `${prefix}-table__tree-op-icon`,
    },
  };

  return {
    ...classNames,
    TABEL_CLASSNAMES: {
      TABLE_CLASS: classNames.TABLE_CLASS,
      TABLE_CLASS_CONTENT: classNames.TABLE_CLASS_CONTENT,
      TABLE_CLASS_HEADER: classNames.TABLE_CLASS_HEADER,
      TABLE_CLASS_BODY: classNames.TABLE_CLASS_BODY,
      TABLE_CLASS_FOOTER: classNames.TABLE_CLASS_FOOTER,
    },
  };
}
