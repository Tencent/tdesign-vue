import { SetupContext, h, computed } from '@vue/composition-api';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import pick from 'lodash/pick';
import get from 'lodash/get';
import TrElement, { TrProps, ROW_LISTENERS, TABLE_PROPS } from '../tr';
import {
  TABLE_CLASS_BODY, TAVLE_CLASS_VERTICAL_ALIGN, TABLE_CLASS_EMPTY, TABLE_CLASS_EMPTY_ROW,
} from './useStyle';
import {
  RowspanColspan, TdBaseTableProps, TableRowData, BaseTableCellParams,
} from '../type';
import { BaseTableProps } from '../interface';
import { ColumnStickyLeftAndRight } from './useFixed';
import { useTNodeJSX } from '../../hooks/tnode';
import useClassName from './useClassName';

export const ROW_AND_TD_LISTENERS = ROW_LISTENERS.concat('cell-click');

export interface RenderTableBodyParams {
  data: TdBaseTableProps['data'];
  columns: TdBaseTableProps['columns'];
  // 固定列 left/right 具体值
  columnStickyLeftAndRight: ColumnStickyLeftAndRight;
  showColumnShadow: { left: boolean; right: boolean };
  translateY: object;
  scrollType: string;
  rowHeight: number;
  trs: Map<number, object>;
  bufferSize: number;
  handleRowMounted: Function;
}

export default function useTableBody(props: BaseTableProps, { emit, slots }: SetupContext) {
  const renderTNode = useTNodeJSX();

  const { tableFullRowClasses } = useClassName();

  const tbodyClases = computed(() => [
    TABLE_CLASS_BODY,
    { [TAVLE_CLASS_VERTICAL_ALIGN[props.verticalAlign]]: props.verticalAlign },
  ]);

  const getTrListeners = (row: TableRowData, rowIndex: number) => {
    const trListeners: { [eventName: string]: (e: MouseEvent) => void } = {};
    // add events to row
    ROW_AND_TD_LISTENERS.forEach((eventName) => {
      trListeners[eventName] = (e: MouseEvent) => {
        const p = { e, row, index: rowIndex };
        props[`onRow${upperFirst(eventName)}`]?.(p);
        // Vue3 ignore this line
        emit(`row-${eventName}`, p);
      };
    });
    return trListeners;
  };

  const getFullRow = (
    columnLength: number,
    fullRow: TdBaseTableProps['firstFullRow'],
    type: 'first-full-row' | 'last-full-row',
  ) => {
    if (!fullRow) return null;
    const fullRowNode = renderTNode(camelCase(type));
    if (['', null, undefined, false].includes(fullRowNode)) return null;
    const classes = [tableFullRowClasses.base, tableFullRowClasses[type]];
    return (
      <tr class={classes}>
        <td colspan={columnLength}>{fullRowNode}</td>
      </tr>
    );
  };

  const renderEmpty = (columns: RenderTableBodyParams['columns']) => (
    <tr class={TABLE_CLASS_EMPTY_ROW}>
      <td colspan={columns.length}>
        <div class={TABLE_CLASS_EMPTY}>{renderTNode('empty') || '暂无数据'}</div>
      </td>
    </tr>
  );

  // 受合并单元格影响，部分单元格不显示
  let skipSpansMap = new Map<any, boolean>();

  const onTrRowspanOrColspan = (params: BaseTableCellParams<TableRowData>, cellSpans: RowspanColspan) => {
    const { rowIndex, colIndex } = params;
    if (!cellSpans.rowspan && !cellSpans.colspan) return;
    const maxRowIndex = rowIndex + (cellSpans.rowspan || 1);
    const maxColIndex = colIndex + (cellSpans.colspan || 1);
    for (let i = rowIndex; i < maxRowIndex; i++) {
      for (let j = colIndex; j < maxColIndex; j++) {
        if (i !== rowIndex || j !== colIndex) {
          skipSpansMap.set([i, j].join(), true);
        }
      }
    }
  };

  const renderTableBody = (p: RenderTableBodyParams) => {
    const {
      columnStickyLeftAndRight,
      data,
      columns,
      scrollType,
      rowHeight,
      trs,
      bufferSize,
      handleRowMounted,
      translateY,
    } = p;
    const columnLength = columns.length;
    const trNodeList: JSX.Element[] = [];
    // 每次渲染清空合并单元格信息
    skipSpansMap = new Map<any, boolean>();
    const dataLength = data.length;

    data?.forEach((row, rowIndex) => {
      const trProps: TrProps = {
        ...pick(props, TABLE_PROPS),
        columns,
        row,
        rowIndex,
        dataLength,
        columnStickyLeftAndRight,
        skipSpansMap,
        // 遍历的同时，计算后面的节点，是否会因为合并单元格跳过渲染
        onTrRowspanOrColspan,
        scrollType,
        rowHeight,
        trs,
        bufferSize,
      };
      if (props.onCellClick) {
        trProps.onCellClick = props.onCellClick;
      }
      // Vue3 do not need getTrListeners
      const on = getTrListeners(row, rowIndex);

      const trNode = (
        <TrElement
          scopedSlots={slots}
          key={get(row, props.rowKey || 'id')}
          on={on}
          props={trProps}
          onRowMounted={handleRowMounted}
        ></TrElement>
      );
      trNodeList.push(trNode);

      // 执行展开行渲染
      if (props.renderExpandedRow) {
        trNodeList.push(props.renderExpandedRow(h, { row, index: rowIndex, columns }));
      }
    });

    const list = [
      getFullRow(columnLength, props.firstFullRow, 'first-full-row'),
      trNodeList,
      getFullRow(columnLength, props.lastFullRow, 'last-full-row'),
    ];
    const isEmpty = !data?.length && !props.loading;
    return (
      <tbody
        class={tbodyClases.value}
        style={{ transform: scrollType === 'virtual' && `translate(0, ${translateY}px)` }}
      >
        {isEmpty ? renderEmpty(columns) : list}
      </tbody>
    );
  };

  return {
    renderTableBody,
  };
}
