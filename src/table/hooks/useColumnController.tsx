/**
 * 自定义显示列控制器，即列配置
 */
import {
  computed, ref, SetupContext, toRefs, watch,
} from '@vue/composition-api';
import { SettingIcon } from 'tdesign-icons-vue';
import intersection from 'lodash/intersection';
import { CreateElement } from 'vue';
import Checkbox, { CheckboxGroup, CheckboxGroupValue, CheckboxOptionObj } from '../../checkbox';
import { prefix } from '../../config';
import { DialogPlugin } from '../../dialog/plugin';
import { useTNodeDefault } from '../../hooks/tnode';
import { renderTitle } from './useTableHeader';
import { TdPrimaryTableProps } from '../type';

export default function useColumnController(props: TdPrimaryTableProps, context: SetupContext) {
  const renderTNode = useTNodeDefault();
  const { columns, columnController } = toRefs(props);

  const enabledColKeys = computed(() => {
    const arr = (columnController.value?.fields || columns.value?.map((t) => t.colKey) || []).filter((v) => v);
    return new Set(arr);
  });

  // 确认后的列配置
  const displayColumnKeys = ref<CheckboxGroupValue>([]);
  // 弹框内的多选
  const columnCheckboxKeys = ref<CheckboxGroupValue>([]);

  const checkboxOptions = computed<CheckboxOptionObj[]>(() => {
    const arr: CheckboxOptionObj[] = [];
    // 减少循环次数
    for (let i = 0, len = columns.value.length; i < len; i++) {
      const item = columns.value[i];
      if (item.colKey) {
        arr.push({
          label: () => renderTitle(context.slots, item, i),
          value: item.colKey,
          disabled: !enabledColKeys.value.has(item.colKey),
        });
      }
    }
    return arr;
  });

  const intersectionChecked = computed(() => intersection(columnCheckboxKeys.value, [...enabledColKeys.value]));

  const handleCheckChange = (val: CheckboxGroupValue) => {
    columnCheckboxKeys.value = val;
    // type: 'check', // currentColumn: 0,
    const params = { columns: val };
    props.onColumnChange?.(params);
    // Vue3 ignore next linet
    context.emit('column-change', params);
  };

  const handleClickAllShowColumns = (checked: boolean) => {
    if (checked) {
      const newData = columns.value?.map((t) => t.colKey) || [];
      columnCheckboxKeys.value = newData;
      props.onColumnChange?.({ type: 'check', columns: newData });
      // Vue3 ignore next linet
      context.emit('column-change', { type: 'check', columns: newData });
    } else {
      const disabledColKeys = checkboxOptions.value.filter((t) => t.disabled).map((t) => t.value);
      columnCheckboxKeys.value = disabledColKeys;
      props.onColumnChange?.({ type: 'uncheck', columns: disabledColKeys });
      // Vue3 ignore next linet
      context.emit('column-change', { type: 'uncheck', columns: disabledColKeys });
    }
  };

  watch(
    [props.columns],
    ([val]) => {
      const keys = val.map((t) => t.colKey);
      displayColumnKeys.value = keys;
      columnCheckboxKeys.value = keys;
    },
    { immediate: true },
  );

  const handleToggleColumnController = () => {
    const dialogInstance = DialogPlugin.confirm({
      header: '表格列配置',
      // eslint-disable-next-line
      body: (h: CreateElement) => {
        const widthMode = columnController.value?.displayType === 'fixed-width' ? 'fixed' : 'auto';
        const checkedLength = intersectionChecked.value.length;
        const isCheckedAll = checkedLength === enabledColKeys.value.size;
        const isIndeterminate = checkedLength > 0 && checkedLength < enabledColKeys.value.size;
        const defaultNode = (
          <div class={[`${prefix}-table__column-controller`, `${prefix}-table__column-controller--${widthMode}`]}>
            <div class={`${prefix}-table__column-controller-body`}>
              <p class={`${prefix}-table__column-controller-desc`}>请选择需要在表格中显示的数据列</p>
              <div class={`${prefix}-table__column-controller-block`}>
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isCheckedAll}
                  onChange={handleClickAllShowColumns}
                  {...(columnController.value?.checkboxProps || {})}
                >
                  全选
                </Checkbox>
              </div>
              <div class={`${prefix}-table__column-controller-block`}>
                <CheckboxGroup
                  options={checkboxOptions.value}
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
        displayColumnKeys.value = [...columnCheckboxKeys.value];
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
      <div class={`${prefix}-table__top-content`}>
        <t-button theme="default" variant="outline" onClick={handleToggleColumnController}>
          <SettingIcon slot="icon" />
          列配置
        </t-button>
      </div>
    );
  };

  return {
    displayColumnKeys,
    columnCheckboxKeys,
    checkboxOptions,
    renderColumnController,
  };
}
