import { useConfig } from '../../config-provider/useConfig';

export default function useClassName() {
  const { classPrefix: prefix } = useConfig();
  const classNames = {
    tableBaseClass: {
      table: `${prefix}-table`,
      body: `${prefix}-table__body`,
      content: `${prefix}-table__content`,
      tdLastRow: `${prefix}-table__td-last-row`,
      bordered: `${prefix}-table--bordered`,
      striped: `${prefix}-table--striped`,
      hover: `${prefix}-table--hoverable`,
      empty: `${prefix}-table__empty`,
      emptyRow: `${prefix}-table__empty-row`,
      headerFixed: `${prefix}-table--header-fixed`,
      columnFixed: `${prefix}-table--column-fixed`,
      multipleHeader: `${prefix}-table--multiple-header`,
      affixedHeader: `${prefix}-table--affixed-header`,
      affixedHeaderElm: `${prefix}-table__affixed-header-elm`,
    },

    tableHeaderClasses: {
      header: `${prefix}-table__header`,
      thBordered: `${prefix}-table__header-th--bordered`,
      fixed: `${prefix}-table__header--fixed`,
      multipleHeader: `${prefix}-table__header--multiple`,
    },

    tableFooterClasses: {
      footer: `${prefix}-table__footer`,
      fixed: `${prefix}-table__footer--fixed`,
    },
    // 多级表头类名

    tableAlignClasses: {
      top: `${prefix}-vertical-align-top`,
      middle: `${prefix}-vertical-align-middle`,
      bottom: `${prefix}-vertical-align-bottom`,
    },

    tableRowFixedClasses: {
      top: `${prefix}-table__row--fixed-top`,
      bottom: `${prefix}-table__row--fixed-bottom`,
      firstBottom: `${prefix}-table__row--fixed-bottom-first`,
      withoutBorderBottom: `${prefix}-table__row--without-border-bottom`,
    },

    tableColFixedClasses: {
      left: `${prefix}-table__cell--fixed-left`,
      right: `${prefix}-table__cell--fixed-right`,
      lastLeft: `${prefix}-table__cell--fixed-left-last`,
      firstRight: `${prefix}-table__cell--fixed-right-first`,
      leftShadow: `${prefix}-table__content--scrollable-to-left`,
      rightShadow: `${prefix}-table__content--scrollable-to-right`,
    },

    tableLayoutClasses: {
      auto: `${prefix}-table--layout-auto`,
      fixed: `${prefix}-table--layout-fixed`,
    },

    tdEllipsisClass: `${prefix}-table-td--ellipsis`,

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
      iconWrap: `${prefix}-table__filter-icon-wrap`,
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

    virtualScrollClasses: {
      cursor: `${prefix}-table__virtual-scroll-cursor`,
      header: `${prefix}-table__virtual-scroll-header`,
    },
  };

  return classNames;
}
