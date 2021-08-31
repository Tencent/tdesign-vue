import Vue, { VNode, PropType, CreateElement } from 'vue';
import get from 'lodash/get';
import { prefix } from '../../config';
import { BaseTableCol, RowspanColspan } from '../type';
import baseTableProps from '../base-table-props';
import TableCell from './table-cell';
import { CustomData, CellData, CellParams } from '../util/interface';
import { emitEvent } from '../../utils/event';

interface Column extends BaseTableCol {
  scopedSlots: any;
}

type Attrs = Record<string, any>;

const eventsName = {
  mouseover: 'row-hover',
  mousedown: 'row-mousedown',
  mouseup: 'row-mouseup',
  click: 'row-click',
  dblclick: 'row-db-click',
  dragstart: 'row-dragstart',
  dragover: 'row-dragover',
};

export default Vue.extend({
  name: `${prefix}-table-row`,
  props: {
    rowClass: baseTableProps.rowClassName,
    columns: baseTableProps.columns,
    rowKey: baseTableProps.rowKey,
    rowspanAndColspanProps: {
      type: Object as PropType<RowspanColspan>,
      required: false,
    },
    rowData: {
      type: Object,
      default(): any {
        return {};
      },
    },
    index: {
      type: Number,
      default: -1,
    },
    current: {
      type: Number,
      default: 1,
    },
    provider: {
      type: Object,
      default() {
        return {
          sortOnRowDraggable: false,
        };
      },
    },
  },
  methods: {
    // 渲染行
    renderRow(): Array<VNode> {
      const {
        rowData, columns, index: rowIndex, rowspanAndColspanProps,
      } = this;
      const rowBody: Array<VNode> = [];
      const customData: CustomData = {
        type: 'cell',
        func: 'cell',
      };
      columns.forEach((column, index) => {
        const { render, cell, scopedSlots } = column as Column;
        const scopedSlotsCol = scopedSlots?.col;
        const { colKey } = column;

        let customRender: any;

        if (typeof this.$scopedSlots[scopedSlotsCol] === 'function') {
          customRender = (h: CreateElement, params: CellParams) => this.$scopedSlots[scopedSlotsCol](params);
          console.warn('TDesign Table Warn: scopedSlots will be deprecated, please use `cell` and `title` instead.');
        } else if (typeof cell === 'function') {
          customRender = cell;
        } else if (typeof cell === 'string' && typeof this.$scopedSlots[cell] === 'function') {
          customRender = (h: CreateElement, params: CellParams) => this.$scopedSlots[cell](params);
        } else if (typeof this.$scopedSlots[colKey] === 'function') {
          customRender = (h: CreateElement, params: CellParams) => this.$scopedSlots[colKey](params);
        } else if (typeof render === 'function') {
          customRender = render;
          customData.func = 'render';
        } else {
          customRender = () => get(rowData, colKey);
        }

        const attrs: Attrs = column.attrs || {};
        if (colKey !== 'expanded-row' && rowspanAndColspanProps?.[colKey]) {
          let colspan = 1;
          let rowspan = 1;
          if (rowspanAndColspanProps[colKey]) {
            rowspan = rowspanAndColspanProps[colKey].rowspan || rowspan;
            colspan = rowspanAndColspanProps[colKey].colspan || colspan;
          }
          attrs.colspan = colspan;
          attrs.rowspan = rowspan;
          if (colspan === -1 || rowspan === -1) {
            return;
          }
        }
        const cellData: CellData = {
          col: {
            ...column,
            attrs,
          },
          colIndex: index,
          row: rowData,
          rowIndex,
          customData,
          customRender,
          type: 'td',
        };
        rowBody.push(<TableCell cellData={cellData} length={columns.length} />);
      });
      return rowBody;
    },
  },
  render() {
    const {
      rowClass, $attrs, rowData, index, rowKey, current,
    } = this;
    const params = {
      row: rowData,
      index,
    };
    const on = {};
    Object.keys(eventsName).forEach((event) => {
      const emitEventName = eventsName[event];
      on[event] = (e: MouseEvent) => {
        emitEvent(this, emitEventName, {
          ...params,
          e,
        });
      };
    });
    const trProps = {
      attrs: {
        ...$attrs,
        class: rowClass,
        key: rowKey ? get(rowData, rowKey) : index + current,
      },
      on,
    };
    if (this.provider.sortOnRowDraggable) {
      (trProps.attrs as any).draggable = true;
    }

    return <tr {...trProps}>{this.renderRow()}</tr>;
  },
});
