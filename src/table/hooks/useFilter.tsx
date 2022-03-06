import {
  SetupContext, toRefs, ref, watch, computed,
} from '@vue/composition-api';
import { CreateElement } from 'vue';
import { FilterIcon } from 'tdesign-icons-vue';
import isEmpty from 'lodash/isEmpty';
import Popup from '../../popup';
import useClassName from './useClassName';
import TButton from '../../button';
import {
  TdPrimaryTableProps, PrimaryTableCol, TableRowData, FilterValue,
} from '../type';
import useDefaultValue from '../../hooks/useDefaultValue';
import { useTNodeDefault } from '../../hooks/tnode';
import { CheckboxGroup } from '../../checkbox';
import { RadioGroup } from '../../radio';
import Input from '../../input';
import { TableConfig, useConfig } from '../../config-provider/useConfig';

type Params = Parameters<CreateElement>;
type FirstParams = Params[0];
type SecondParams = Params[1] | Params[2];

// 筛选条件不为空，才需要显示筛选结果行
function filterEmptyData(data: FilterValue) {
  const newFilterValue: FilterValue = {};
  Object.keys(data).forEach((key) => {
    const item = data[key];
    const isArrayTrue = item instanceof Array && item.length;
    const isObject = typeof item === 'object' && !(item instanceof Array);
    const isObjectTrue = isObject && Object.keys(item).length;
    if (isArrayTrue || isObjectTrue || !['null', '', 'undefined'].includes(String(item))) {
      newFilterValue[key] = item;
    }
  });
  return newFilterValue;
}

