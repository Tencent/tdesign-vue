import Vue from 'vue';
import SorterButton from '../sorter-button';
import { prefix } from '../../../config';
import { SortInfo, PrimaryTableCol, TdPrimaryTableProps, SortType } from '../../../../types/primary-table/TdPrimaryTableProps';
import primaryTableProps from '../../../../types/primary-table/props';
import baseTableProps from '../../../../types/base-table/props';
import { SortColumnAndOrder } from '../../util/interface';
import { emitEvent } from '../../../utils/event';

type Columns = TdPrimaryTableProps['columns'];
type SorterChangeContext = Parameters<TdPrimaryTableProps['onSortChange']>;
type ChangeContext = Parameters<TdPrimaryTableProps['onChange']>;

const CANCEL = 'cancel'; // 取消排序

export default Vue.extend({
  name: `${prefix}-primary-table-sort`,
  props: {
    data: baseTableProps.data,
    columns: primaryTableProps.columns,
    sort: primaryTableProps.sort,
    multipleSort: primaryTableProps.multipleSort,
  },
  data() {
    return {
      childrenColumnName: 'children',
      currentSortOrderMap: {},
      updatedSortInfoMap: {},
    };
  },
  computed: {
    sortArray(): Array<SortInfo> {
      const { sort } = this;
      if (!sort) {
        return [];
      }
      return Array.isArray(sort) ? sort : [sort];
    },
    sortMap(): Record<any, SortInfo & { index: number }> {
      const sortMap = {};
      this.sortArray.forEach((info, index) => {
        const { sortBy } = info;
        sortMap[sortBy] = {
          index,
          ...info,
        };
      });
      return sortMap;
    },
  },
  methods: {
    needSort(column: PrimaryTableCol): boolean {
      const { sorter, sortType } = column;
      return sorter && (!sortType || (Array.isArray(sortType) && sortType.length > 0) || typeof sortType === 'string');
    },
    emitSortChange(col: PrimaryTableCol) {
      let sortInfo;
      const { updatedSortInfoMap, currentSortOrderMap, multipleSort } = this;
      const { colKey } = col;
      if (multipleSort) {
        sortInfo = [];
        Object.keys(updatedSortInfoMap).forEach((sortBy) => {
          if (currentSortOrderMap[sortBy] === CANCEL) {
            return;
          }
          sortInfo.push({
            sortBy,
            descending: updatedSortInfoMap[sortBy].descending,
          });
        });
      } else if (updatedSortInfoMap[colKey]) {
        sortInfo = {
          sortBy: colKey,
          descending: updatedSortInfoMap[colKey].descending,
        };
      }
      const { data } = this;
      emitEvent<SorterChangeContext>(this, 'sort-change', sortInfo, {
        currentDataSource: data,
        col,
      });
      emitEvent<ChangeContext>(
        this, 'change',
        { sorter: sortInfo },
        { trigger: 'sorter', currentData: data },
      );
    },
    getNextSortOrder(currentSortOrder: any, sortType: SortType) {
      const sorterTypes: Array<SortType> = sortType === 'all' ? ['desc', 'asc'] : [sortType];
      const idx: number = (sorterTypes.indexOf(currentSortOrder) + 1) % (sorterTypes.length + 1);
      return sorterTypes[idx] || CANCEL;
    },
    handleSortHeaderClick(col: PrimaryTableCol): void {
      const { sortType, colKey, sorter } = col;
      const {
        currentSortOrderMap,
      } = this;
      const currentSortOrder = currentSortOrderMap[colKey];
      const sortOrder = this.getNextSortOrder(currentSortOrder, sortType);
      this.currentSortOrderMap[colKey] = sortOrder;
      if (typeof sorter === 'boolean' && sorter) {
        if (sortOrder === 'cancel') {
          this.updatedSortInfoMap[colKey] = undefined;
        } else {
          this.updatedSortInfoMap[colKey] = {
            descending: sortOrder === 'desc',
            sortBy: colKey,
          };
        }
        this.emitSortChange(col);
        return;
      }
      const sortFn = this.getSorterFn(col, sortOrder);
      this.recursiveSort([...this.data], sortFn);
      this.emitSortChange(col);
    },
    sorterHandler(): Array<any> {
      const sorterFn = this.getSorterFn();
      const { data } = this;
      return sorterFn ? this.recursiveSort([...data], sorterFn) : data;
    },
    getSortColumn(colKey: string) {
      return this.columns.find(column => column.colKey === colKey);
    },
    getSorterFn(currentSortColumn?: PrimaryTableCol, currentSortOrder?: SortType | string): (a: Record<string, any>, b: Record<string, any>) => number | undefined {
      const { sortArray } = this;
      const { sortBy } = this.sortArray[0] || {};
      const sortColumn = currentSortColumn || this.getSortColumn(sortBy);
      const sortOrder = currentSortOrder || this.currentSortOrderMap[sortBy];
      if (!sortOrder || !sortColumn) {
        return;
      }
      const descending = sortOrder === 'desc';
      let index = 0;
      this.updatedSortInfoMap = Object.assign({}, this.sortMap);;

      const getNextSortFn = (a: Record<string, any>, b: Record<string, any>): number => {
        const { sortBy: nextSortColKey, descending } = sortArray[index] || {};
        const nextSortColumn = this.getSortColumn(nextSortColKey);
        if (nextSortColumn) {
          const { sorter: sortFn, colKey } = nextSortColumn;
          this.updatedSortInfoMap[colKey] = {
            sortBy: nextSortColumn.colKey,
            descending,
          };
          if (typeof sortFn === 'function') {
            const result = Number(sortFn(a, b, {
              sortType: descending ? 'desc' : 'asc',
            }));
            if (Number(result) === 0 && index < sortArray.length - 1) {
              index += 1;
              return getNextSortFn(a, b);
            }
            return descending ? -result : result;
          }
        }
        return 0;
      };

      return (a: Record<string, any>, b: Record<string, any>): number => {
        const { sorter, colKey } = sortColumn;
        if (typeof sorter === 'function') {
          const result = sorter(a, b, {
            sortType: sortOrder,
          });
          if (sortOrder !== CANCEL) {
            this.updatedSortInfoMap[colKey] = {
              sortBy: colKey,
              descending,
            };
          }
          if (result !== 0) {
            return descending ? -result : result;
          }
          if (this.multipleSort) {
            index += 1;
            return getNextSortFn(a, b);
          }
          return 0;
        }
      };
    },
    getNextSortColumnAndSorter(sortColumn: PrimaryTableCol): SortColumnAndOrder {
      const { sortArray, columns, sortMap } = this;
      const { colKey } = sortColumn;
      const { index } = sortMap[colKey];
      if (index === -1 || index + 1 === sortArray.length) {
        return null;
      }
      const { sortBy: nextColKey, descending } = sortArray[index + 1];
      const sortOrder = descending ? 'desc' : 'asc';
      const nextSortColumn = columns.find(column => (column.colKey === nextColKey));
      return {
        sortOrder,
        sortColumn: nextSortColumn,
      };
    },
    recursiveSort(
      data: Record<string, any>[],
      sorterFn: (a: Record<string, any>, b: Record<string, any>) => number | undefined,
    ): Record<string, any>[] {
      const { childrenColumnName } = this;
      return data.sort(sorterFn).map((item: Record<string, any>) => item[childrenColumnName]
        ? {
          ...item,
          [childrenColumnName]: this.recursiveSort([...item[childrenColumnName]], sorterFn),
        }
        : item);
    },
    getSorterColumns(columns: Columns): Columns {
      const sorterColumns: Columns = [];
      const { $scopedSlots: scopedSlots, sortMap, currentSortOrderMap, multipleSort, sortArray } = this;
      columns.forEach((column, index: number) => {
        const { title, sortType, colKey } = column;
        const needSort = this.needSort(column);
        // 用户传入插槽
        let columnTitle: any;
        const slotKey = title as string;
        if (slotKey && scopedSlots[slotKey]) {
          columnTitle = () => scopedSlots[slotKey]({
            col: column,
            colIndex: index,
          });
        } else if (needSort) {
          let sortOrder;
          if (multipleSort) {
            if (sortMap[colKey]?.descending) {
              sortOrder = 'desc';
              this.currentSortOrderMap[colKey] = sortOrder;
            } else {
              sortOrder = currentSortOrderMap[colKey];
            }
          } else if (sortArray[0]?.sortBy === colKey) {
            sortOrder = sortArray[0]?.descending ? 'desc' : currentSortOrderMap[colKey] || 'asc';
          }
          this.currentSortOrderMap[colKey] = sortOrder;
          const nextSortOrder = this.getNextSortOrder(sortOrder, sortType);
          const sorterButtonsProps = {
            on: { click: (): void => this.handleSortHeaderClick(column) },
            props: {
              sortType,
              sortOrder,
              nextSortOrder: nextSortOrder || 'desc',
            },
            class: `${prefix}-table-sort-icon`,
          };
          columnTitle = () => (
            <div class={`${prefix}-table__cell--sortable`}>
              <div class={`${prefix}-table__cell--title`}>
                <div>{title}</div>
              </div>
              {<SorterButton {...sorterButtonsProps} />}
            </div>
          );
        } else {
          columnTitle = title;
        }
        sorterColumns.push({
          ...column,
          title: columnTitle,
        });
      });
      return sorterColumns;
    },
  },
});
