import { defineComponent, SetupContext, computed } from '@vue/composition-api';
import baseTableProps from './base-table-props';
import primaryTableProps from './primary-table-props';
import enhancedTableProps from './enhanced-table-props';
import PrimaryTable, { PrimaryTableListeners, ALL_EVENTS } from './primary-table';
import { TdEnhancedTableProps, PrimaryTableCol, TableRowData } from './type';
import useTreeData from './hooks/useTreeData';

export default defineComponent({
  name: 'TEnhancedTable',

  props: {
    ...baseTableProps,
    ...primaryTableProps,
    ...enhancedTableProps,
  },

  setup(props: TdEnhancedTableProps, context: SetupContext) {
    const {
      store, dataSource, formatTreeColum, ...treeInstanceFunctions
    } = useTreeData(props, context);

    // 影响列和单元格内容的因素有：树形节点需要添加操作符 [+] [-]
    const getColumns = (columns: PrimaryTableCol<TableRowData>[]) => {
      const arr: PrimaryTableCol<TableRowData>[] = [];
      for (let i = 0, len = columns.length; i < len; i++) {
        let item = { ...columns[i] };
        item = formatTreeColum(item);
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

    return {
      store,
      dataSource,
      tColumns,
      ...treeInstanceFunctions,
    };
  },

  methods: {
    // support @row-click @page-change @row-hover .etc. events, Vue3 do not need this function
    getListenser(): PrimaryTableListeners {
      const listenser: PrimaryTableListeners = {};
      ALL_EVENTS.forEach((key) => {
        listenser[key] = (...args: any) => {
          this.$emit(key, ...args);
        };
      });
      return listenser;
    },
  },

  render() {
    const props = {
      ...this.$props,
      data: this.dataSource,
      columns: this.tColumns,
      // 树形结构不允许本地数据分页
      disableDataPage: Boolean(this.tree && Object.keys(this.tree).length),
    };
    // 事件，Vue3 do not need this.getListenser
    const on: PrimaryTableListeners = this.getListenser();
    // replace `scopedSlots={this.$scopedSlots}` of `v-slots={this.$slots}` in Vue3
    return <PrimaryTable scopedSlots={this.$scopedSlots} props={props} on={on} {...this.$attrs} />;
  },
});
