import Vue, { VNode } from 'vue';
import get from 'lodash/get';
import camelCase from 'lodash/camelCase';
import { emitEvent } from '../../utils/event';
import { prefix } from '../../config';
import baseTableProps from '../base-table-props';
import primaryTableProps from '../primary-table-props';
import TableRow from './table-row';
import { renderTNodeJSX } from '../../utils/render-tnode';

type RowOrColspanProp = {
  colspan?: number;
  rowspan?: number;
};

const setPropsValue = (
  propsArray: Array<Record<string, RowOrColspanProp>>,
  rowIndex: number,
  key: string,
  value: RowOrColspanProp,
) => {
  if (typeof propsArray[rowIndex] === 'undefined') {
    // eslint-disable-next-line no-param-reassign
    propsArray[rowIndex] = {
      [key]: {},
    };
  }
  if (typeof propsArray[rowIndex][key] === 'undefined') {
    // eslint-disable-next-line no-param-reassign
    propsArray[rowIndex][key] = {};
  }
  // eslint-disable-next-line no-param-reassign
  propsArray[rowIndex][key] = value;
};

export default Vue.extend({
  name: `${prefix}-table-body`,

  props: {
    data: baseTableProps.data,
    columns: baseTableProps.columns,
    rowClassName: baseTableProps.rowClassName,
    rowKey: baseTableProps.rowKey,
    rowspanAndColspan: baseTableProps.rowspanAndColspan,
    firstFullRow: baseTableProps.firstFullRow,
    lastFullRow: baseTableProps.lastFullRow,
    onCellClick: baseTableProps.onCellClick,
    onRowHover: baseTableProps.onRowHover,
    onRowMouseup: baseTableProps.onRowMouseup,
    onRowMousedown: baseTableProps.onRowMousedown,
    onRowClick: baseTableProps.onRowClick,
    onRowDbClick: baseTableProps.onRowDbClick,
    selectedRowKeys: primaryTableProps.selectedRowKeys,
    provider: {
      type: Object,
      default() {
        return {};
      },
    },
    current: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    selectColumn(): any {
      return this.columns.find(({ type }: any) => ['multiple', 'single'].includes(type)) || {};
    },
  },

  methods: {
    getRowspanAndColspanProps() {
      const props: Array<any> = [];
      const { data, columns, rowspanAndColspan } = this;
      data.forEach((rowData, rowIndex) => {
        if (props[rowIndex] === undefined) {
          props[rowIndex] = {};
        }
        columns.forEach((col, colIndex) => {
          const { colKey } = col;
          if (props[rowIndex]?.[colKey]) {
            return;
          }
          let { rowspan, colspan } = rowspanAndColspan({
            col,
            colIndex,
            row: rowData,
            rowIndex,
          }) || {};
          rowspan = rowspan || 1;
          colspan = colspan || 1;
          if (rowspan > 1 || colspan > 1) {
            let occupiedRow = 0;
            while (occupiedRow < rowspan) {
              let occupiedCol = 1;
              while (occupiedCol < colspan) {
                const curColIndex = colIndex + occupiedCol;
                const nextColKey = columns[curColIndex]?.colKey;
                setPropsValue(props, rowIndex + occupiedRow, nextColKey, { colspan: -1 });
                occupiedCol += 1;
              }
              if (occupiedRow > 0) {
                setPropsValue(props, rowIndex + occupiedRow, colKey, { rowspan: -1 });
              }
              occupiedRow += 1;
            }
          }
          props[rowIndex][colKey] = {
            rowspan,
            colspan,
          };
        });
      });
      return props;
    },

    renderFullRow(type: 'first-full-row' | 'last-full-row') {
      const fullRowNode = renderTNodeJSX(this, camelCase(type));
      if (fullRowNode) {
        return (
          <tr>
            <td colspan={this.columns.length} class={`${prefix}-table__row--full ${prefix}-table__row-${type}`}>
              {fullRowNode}
            </td>
          </tr>
        );
      }
      return null;
    },

    renderBody(): Array<VNode> {
      const {
        data,
        rowClassName,
        rowKey,
        $scopedSlots: scopedSlots,
        rowspanAndColspan,
        selectedRowKeys,
        selectColumn,
      } = this;
      let body: Array<VNode> = [];
      let allRowspanAndColspanProps: any;
      if (typeof rowspanAndColspan === 'function') {
        allRowspanAndColspanProps = this.getRowspanAndColspanProps();
      }
      data.forEach((row: any, index: number) => {
        const defaultRowClass = typeof rowClassName === 'function' ? rowClassName({ row, rowIndex: index }) : rowClassName;
        let rowClass: Array<string> = [];
        if (defaultRowClass) {
          rowClass = rowClass.concat(defaultRowClass);
        }
        const rowspanAndColspanProps = allRowspanAndColspanProps ? allRowspanAndColspanProps[index] : undefined;
        let rowVnode: VNode;
        const key = rowKey ? get(row, rowKey) : index + this.current;
        const disabled = typeof selectColumn.disabled === 'function'
          ? selectColumn.disabled({ row, rowIndex: index })
          : selectColumn.disabled;
        if (disabled) {
          rowClass.push(`${prefix}-table__row--disabled`);
        }
        if (selectedRowKeys?.indexOf(key) > -1) {
          rowClass.push(`${prefix}-table__row--selected`);
        }
        if (row.__t_table_inner_data__?.level) {
          rowClass.push(`${prefix}-table__row--level-${row.__t_table_inner_data__?.level || 0}`);
        }
        const props = {
          key,
          props: {
            ...this.$props,
            rowClass: rowClass.join(' '),
            rowData: row,
            index,
            rowspanAndColspanProps,
          },
          on: {
            ...this.$listeners,
            'row-dragstart': () => {
              emitEvent(this, 'row-dragstart', {
                index,
                row,
              });
            },
            'row-dragover': ({ e }: { e: MouseEvent }) => {
              e.preventDefault();
              emitEvent(this, 'row-dragover', {
                index,
                row,
                targetElm: rowVnode.elm,
              });
            },
          },
          scopedSlots,
        };
        rowVnode = <TableRow rowKey={this.rowKey} {...props} />;
        // 按行渲染
        body.push(rowVnode);
        // 渲染展开行
        const expandedRow = this.provider.renderExpandedRow?.({ row, index });
        expandedRow && (body = body.concat(expandedRow));
      });
      const firstRow = this.renderFullRow('first-full-row');
      if (firstRow) {
        body = [firstRow].concat(body);
      }
      const lastRow = this.renderFullRow('last-full-row');
      if (lastRow) {
        body = body.concat(lastRow);
      }
      return body;
    },
  },

  render() {
    if (this.provider.sortOnRowDraggable) {
      const className = `${prefix}-table__body ${this.provider.dragging ? `${prefix}-table__body--dragging` : ''}`;
      return (
        <transition-group class={className} tag="tbody">
          {this.renderBody()}
        </transition-group>
      );
    }
    return <tbody class={`${prefix}-table__body`}>{this.renderBody()}</tbody>;
  },
});
