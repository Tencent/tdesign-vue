import {
  computed, defineComponent, toRefs, h, onMounted, ref, watch,
} from '@vue/composition-api';
import get from 'lodash/get';
import omit from 'lodash/omit';
import baseTableProps from './base-table-props';
import primaryTableProps from './primary-table-props';
import BaseTable, { BASE_TABLE_ALL_EVENTS, TableListeners } from './base-table';
import { useTNodeJSX } from '../hooks/tnode';
import useColumnController from './hooks/useColumnController';
import useRowExpand from './hooks/useRowExpand';
import useTableHeader, { renderTitle } from './hooks/useTableHeader';
import useRowSelect from './hooks/useRowSelect';
import { TdPrimaryTableProps, PrimaryTableCol, TableRowData } from './type';
import useSorter from './hooks/useSorter';
import useFilter from './hooks/useFilter';
import useDragSort from './hooks/useDragSort';
import useAsyncLoading from './hooks/useAsyncLoading';
import { PageInfo } from '../pagination';
import useClassName from './hooks/useClassName';
import useEditableCell from './hooks/useEditableCell';
import useEditableRow from './hooks/useEditableRow';
import { EditableCellProps } from './editable-cell';

export { BASE_TABLE_ALL_EVENTS } from './base-table';

const OMIT_PROPS = [
  'hideSortTips',
  'dragSort',
  'defaultExpandedRowKeys',
  'defaultSelectedRowKeys',
  'columnController',
  'filterRow',
  'sortOnRowDraggable',
  'expandOnRowClick',
  'multipleSort',
  'expandIcon',
  'onChange',
  'onAsyncLoadingClick',
  'onChange',
  'onColumnChange',
  'onColumnControllerVisibleChange',
  'onDataChange',
  'onDisplayColumnsChange',
  'onDragSort',
  'onExpandChange',
  'onFilterChange',
  'onSelectChange',
  'onSortChange',
];