export default function useFilter(props: TdPrimaryTableProps, context: SetupContext) {
  const renderTNode = useTNodeDefault();
  const { t, global } = useConfig<TableConfig>('table');
  const { filterValue } = toRefs(props);
  const { tableFilterClasses, isFocusClass } = useClassName();
  // 记录筛选列是否处理下拉展开状态
  const filterPopupVisible = ref<{ [key: string]: boolean }>({});

  // uncontroll and controll
  const [tFilterValue, setTFilterValue] = useDefaultValue(
    filterValue,
    props.defaultFilterValue,
    props.onFilterChange,
    context.emit,
    'filterValue',
    'filter-change',
  );

  // 过滤内部值
  const innerFilterValue = ref<FilterValue>(tFilterValue.value);

  const hasEmptyCondition = computed(() => {
    const filterEmpty = filterEmptyData(tFilterValue.value || {});
    return !tFilterValue.value || !Object.keys(filterEmpty).length;
  });

  watch([tFilterValue], ([val]) => {
    innerFilterValue.value = val;
  });

  function onFilterPopupVisibleChange(visible: boolean, colKey: string) {
    filterPopupVisible.value = { ...filterPopupVisible.value, [colKey]: visible };
  }

  // eslint-disable-next-line
  function renderFirstFilterRow(h: CreateElement) {
    if (hasEmptyCondition.value) return null;
    const defaultNode = (
      <div class={tableFilterClasses.result}>
        <span>搜索 “{getFilterResultContent()}”，</span>
        <span>找到 {props.pagination?.total || props.data?.length} 条结果</span>
        <TButton theme="primary" variant="text" onClick={onResetAll}>
          清空筛选
        </TButton>
      </div>
    );
    const filterContent = renderTNode('filterRow');
    if (props.filterRow && !filterContent) return null;
    return <div class={tableFilterClasses.inner}>{filterContent || defaultNode}</div>;
  }

  // 获取搜索条件内容，存在 options 需要获取其 label 显示
  function getFilterResultContent(): string {
    const arr: string[] = [];
    props.columns
      .filter((col) => col.filter)
      .forEach((col) => {
        let value = tFilterValue.value[col.colKey];
        if (col.filter.list && !['null', '', 'undefined'].includes(String(value))) {
          const formattedValue = value instanceof Array ? value : [value];
          const label: string[] = [];
          col.filter.list.forEach((option) => {
            if (formattedValue.includes(option.value)) {
              label.push(option.label);
            }
          });
          value = label.join();
        }
        if (value) {
          arr.push(`${col.title}：${value}`);
        }
      });
    return arr.join('；');
  }

  function onInnerFilterChange(val: any, column: PrimaryTableCol) {
    const filterValue = {
      ...innerFilterValue.value,
      [column.colKey]: val,
    };
    innerFilterValue.value = filterValue;
    if (!column.filter.showConfirmAndReset) {
      emitFilterChange(filterValue, column);
    }
  }

  function emitFilterChange(filterValue: FilterValue, column?: PrimaryTableCol) {
    setTFilterValue(filterValue, { col: column });

    props.onChange?.({ filter: filterValue }, { trigger: 'filter' });
    // Vue3 ignore next line
    context.emit('change', { filter: filterValue }, { trigger: 'filter' });
  }

  function onReset(column: PrimaryTableCol) {
    const filterValue: FilterValue = {
      ...tFilterValue.value,
      [column.colKey]:
        {
          single: '',
          multiple: [],
          input: '',
        }[column.filter.type]
        || column.filter.resetValue
        || '',
    };
    emitFilterChange(filterValue, column);
    filterPopupVisible.value = { ...filterPopupVisible.value, [column.colKey]: false };
  }

  function onResetAll() {
    emitFilterChange({}, undefined);
    filterPopupVisible.value = {};
  }

  function onConfirm(column: PrimaryTableCol) {
    emitFilterChange(innerFilterValue.value, column);
    filterPopupVisible.value = { ...filterPopupVisible.value, [column.colKey]: false };
  }

  function getBottomButtons(h: CreateElement, column: PrimaryTableCol) {
    if (!column.filter.showConfirmAndReset) return;
    return (
      <div class={tableFilterClasses.bottomButtons}>
        <TButton theme="default" size="small" onClick={() => onReset(column)}>
          重置
        </TButton>
        <TButton theme="primary" size="small" onClick={() => onConfirm(column)}>
          确认
        </TButton>
      </div>
    );
  }

  function getFilterContent(h: CreateElement, column: PrimaryTableCol) {
    const types = ['single', 'multiple', 'input'];
    if (column.type && !types.includes(column.filter.type)) {
      console.error(`TDesign Table Error: column.filter.type must be the following: ${JSON.stringify(types)}`);
      return;
    }
    if (column?.filter?.component && typeof column?.filter?.component !== 'function') {
      console.error('TDesign Table Error: column.filter.component must be a function');
      return;
    }
    const component = {
      single: RadioGroup,
      multiple: CheckboxGroup,
      input: Input,
    }[column.filter.type];
    if (!component && !column?.filter?.component) return;
    const props = {
      options: ['single', 'multiple'].includes(column.filter.type) ? column.filter?.list : undefined,
      ...(column.filter?.props || {}),
      value: innerFilterValue.value?.[column.colKey],
    };
    const on = {
      change: (val: any) => onInnerFilterChange(val, column),
    };
    const wrapperListeners: { click?: Function } = {};
    if (column.filter.showConfirmAndReset) {
      wrapperListeners.click = (e: MouseEvent) => e.stopPropagation();
    }
    return (
      <div class={tableFilterClasses.contentInner} on={wrapperListeners}>
        {column?.filter?.component ? (
          column?.filter?.component((v: FirstParams, b: SecondParams) => {
            const tProps = typeof b === 'object' && 'attrs' in b ? b.attrs : {};
            return h(v, {
              props: { ...props, ...tProps },
              on,
            });
          })
        ) : (
          <component value={innerFilterValue.value?.[column.colKey]} props={{ ...props }} on={{ ...on }}></component>
        )}
      </div>
    );
  }

  // 图标：内置图标，组件自定义图标，全局配置图标
  function renderFilterIcon(h: CreateElement, { col }: { col: PrimaryTableCol<TableRowData>; colIndex: number }) {
    if (!col.filter || (col.filter && !Object.keys(col.filter).length)) return null;
    const defaultFilterIcon = t(global.value.filterIcon) || <FilterIcon />;
    return (
      <Popup
        visible={filterPopupVisible.value[col.colKey]}
        trigger="click"
        placement="bottom"
        showArrow
        overlayClassName={tableFilterClasses.popup}
        on={{
          'visible-change': (val: boolean) => onFilterPopupVisibleChange(val, col.colKey),
        }}
        class={[tableFilterClasses.icon, { [isFocusClass]: !isEmpty(tFilterValue.value?.[col.colKey]) }]}
        content={() => (
          <div class={tableFilterClasses.popupContent}>
            {getFilterContent(h, col)}
            {getBottomButtons(h, col)}
          </div>
        )}
      >
        <div>{renderTNode('filterIcon', defaultFilterIcon)}</div>
      </Popup>
    );
  }

  return {
    hasEmptyCondition,
    renderFilterIcon,
    renderFirstFilterRow,
  };
}
