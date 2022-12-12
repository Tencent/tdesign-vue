import {
  defineComponent, SetupContext, computed, ref,
} from '@vue/composition-api';
import baseTableProps from './base-table-props';
import primaryTableProps from './primary-table-props';
import enhancedTableProps from './enhanced-table-props';
import PrimaryTable, { BASE_TABLE_ALL_EVENTS } from './primary-table';
import {
  TdEnhancedTableProps, PrimaryTableCol, TableRowData, DragSortContext, TdPrimaryTableProps,
} from './type';
import useTreeData from './hooks/useTreeData';
import useTreeSelect from './hooks/useTreeSelect';
import { TableListeners } from './base-table';

const PRIMARY_B_EVENTS = [
  'cell-click',
  'change',
  'page-change',
  'expand-change',
  'filter-change',
  'select-change',
  'sort-change',
  'data-change',
  'async-loading-click',
  'column-change',
  'column-controller-visible-change',
  'display-columns-change',
  'drag-sort',
  'row-edit',
  'row-validate',
  'validate',
];

const PRIMARY_ALL_EVENTS = BASE_TABLE_ALL_EVENTS.concat(PRIMARY_B_EVENTS);

export default defineComponent({
  name: 'TEnhancedTable',

  props: {
    ...baseTableProps,
    ...primaryTableProps,
    ...enhancedTableProps,
  },

  setup(props: TdEnhancedTableProps, context: SetupContext) {
    const primaryTableRef = ref();

    const {
      store, dataSource, formatTreeColumn, swapData, ...treeInstanceFunctions
    } = useTreeData(props, context);

    const treeDataMap = ref(store.value.treeDataMap);

    const { tIndeterminateSelectedRowKeys, onInnerSelectChange } = useTreeSelect(props, treeDataMap);

    // 影响列和单元格内容的因素有：树形节点需要添加操作符 [+] [-]
    const getColumns = (columns: PrimaryTableCol<TableRowData>[]) => {
      const arr: PrimaryTableCol<TableRowData>[] = [];
      for (let i = 0, len = columns.length; i < len; i++) {
        let item = { ...columns[i] };
        item = formatTreeColumn(item);
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
      // 暂时只有树形结构需要处理 column.cell
      const isTreeData = !props.tree || !Object.keys(props.tree).length;
      return isTreeData ? props.columns : getColumns(props.columns);
    });

    const onDragSortChange = (params: DragSortContext<TableRowData>) => {
      if (props.beforeDragSort && !props.beforeDragSort(params)) return;
      swapData({
        current: params.current,
        target: params.target,
        currentIndex: params.currentIndex,
        targetIndex: params.targetIndex,
      });
      props.onDragSort?.(params);
      // Vue3 do not need next line
      context.emit('drag-sort', params);
    };

    const onEnhancedTableRowClick: TdPrimaryTableProps['onRowClick'] = (p) => {
      if (props.tree?.expandTreeNodeOnClick) {
        treeInstanceFunctions.toggleExpandData(
          {
            row: p.row,
            rowIndex: p.index,
          },
          'row-click',
        );
      }
      props.onRowClick?.(p);
      context.emit('row-click', p);
    };

    return {
      store,
      dataSource,
      tColumns,
      tIndeterminateSelectedRowKeys,
      enhancedTableRef: primaryTableRef,
      primaryTableRef,
      onDragSortChange,
      onInnerSelectChange,
      onEnhancedTableRowClick,
      ...treeInstanceFunctions,
    };
  },

  methods: {
    // support @row-click @page-change @row-hover .etc. events, Vue3 do not need this function
    getListener() {
      const listeners: TableListeners = {};
      PRIMARY_ALL_EVENTS.forEach((key) => {
        listeners[key] = (...args: any) => {
          this.$emit(key, ...args);
          if (key === 'display-columns-change') {
            this.$emit('update:displayColumns', ...args);
          }
        };
      });
      return listeners;
    },
  },

  render() {
    const props: TdPrimaryTableProps = {
      rowKey: this.rowKey || 'id',
      ...this.$options.propsData,
      data: this.dataSource,
      columns: this.tColumns,
      // 半选状态节点
      indeterminateSelectedRowKeys: this.tIndeterminateSelectedRowKeys,
      // 树形结构不允许本地数据分页
      disableDataPage: Boolean(this.tree && Object.keys(this.tree).length),
    };
    // 事件，Vue3 do not need this.getListener
    const on: TableListeners = {
      ...this.getListener(),
      'select-change': this.onInnerSelectChange,
      'drag-sort': this.onDragSortChange,
    };
    if (this.tree?.expandTreeNodeOnClick) {
      on['row-click'] = this.onEnhancedTableRowClick;
    }
    // replace `scopedSlots={this.$scopedSlots}` of `v-slots={this.$slots}` in Vue3
    return (
      <PrimaryTable ref="primaryTableRef" scopedSlots={this.$scopedSlots} props={props} on={on} {...this.$attrs} />
    );
  },
});