export default defineComponent({
  name: 'TPrimaryTable',

  props: {
    ...baseTableProps,
    ...primaryTableProps,
  },

  setup(props: TdPrimaryTableProps, context) {
    const renderTNode = useTNodeJSX();
    const { columns } = toRefs(props);
    const primaryTableRef = ref(null);
    const { tableDraggableClasses, tableBaseClass, tableSelectedClasses } = useClassName();
    // 自定义列配置功能
    const { tDisplayColumns, renderColumnController } = useColumnController(props, context);
    // 展开/收起行功能
    const {
      showExpandedRow, showExpandIconColumn, getExpandColumn, renderExpandedRow, onInnerExpandRowClick,
    } = useRowExpand(props, context);
    // 排序功能
    const { renderSortIcon } = useSorter(props, context);
    // 行选中功能
    const { formatToRowSelectColumn, selectedRowClassNames } = useRowSelect(props, tableSelectedClasses);
    // 过滤功能
    const {
      hasEmptyCondition,
      isTableOverflowHidden,
      renderFilterIcon,
      renderFirstFilterRow,
      setFilterPrimaryTableRef,
    } = useFilter(props, context);

    // 拖拽排序功能
    const {
      isRowHandlerDraggable, isRowDraggable, isColDraggable, setDragSortPrimaryTableRef, setDragSortColumns,
    } = useDragSort(props, context);

    const { renderTitleWidthIcon } = useTableHeader(props);
    const { renderAsyncLoading } = useAsyncLoading(props, context);

    const { renderEditableCell } = useEditableCell(props, context);
    const {
      errorListMap,
      editableKeysMap,
      validateRowData,
      onRuleChange,
      clearValidateData,
      onPrimaryTableRowValidate,
      onPrimaryTableRowEdit,
    } = useEditableRow(props, context);

    const primaryTableClasses = computed(() => ({
      [tableDraggableClasses.colDraggable]: isColDraggable.value,
      [tableDraggableClasses.rowHandlerDraggable]: isRowHandlerDraggable.value,
      [tableDraggableClasses.rowDraggable]: isRowDraggable.value,
      [tableBaseClass.overflowVisible]: isTableOverflowHidden.value === false,
      [tableBaseClass.tableRowEdit]: props.editableRowKeys,
    }));

    // 如果想给 TR 添加类名，请在这里补充，不要透传更多额外 Props 到 BaseTable
    const tRowClassNames = computed(() => {
      const tClassNames = [props.rowClassName, selectedRowClassNames.value];
      return tClassNames.filter((v) => v);
    });

    // 如果想给 TR 添加属性，请在这里补充，不要透传更多额外 Props 到 BaseTable
    const tRowAttributes = computed(() => {
      const tAttributes = [props.rowAttributes];
      if (isRowHandlerDraggable.value || isRowDraggable.value) {
        tAttributes.push(({ row }) => ({ 'data-id': get(row, props.rowKey || 'id') }));
      }
      return tAttributes.filter((v) => v);
    });

    // 多个 Hook 共用 primaryTableRef
    onMounted(() => {
      setFilterPrimaryTableRef(primaryTableRef.value);
      setDragSortPrimaryTableRef(primaryTableRef.value);
      setDragSortColumns(props.columns);
    });

    watch(primaryTableRef, () => {
      setFilterPrimaryTableRef(primaryTableRef.value);
      setDragSortPrimaryTableRef(primaryTableRef.value);
    });

    // 1. 影响列数量的因素有：自定义列配置、展开/收起行、多级表头；2. 影响表头内容的因素有：排序图标、筛选图标
    const getColumns = (columns: PrimaryTableCol<TableRowData>[]) => {
      const arr: PrimaryTableCol<TableRowData>[] = [];
      for (let i = 0, len = columns.length; i < len; i++) {
        let item = { ...columns[i] };
        // 自定义列显示控制
        const isDisplayColumn = item.children?.length || tDisplayColumns.value?.includes(item.colKey);
        if (!isDisplayColumn && props.columnController) continue;
        item = formatToRowSelectColumn(item);
        // 添加排序图标和过滤图标
        if (item.sorter || item.filter) {
          const titleContent = renderTitle(h, context.slots, item, i);
          const { ellipsisTitle } = item;
          item.title = (h, p) => {
            const sortIcon = item.sorter ? renderSortIcon(h, p) : null;
            const filterIcon = item.filter ? renderFilterIcon(h, p) : null;
            // @ts-ignore
            const attach = primaryTableRef.value?.$refs?.tableContentRef;
            return renderTitleWidthIcon(
              h,
              [titleContent, sortIcon, filterIcon],
              p.col,
              p.colIndex,
              ellipsisTitle,
              attach,
            );
          };
          item.ellipsisTitle = false;
        }
        // 如果是单元格可编辑状态
        if (item.edit?.component) {
          const oldCell = item.cell;
          item.cell = (h, p) => {
            const cellProps: EditableCellProps = {
              ...p,
              oldCell,
              tableBaseClass,
              onChange: onPrimaryTableRowEdit,
              onValidate: onPrimaryTableRowValidate,
              onRuleChange,
            };
            if (props.editableRowKeys) {
              const rowValue = get(p.row, props.rowKey || 'id');
              cellProps.editable = editableKeysMap.value[rowValue] || false;
              const key = [rowValue, p.col.colKey].join();
              const errorList = errorListMap.value?.[key];
              errorList && (cellProps.errors = errorList);
            }
            return renderEditableCell(h, cellProps);
          };
        }
        if (item.children?.length) {
          item.children = getColumns(item.children);
        }
        // 多级表头和自定义列配置特殊逻辑：要么子节点不存在，要么子节点长度大于 1，方便做自定义列配置
        if (!item.children || item.children?.length) {
          arr.push(item);
        }
      }
      return arr;
    };

    const tColumns = computed(() => {
      const cols = getColumns(columns.value);
      if (showExpandIconColumn.value) {
        cols.unshift(getExpandColumn(h));
      }
      return cols;
    });

    const onInnerPageChange = (pageInfo: PageInfo, newData: Array<TableRowData>) => {
      props.onPageChange?.(pageInfo, newData);
      // Vue3 ignore next line
      context.emit('page-change', pageInfo, newData);

      const changeParams: Parameters<TdPrimaryTableProps['onChange']> = [
        { pagination: pageInfo },
        { trigger: 'pagination', currentData: newData },
      ];
      props.onChange?.(...changeParams);
      // Vue3 ignore next line
      context.emit('change', ...changeParams);
    };
    return {
      tColumns,
      showExpandedRow,
      tRowClassNames,
      hasEmptyCondition,
      primaryTableRef,
      tRowAttributes,
      primaryTableClasses,
      validateRowData,
      clearValidateData,
      renderTNode,
      renderColumnController,
      renderExpandedRow,
      onInnerExpandRowClick,
      renderFirstFilterRow,
      renderAsyncLoading,
      onInnerPageChange,
      setDragSortColumns,
    };
  },

  methods: {
    // support @row-click @page-change @row-hover .etc. events, Vue3 do not need this function
    getListener() {
      const listener: TableListeners = {};
      BASE_TABLE_ALL_EVENTS.forEach((key) => {
        listener[key] = (...args: any) => {
          this.$emit(key, ...args);
        };
      });
      return listener;
    },

    formatNode(api: string, renderInnerNode: Function, condition: boolean, extra?: { reverse?: boolean }) {
      if (!condition) return this[api];
      const innerNode = renderInnerNode(h);
      const propsNode = this.renderTNode(api);
      if (innerNode && !propsNode) return () => innerNode;
      if (propsNode && !innerNode) return () => propsNode;
      if (innerNode && propsNode) {
        return () => extra?.reverse ? (
            <div>
              {innerNode}
              {propsNode}
            </div>
        ) : (
            <div>
              {propsNode}
              {innerNode}
            </div>
        );
      }
      return null;
    },
  },

  render() {
    const isColumnController = !!(this.columnController && Object.keys(this.columnController).length);
    const placement = isColumnController ? this.columnController.placement || 'top-right' : '';
    const isBottomController = isColumnController && placement?.indexOf('bottom') !== -1;
    const topContent = this.formatNode(
      'topContent',
      this.renderColumnController,
      isColumnController && !isBottomController,
    );
    const bottomContent = this.formatNode('bottomContent', this.renderColumnController, isBottomController, {
      reverse: true,
    });
    const firstFullRow = this.formatNode('firstFullRow', this.renderFirstFilterRow, !this.hasEmptyCondition);
    const lastFullRow = this.formatNode('lastFullRow', this.renderAsyncLoading, !!this.asyncLoading);

    const props = {
      ...omit(this.$props, OMIT_PROPS),
      rowClassName: this.tRowClassNames,
      rowAttributes: this.tRowAttributes,
      columns: this.tColumns,
      topContent,
      bottomContent,
      firstFullRow,
      lastFullRow,
      renderExpandedRow: this.showExpandedRow ? this.renderExpandedRow : undefined,
    };

    // 事件，Vue3 do not need this.getListener
    const on: TableListeners = {
      ...this.getListener(),
      'page-change': this.onInnerPageChange,
    };
    if (this.expandOnRowClick) {
      on['row-click'] = this.onInnerExpandRowClick;
    }
    on.LeafColumnsChange = this.setDragSortColumns;
    // replace `scopedSlots={this.$scopedSlots}` of `v-slots={this.$slots}` in Vue3
    return (
      <BaseTable
        ref="primaryTableRef"
        scopedSlots={this.$scopedSlots}
        props={props}
        on={on}
        {...this.$attrs}
        class={this.primaryTableClasses}
      />
    );
  },
});
