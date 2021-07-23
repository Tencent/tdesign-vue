import Vue, { VNode } from 'vue';
import { prefix } from '../../config';

export default Vue.extend({
  name: `${prefix}-table-col-group`,
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    renderColgroup(): Array<VNode> {
      const { columns } = this;
      const colgroup: Array<VNode> = [];
      columns.forEach((column) => {
        const { width,  minWidth, colKey } = column;
        const style: any = {};
        if (width) {
          style.width = `${width}px`;
        }
        if (minWidth) {
          if (!width) {
            style.width = `${minWidth}px`;
          }
          style.minWidth = `${minWidth}px`;
        }
        colgroup.push(<col key={colKey} style={style} />);
      });
      return colgroup;
    },
  },
  render() {
    return <colgroup>{this.renderColgroup()}</colgroup>;
  },
});
