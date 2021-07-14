import Vue, { VNode } from 'vue';
import TableCell from './table-cell';
import { BaseTableCol, CellData } from '../../../types/base-table/TdBaseTableProps';
import baseTableProps from '../../../types/base-table/props';
import { prefix } from '../../config';
import { CreateElement } from 'vue/types/umd';

interface Column extends BaseTableCol {
  scopedSlots: any;
}

export default Vue.extend({
  name: `${prefix}-table-header`,
  props: {
    columns: baseTableProps.columns,
    bordered: baseTableProps.bordered,
  },

  methods: {
    renderHeader(): Array<VNode> {
      const trContentList: Array<any> = [];
      this.renderTr(this.columns, 0, trContentList);
      const theadContent = trContentList.map((item: any) => <tr>{item}</tr>);
      return theadContent;
    },
    renderTr(columns: Array<BaseTableCol>, currentRow: number, trContentList: Array<any>): any {
      const thContent: Array<VNode> = [];
      // 当前行
      if (typeof trContentList[currentRow] === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        trContentList[currentRow] = [];
      }
      // 实际占用的列
      let currentColSpan = 0;
      columns.forEach((column: BaseTableCol, index: number) => {
        const { children } = column;
        if (children?.length) {
          const colSpan = this.renderTr(children, currentRow + 1, trContentList);
          currentColSpan += colSpan;
          thContent[index] = this.renderCell(column, 1, colSpan, index);
        }
      });
      let rowspan = 1;
      if (trContentList.length >= 1) {
        rowspan = trContentList.length - currentRow;
      }
      // 普通单元格，也许会涉及跨行
      columns.forEach((column, index: number) => {
        const { children } = column;
        if (!children || children?.length === 0) {
          // 上一行有跨行到当前行且单元格是当前行的第一列，要带上边框。
          const withBorder = currentRow > 0 && this.bordered && thContent.length === 0 && trContentList[currentRow].length === 0;
          thContent[index] = this.renderCell(column, rowspan, 1, index, withBorder);
          currentColSpan += 1;
        }
      });
      trContentList[currentRow].push(...thContent);
      return currentColSpan;
    },

    renderCell(column: BaseTableCol, rowspan: number, colspan: number, index: number, withBorder?: boolean): VNode {
      const { title, render, scopedSlots } = column as Column;
      const scopedSlotsTitle = scopedSlots?.title;

      const customData = {
        type: 'title',
        func: 'title',
      };
      let customRender;
      if (typeof this.$scopedSlots[scopedSlotsTitle] === 'function') {
        customRender =  this.$scopedSlots[scopedSlotsTitle] ;
        console.error('TDesign Table Warn: scopedSlots will be deprecated, please use `cell` and `title` instead.');
      } else if (typeof title === 'string') {
        if (typeof this.$scopedSlots[title] === 'function') {
          customRender = (params: any) => this.$scopedSlots[title](params);
        } else {
          customRender = () => title;
        }
      } else if (typeof title === 'function') {
        customRender = (h: CreateElement, params: CellData<any>) => (title(h, {
          colIndex: params.colIndex,
          col: params.col,
        }));
      } else if (typeof render === 'function') {
        customRender = render;
        customData.func = 'render';
      } else {
        customRender = () => '';
      }

      const cellData = {
        col: column,
        colIndex: index,
        customData,
        customRender,
        type: 'th',
        withBorder,
      };
      return <TableCell cellData={cellData} colspan={colspan} rowspan={rowspan} />;
    },
  },
  render() {
    return <thead>{this.renderHeader()}</thead>;
  },
});
