import Vue, { VNode, CreateElement } from 'vue';
import TableCell from './table-cell';
import { BaseTableCol, CellData } from '../type';
import baseTableProps from '../base-table-props';
import { prefix } from '../../config';

interface Column extends BaseTableCol {
  scopedSlots: any;
}

type ThProps = {
  rowspan: number;
  colspan: number;
  column: BaseTableCol;
  index: number;
  hasChildren: boolean;
  isFirstColumn: boolean;
};

export default Vue.extend({
  name: `${prefix}-table-header`,
  props: {
    columns: baseTableProps.columns,
    bordered: baseTableProps.bordered,
  },

  data() {
    return {
      cacheRowMaxRowspan: [],
    };
  },

  methods: {
    renderHeader(): Array<VNode> {
      const { bordered, cacheRowMaxRowspan } = this;
      const trPropsList: Array<Array<ThProps>> = [];
      this.renderTr(this.columns, 0, trPropsList, true);
      return trPropsList.map((thPropsList, rowindex) => {
        const currentRowMaxRowspan = cacheRowMaxRowspan[rowindex] || 1;
        return (
          <tr>
            {thPropsList.map(({
              column, rowspan, colspan, index, hasChildren, isFirstColumn,
            }) => {
              const withBorder = bordered && index === 0 && !isFirstColumn;
              return this.renderCell(column, hasChildren ? rowspan : currentRowMaxRowspan, colspan, index, withBorder);
            })}
          </tr>
        );
      });
    },
    renderTr(
      columns: Array<BaseTableCol>,
      currentRowIndex: number,
      trPropsList: Array<any>,
      isParentFirstColumn: boolean,
    ): any {
      const { cacheRowMaxRowspan } = this;
      const currentRowThProps: Array<ThProps> = [];
      // 当前行
      if (typeof trPropsList[currentRowIndex] === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        trPropsList[currentRowIndex] = [];
      }
      if (typeof cacheRowMaxRowspan[currentRowIndex] === 'undefined') {
        cacheRowMaxRowspan[currentRowIndex] = 1;
      }
      // 占用的列
      let colspan = 0;
      // 占用的行
      let rowspan = 1;
      columns.forEach((column: BaseTableCol, index: number) => {
        const { children } = column;
        if (children?.length) {
          const isFirstColumn = isParentFirstColumn && index === 0;
          const { colspan: occupiedCol, rowspan: occupiedRow } = this.renderTr(
            children,
            currentRowIndex + 1,
            trPropsList,
            isFirstColumn,
          );
          colspan += occupiedCol;
          rowspan += occupiedRow;
          cacheRowMaxRowspan[currentRowIndex] = Math.max(rowspan, cacheRowMaxRowspan[currentRowIndex]);
          currentRowThProps[index] = {
            rowspan: 1,
            colspan: occupiedCol,
            column,
            index,
            hasChildren: true,
            isFirstColumn: index === 0 && isParentFirstColumn,
          };
        }
      });
      // 普通单元格
      columns.forEach((column, index: number) => {
        const { children } = column;
        if (!children || children?.length === 0) {
          currentRowThProps[index] = {
            rowspan,
            colspan: 1,
            column,
            index,
            hasChildren: false,
            isFirstColumn: index === 0 && isParentFirstColumn,
          };
          colspan += 1;
        }
      });
      trPropsList[currentRowIndex].push(...currentRowThProps);
      return {
        colspan,
        rowspan,
      };
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
        customRender = this.$scopedSlots[scopedSlotsTitle];
        console.error('TDesign Table Warn: scopedSlots will be deprecated, please use `cell` and `title` instead.');
      } else if (typeof title === 'string') {
        if (typeof this.$scopedSlots[title] === 'function') {
          customRender = (params: any) => this.$scopedSlots[title](params);
        } else {
          customRender = () => title;
        }
      } else if (typeof title === 'function') {
        customRender = (h: CreateElement, params: CellData<any>) => title(h, {
          colIndex: params.colIndex,
          col: params.col,
        });
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
