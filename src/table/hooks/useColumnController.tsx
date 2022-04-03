/**
 * 自定义显示列控制器，即列配置
 */
import {
  computed, ref, SetupContext, toRefs, h, watch,
} from '@vue/composition-api';
import { SettingIcon } from 'tdesign-icons-vue';
import intersection from 'lodash/intersection';
import { CreateElement } from 'vue';
import Checkbox, {
  CheckboxGroup, CheckboxGroupValue, CheckboxOptionObj, CheckboxGroupChangeContext,
} from '../../checkbox';
import { DialogPlugin } from '../../dialog/plugin';
import { useTNodeDefault } from '../../hooks/tnode';
import { renderTitle } from './useTableHeader';
import {
  PrimaryTableCol, TdPrimaryTableProps, PrimaryTableColumnChange, TableRowData,
} from '../type';
import { useConfig } from '../../config-provider/useConfig';

import useDefaultValue from '../../hooks/useDefaultValue';
import { getCurrentRowByKey } from '../utils';

export function getColumnKeys(columns: PrimaryTableCol[], keys: string[] = []) {
  for (let i = 0, len = columns.length; i < len; i++) {
    const col = columns[i];
    col.colKey && keys.push(col.colKey);
    if (col.children?.length) {
      // eslint-disable-next-line no-param-reassign
      keys = keys.concat(getColumnKeys(col.children, [...keys]));
    }
  }
  return keys;
}

export default function useColumnController(props: TdPrimaryTableProps, context: SetupContext) {
  const renderTNode = useTNodeDefault();
  const { classPrefix } = useConfig();
  const { columns, columnController, displayColumns } = toRefs(props);

  const enabledColKeys = computed(() => {
    const arr = (columnController.value?.fields || [...new Set(getColumnKeys(columns.value))] || []).filter((v) => v);
    return new Set(arr);
  });

  const keys = [...new Set(getColumnKeys(columns.value))];

  // 确认后的列配置
  const [tDisplayColumns, setTDisplayColumns] = useDefaultValue(
    displayColumns,
    props.defaultDisplayColumns || keys,
    props.onDisplayColumnsChange,
    'displayColumns',
    'display-columns-change',
  );
  // 弹框内的多选
  const columnCheckboxKeys = ref<CheckboxGroupValue>(displayColumns.value || props.defaultDisplayColumns || keys);

  const checkboxOptions = computed<CheckboxOptionObj[]>(() => getCheckboxOptions(columns.value));

  const intersectionChecked = computed(() => intersection(columnCheckboxKeys.value, [...enabledColKeys.value]));

  watch([displayColumns], ([val]) => {
    columnCheckboxKeys.value = val;
  });

  function getCheckboxOptions(columns: PrimaryTableCol[], arr: CheckboxOptionObj[] = []) {
    // 减少循环次数
    for (let i = 0, len = columns.length; i < len; i++) {
      const item = columns[i];
      if (item.colKey) {
        arr.push({
          label: () => renderTitle(h, context.slots, item, i),
          value: item.colKey,
          disabled: !enabledColKeys.value.has(item.colKey),
        });
      }
      if (item.children?.length) {
        getCheckboxOptions(item.children, arr);
      }
    }
    return arr;
  }

  const handleCheckChange = (val: CheckboxGroupValue, ctx: CheckboxGroupChangeContext) => {
    columnCheckboxKeys.value = val;
    const params = {
      columns: val,
      type: ctx.type,
      currentColumn: getCurrentRowByKey(columns.value, String(ctx.current)),
      e: ctx.e,
    };
    props.onColumnChange?.(params);
    // Vue3 ignore next line
    context.emit('column-change', params);
  };

  const handleClickAllShowColumns = (checked: boolean, ctx: { e: Event }) => {
    if (checked) {
      const newData = columns.value?.map((t) => t.colKey) || [];
      columnCheckboxKeys.value = newData;
      const params: PrimaryTableColumnChange<TableRowData> = { type: 'check', columns: newData, e: ctx.e };
      props.onColumnChange?.(params);
      // Vue3 ignore next line
      context.emit('column-change', params);
    } else {
      const disabledColKeys = checkboxOptions.value.filter((t) => t.disabled).map((t) => t.value);
      columnCheckboxKeys.value = disabledColKeys;
      const params: PrimaryTableColumnChange<TableRowData> = { type: 'uncheck', columns: disabledColKeys, e: ctx.e };
      props.onColumnChange?.(params);
      // Vue3 ignore next line
      context.emit('column-change', params);
    }
  };

  const handleToggleColumnController = () => {
    const dialogInstance = DialogPlugin.confirm({
      header: '表格列配置',
      // eslint-disable-next-line
      body: (h: CreateElement) => {
        const widthMode = columnController.value?.displayType === 'fixed-width' ? 'fixed' : 'auto';
        const checkedLength = intersectionChecked.value.length;
        const isCheckedAll = checkedLength === enabledColKeys.value.size;
        const isIndeterminate = checkedLength > 0 && checkedLength < enabledColKeys.value.size;
        const prefix = classPrefix.value;
        const defaultNode = (
          <div class={[`${prefix}-table__column-controller`, `${prefix}-table__column-controller--${widthMode}`]}>
            <div class={`${prefix}-table__column-controller-body`}>
              <p class={`${prefix}-table__column-controller-desc`}>请选择需要在表格中显示的数据列</p>
              <div class={`${prefix}-table__column-controller-block`}>
                <Checkbox indeterminate={isIndeterminate} checked={isCheckedAll} onChange={handleClickAllShowColumns}>
                  全选
                </Checkbox>
              </div>
              <div class={`${prefix}-table__column-controller-block`}>
                <CheckboxGroup
                  options={checkboxOptions.value}
                  props={columnController.value?.checkboxProps}
                  value={columnCheckboxKeys.value}
                  onChange={handleCheckChange}
                />
              </div>
            </div>
          </div>
        );
        return renderTNode('columnControllerContent', defaultNode);
      },
      confirmBtn: '确认',
      cancelBtn: '取消',
      width: 612,
      onConfirm: () => {
        setTDisplayColumns([...columnCheckboxKeys.value]);
        dialogInstance.hide();
      },
      onClose: () => {
        dialogInstance.hide();
      },
      ...(columnController.value?.dialogProps || {}),
    });
  };

  // eslint-disable-next-line
  const renderColumnController = (h: CreateElement) => {
    return (
      <div class={`${classPrefix.value}-table__column-controller`}>
        <t-button theme="default" variant="outline" onClick={handleToggleColumnController}>
          <SettingIcon slot="icon" />
          列配置
        </t-button>
      </div>
    );
  };

  return {
    tDisplayColumns,
    columnCheckboxKeys,
    checkboxOptions,
    renderColumnController,
  };
}
