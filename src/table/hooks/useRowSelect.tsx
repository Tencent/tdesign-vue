// 行选中相关功能：单选 + 多选
import {
  computed, toRefs, h, ref, watch,
} from '@vue/composition-api';
import { CreateElement } from 'vue';
import { get, intersection, isFunction } from 'lodash-es';
import useDefaultValue from '../../hooks/useDefaultValue';
import {
  ActiveRowActionContext,
  PrimaryTableCellParams,
  PrimaryTableCol,
  RowClassNameParams,
  TableRowData,
  TdPrimaryTableProps,
} from '../type';
import { isRowSelectedDisabled } from '../../_common/js/table/utils';
import { TableClassName } from './useClassName';
import Checkbox from '../../checkbox';
import Radio from '../../radio';
import { ClassName } from '../../common';
import log from '../../_common/js/log';

export default function useRowSelect(
  props: TdPrimaryTableProps,
  tableSelectedClasses: TableClassName['tableSelectedClasses'],
) {
  const {
    selectedRowKeys, columns, data, rowKey, reserveSelectedRowOnPaginate,
  } = toRefs(props);
  const currentPaginateData = ref<TableRowData[]>(data.value);
  const selectedRowClassNames = ref();
  const [tSelectedRowKeys, setTSelectedRowKeys] = useDefaultValue(
    selectedRowKeys,
    props.defaultSelectedRowKeys || [],
    props.onSelectChange,
    'selectedRowKeys',
    'select-change',
  );
  const selectedRowDataMap = ref(new Map<string | number, TableRowData>());
  const selectColumn = computed(() => props.columns.find(({ type }) => ['multiple', 'single'].includes(type)));
  const canSelectedRows = computed(() => {
    const currentData = reserveSelectedRowOnPaginate.value ? data.value : currentPaginateData.value;
    return currentData.filter((row, rowIndex): boolean => !isDisabled(row, rowIndex));
  });
  // 选中的行，和所有可以选择的行，交集，用于计算 isSelectedAll 和 isIndeterminate
  const intersectionKeys = computed(() => intersection(
    tSelectedRowKeys.value,
    canSelectedRows.value.map((t) => get(t, props.rowKey || 'id')),
  ));

  const allowUncheck = computed(() => {
    const singleSelectCol = columns.value.find((col) => col.type === 'single');
    if (!singleSelectCol || !singleSelectCol.checkProps || !('allowUncheck' in singleSelectCol.checkProps)) return false;
    return singleSelectCol.checkProps.allowUncheck;
  });

  watch(
    [data, columns, tSelectedRowKeys, selectColumn, rowKey],
    () => {
      const disabledRowFunc = (p: RowClassNameParams<TableRowData>): ClassName => selectColumn.value.disabled(p) ? tableSelectedClasses.disabled : '';
      const disabledRowClass = selectColumn.value?.disabled ? disabledRowFunc : undefined;
      const selected = new Set(tSelectedRowKeys.value);
      const selectedRowClassFunc = ({ row }: RowClassNameParams<TableRowData>) => {
        const rowId = get(row, props.rowKey || 'id');
        return selected.has(rowId) ? tableSelectedClasses.selected : '';
      };
      const selectedRowClass = selected.size ? selectedRowClassFunc : undefined;
      selectedRowClassNames.value = [disabledRowClass, selectedRowClass].filter((v) => v);
    },
    { immediate: true },
  );

  function isDisabled(row: Record<string, any>, rowIndex: number): boolean {
    return isRowSelectedDisabled(selectColumn.value, row, rowIndex);
  }

  // eslint-disable-next-line
  function getSelectedHeader(h: CreateElement) {
    // 判断条件直接写在jsx中，防止变量被computed捕获，选中行重新计算了columns
    return () => (
      <Checkbox
        checked={
          intersectionKeys.value.length !== 0
          && canSelectedRows.value.length !== 0
          && intersectionKeys.value.length === canSelectedRows.value.length
        }
        indeterminate={
          intersectionKeys.value.length > 0 && intersectionKeys.value.length < canSelectedRows.value.length
        }
        disabled={!canSelectedRows.value.length}
        {...{ on: { change: handleSelectAll } }}
      />
    );
  }

  function getRowSelectDisabledData(p: PrimaryTableCellParams<TableRowData>) {
    const { col, row, rowIndex } = p;
    const disabled: boolean = typeof col.disabled === 'function' ? col.disabled({ row, rowIndex }) : col.disabled;
    const checkProps = isFunction(col.checkProps) ? col.checkProps({ row, rowIndex }) : col.checkProps;
    return {
      disabled: disabled || checkProps?.disabled,
      checkProps,
    };
  }

  // eslint-disable-next-line
  function renderSelectCell(h: CreateElement, p: PrimaryTableCellParams<TableRowData>) {
    const { col: column, row = {} } = p;
    const checked = tSelectedRowKeys.value.includes(get(row, props.rowKey || 'id'));
    const { disabled, checkProps } = getRowSelectDisabledData(p);
    const selectBoxProps = {
      props: {
        checked,
        disabled,
        ...checkProps,
      },
      on: {
        click: ({ e }: { e: MouseEvent }) => {
          // 选中行功能中，点击 checkbox/radio 需阻止事件冒泡，避免触发不必要的 onRowClick
          e?.stopPropagation();
        },
        // radio 单选框可再点击一次关闭选择，input / change 事件无法监听
        change: () => handleSelectChange(row),
      },
    };
    if (column.type === 'single') return <Radio {...selectBoxProps} />;
    if (column.type === 'multiple') {
      const isIndeterminate = props.indeterminateSelectedRowKeys?.length
        ? props.indeterminateSelectedRowKeys.includes(get(row, props.rowKey))
        : false;
      return <Checkbox indeterminate={isIndeterminate} {...selectBoxProps} />;
    }
    return null;
  }

  function handleSelectChange(row: TableRowData = {}) {
    let selectedRowKeys = [...tSelectedRowKeys.value];
    const reRowKey = props.rowKey || 'id';
    const id = get(row, reRowKey);
    const selectedRowIndex = selectedRowKeys.indexOf(id);
    const isExisted = selectedRowIndex !== -1;
    if (selectColumn.value.type === 'multiple') {
      isExisted ? selectedRowKeys.splice(selectedRowIndex, 1) : selectedRowKeys.push(id);
    } else if (selectColumn.value.type === 'single') {
      selectedRowKeys = isExisted && allowUncheck.value ? [] : [id];
    } else {
      log.warn('Table', '`column.type` must be one of `multiple` and `single`');
      return;
    }
    setTSelectedRowKeys(selectedRowKeys, {
      selectedRowData: selectedRowKeys.map((t) => selectedRowDataMap.value.get(t)).filter((rowData) => !!rowData),
      currentRowKey: id,
      currentRowData: row,
      type: isExisted ? 'uncheck' : 'check',
    });
  }

  function handleSelectAll(checked: boolean) {
    const reRowKey = props.rowKey || 'id';
    const canSelectedRowKeys = canSelectedRows.value.map((record) => get(record, reRowKey));
    const disabledSelectedRowKeys = selectedRowKeys.value?.filter((id) => !canSelectedRowKeys.includes(id)) || [];
    const allIds = checked ? [...disabledSelectedRowKeys, ...canSelectedRowKeys] : [...disabledSelectedRowKeys];
    setTSelectedRowKeys(allIds, {
      selectedRowData: checked ? allIds.map((t) => selectedRowDataMap.value.get(t)) : [],
      type: checked ? 'check' : 'uncheck',
      currentRowKey: 'CHECK_ALL_BOX',
    });
  }

  function formatToRowSelectColumn(col: PrimaryTableCol) {
    const isSelection = ['multiple', 'single'].includes(col.type);
    if (!isSelection) return col;
    return {
      ...col,
      width: col.width || 64,
      className: [tableSelectedClasses.checkCell, col.className],
      cell: (h: CreateElement, p: PrimaryTableCellParams<TableRowData>) => renderSelectCell(h, p),
      title: col.type === 'multiple' ? getSelectedHeader(h) : col.title,
    };
  }

  const onInnerSelectRowClick: TdPrimaryTableProps['onRowClick'] = ({ row, index }) => {
    const selectedColIndex = props.columns.findIndex((item) => item.colKey === 'row-select');
    if (selectedColIndex === -1) return;
    const { disabled } = getRowSelectDisabledData({
      row,
      rowIndex: index,
      col: props.columns[selectedColIndex],
      colIndex: selectedColIndex,
    });
    if (disabled) return;
    handleSelectChange(row);
  };

  watch(
    [data, rowKey],
    () => {
      for (let i = 0, len = data.value.length; i < len; i++) {
        selectedRowDataMap.value.set(get(data.value[i], rowKey.value || 'id'), data.value[i]);
      }
    },
    { immediate: true },
  );

  // 是否开启了行选中功能
  const showRowSelect = computed(() => !!selectColumn.value);

  const clearAllSelectedRowKeys = () => {
    setTSelectedRowKeys([], {
      selectedRowData: [],
      currentRowKey: undefined,
      currentRowData: undefined,
      type: 'uncheck',
    });
  };

  const handleRowSelectWithAreaSelection = ({ activeRowList, action }: ActiveRowActionContext<TableRowData>) => {
    if (!showRowSelect.value) return;

    if (action === 'clear') {
      clearAllSelectedRowKeys();
      return;
    }

    if (selectColumn.value?.type === 'single') {
      if (action === 'space-one-selection') {
        handleSelectChange(activeRowList[0].row);
      }
      return;
    }

    const validAreaSelection = activeRowList.filter(
      ({ row, rowIndex }) => !getRowSelectDisabledData({
        row,
        rowIndex,
        col: selectColumn.value,
        colIndex: undefined,
      }).disabled,
    );
    if (!validAreaSelection.length) return;

    const areaSelectionKeys = validAreaSelection.map(({ row }) => get(row, props.rowKey));
    const intersectionKeys = intersection(tSelectedRowKeys.value, areaSelectionKeys);
    const toCheck = intersectionKeys.length !== areaSelectionKeys.length;
    const clearedKeys = tSelectedRowKeys.value.filter((key) => !areaSelectionKeys.includes(key));
    const newSelectedRowKeys = toCheck ? [...new Set(tSelectedRowKeys.value.concat(areaSelectionKeys))] : clearedKeys;

    const currentRowData = action === 'space-one-selection' ? activeRowList[0].row : undefined;
    setTSelectedRowKeys(newSelectedRowKeys, {
      selectedRowData: activeRowList,
      currentRowKey: get(currentRowData, props.rowKey),
      currentRowData,
      type: toCheck ? 'check' : 'uncheck',
    });
  };

  return {
    selectColumn,
    showRowSelect,
    selectedRowClassNames,
    currentPaginateData,
    setTSelectedRowKeys,
    formatToRowSelectColumn,
    onInnerSelectRowClick,
    handleRowSelectWithAreaSelection,
  };
}
