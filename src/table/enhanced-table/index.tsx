import baseTableProps from '../base-table-props';
import primaryTableProps from '../primary-table-props';
import enhancedTableProps from '../enhanced-table-props';
import PrimaryTable from '../primary-table';
import mixins from '../../utils/mixins';
import TreeData from './tree';
import TreeSelect from './tree-select';

export default mixins(TreeData, TreeSelect).extend({
  name: 'TEnhancedTable',
  props: {
    ...baseTableProps,
    ...primaryTableProps,
    ...enhancedTableProps,
  },
  data() {
    return {
      dataSource: this.data,
    };
  },
  computed: {
    childrenKey(): string {
      return this.tree?.childrenKey || 'children';
    },
  },
  watch: {
    data(val) {
      this.dataSource = val;
    },
  },
  render() {
    const options = {
      props: {
        ...this.$props,
        data: this.dataSource,
        columns: this.columnsSource,
      },
      on: {
        ...this.$listeners,
        'select-change': this.onInnerSelectChange,
      },
      scopedSlots: { ...this.$scopedSlots },
    };
    return (
      <PrimaryTable {...options}/>
    );
  },
});
