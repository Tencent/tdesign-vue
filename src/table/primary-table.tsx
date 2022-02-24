import { defineComponent } from '@vue/composition-api';
import baseTableProps from './base-table-props';
import primaryTableProps from './primary-table-props';
import BaseTable from './base-table';

export default defineComponent({
  name: 'TTable',

  props: {
    ...baseTableProps,
    ...primaryTableProps,
  },

  setup() {
    return {};
  },

  render() {
    return <BaseTable />;
  },
});
