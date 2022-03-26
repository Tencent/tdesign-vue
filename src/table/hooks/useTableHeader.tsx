import { SetupContext, computed } from '@vue/composition-api';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import { CreateElement } from 'vue';
import { TdBaseTableProps } from '../type';
import { TableColumns, getThRowspanAndColspan, getThList } from './useMultiHeader';
import useClassName from './useClassName';
import { TNodeReturnValue } from '../../common';

// 渲染表头的通用方法
export function renderTitle(h: CreateElement, slots: SetupContext['slots'], col: TableColumns[0], index: number) {
  const params = { col, colIndex: index };
  if (isFunction(col.title)) {
    return col.title(h, params);
  }
  if (isString(col.title) && slots[col.title]) {
    return slots[col.title](params);
  }
  if (isFunction(col.render)) {
    return (
      col.render(h, {
        ...params,
        type: 'title',
        row: {},
        rowIndex: -1,
      }) || col.title
    );
  }
  return col.title;
}

export default function useTableHeader(props: TdBaseTableProps) {
  const { tableSortClasses, tableFilterClasses } = useClassName();
  // 一次性获取 colspan 和 rowspan 可以避免其他数据更新导致的重复计算
  const spansAndLeafNodes = computed(() => getThRowspanAndColspan(props.columns));
  // 表头二维数据
  const thList = computed(() => getThList(props.columns));
  const isMultipleHeader = computed(() => thList.value.length > 1);

  // eslint-disable-next-line
  const renderTitleWidthIcon = (h: CreateElement, [title, sortIcon, filterIcon]: TNodeReturnValue[]) => {
    const classes = {
      [tableSortClasses.sortable]: sortIcon,
      [tableFilterClasses.filterable]: filterIcon,
    };
    return (
      <div class={classes}>
        <div class={tableSortClasses.title}>
          <div>{title}</div>
          {Boolean(sortIcon || filterIcon) && (
            <div class={tableFilterClasses.iconWrap}>
              {sortIcon}
              {filterIcon}
            </div>
          )}
        </div>
      </div>
    );
  };

  return {
    thList,
    isMultipleHeader,
    spansAndLeafNodes,
    renderTitleWidthIcon,
  };
}
