import Vue, { VNode } from 'vue';
import get from 'lodash/get';
import { emitEvent } from '../../utils/event';
import { prefix } from '../../config';
import baseTableProps from '../base-table-props';
import primaryTableProps from '../primary-table-props';
import { BaseTableCol } from '../type';
import TableRow from './table-row';
import { renderTNodeJSX } from '../../utils/render-tnode';

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
    onRowHover: baseTableProps.onRowHover,
    onRowMouseup: baseTableProps.onRowMouseup,
    onRowMousedown: baseTableProps.onRowMousedown,
    onRowClick: baseTableProps.onRowClick,
    onRowDbClick: baseTableProps.onRowDbClick,
    selectedRowKeys: primaryTableProps.selectedRowKeys,
    provider: {
      type: Object,
      default() {
        return {
          renderRows(): void {},
        };
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
      const cacheFirstColumnLeftedRowspan: Array<number> = [];
      data.forEach((rowData, rowIndex) => {
        if (props[rowIndex] === undefined) {
          props[rowIndex] = {};
        }
        columns.forEach((col, colIndex) => {
          const { colKey } = col;
          let { rowspan, colspan } = rowspanAndColspan({
            col,
            colIndex,
            row: rowData,
            rowIndex,
          }) || {};
          rowspan = rowspan || 1;
          colspan = colspan || 1;
          if (colIndex === 0 && rowspan > 1) {
            // 第一列跨行的话，先提前设置一下第 rowspan + rowindex - 1 行的剩余跨行数
            cacheFirstColumnLeftedRowspan[rowspan + rowIndex - 1] = 1;
          }
          // 剩余要跨的行
          let leftedRowspan = 0;
          if (rowIndex === 0 || rowspan > 1) {
            leftedRowspan = rowspan - 1;
          } else {
            // 上一行如果跨行的话，计算一下除去渲染当前行是否还在跨行范围内，以及是否还有剩余
            const preRowIndex = rowIndex - 1;
            leftedRowspan = props[preRowIndex]?.[colKey]?.leftedRowspan || 0;
            if (leftedRowspan > 0) {
              leftedRowspan -= 1;
              // 当前单元格跨行置为-1，在渲染时跳过
              rowspan = -1;
            }
          }
          // 剩余要跨的列
          let leftedColspan = 0;
          if (colIndex === 0 || colspan > 1) {
            leftedColspan = colspan - 1;
            // 第一列有跨行，行数不减1，防止后后面的单元格判断失误
            if (colIndex === 0 && (leftedRowspan > 0 || cacheFirstColumnLeftedRowspan[rowIndex] > 0)) {
              leftedColspan = 1;
            }
          } else {
            // 一种特殊情况，如果当前行的上一行有跨列，应该继承一下他的跨列数
            if (rowIndex > 0) {
              const preLeftedColspan = props[rowIndex - 1]?.[colKey]?.leftedColspan;
              const preLeftedColRowspan = props[rowIndex - 1]?.[colKey]?.leftedRowspan;
              if (preLeftedColspan > 0 && preLeftedColRowspan > 0) {
                leftedColspan = preLeftedColspan;
                // 当前单元格跨行置为-1，在渲染时跳过
                colspan = -1;
              }
            }
            // 前一列如果跨列的话，计算一下除去渲染当前列是否还在跨列范围内，以及是否还有剩余
            const preColKey = (columns[colIndex - 1] as BaseTableCol).colKey;
            if (leftedColspan === 0) {
              leftedColspan = props[rowIndex]?.[preColKey]?.leftedColspan || 0;
              if (leftedColspan > 0) {
                leftedColspan -= 1;
                // 当前单元格跨行置为-1，在渲染时跳过
                colspan = -1;
              }
            }
          }
          if (rowspan > 1 && colspan === -1) {
            colspan = 1;
          }
          if (colspan > 1 && rowspan === -1) {
            rowspan = 1;
          }
          props[rowIndex][colKey] = {
            leftedColspan,
            leftedRowspan,
            rowspan,
            colspan,
          };
        });
      });
      return props;
    },

    renderFullRow(type: 'firstFullRow' | 'lastFullRow') {
      const firstFullRowNode = renderTNodeJSX(this, type);
      if (firstFullRowNode) {
        return (
          <tr>
            <td colspan={this.columns.length} class={`${prefix}-table__row--full`}>
              {firstFullRowNode}
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
        provider,
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

        provider.renderRows({
          rows: body,
          row,
          rowIndex: index,
          columns: this.columns,
        });
      });
      const firstRow = this.renderFullRow('firstFullRow');
      if (firstRow) {
        body = [firstRow].concat(body);
      }
      const lastRow = this.renderFullRow('lastFullRow');
      if (lastRow) {
        body = body.concat(lastRow);
      }
      return body;
    },
  },

  render() {
    if (this.provider.sortOnRowDraggable) {
      const className = `${prefix}-table__body ${this.provider.dragging ? 'dragging' : ''}`;
      return (
        <transition-group class={className} tag="tbody">
          {this.renderBody()}
        </transition-group>
      );
    }
    return <tbody class={`${prefix}-table__body`}>{this.renderBody()}</tbody>;
  },
});
