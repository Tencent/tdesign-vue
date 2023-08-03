import {
  defineComponent, provide, computed, watchEffect, ref, toRefs, watch, nextTick, onMounted, VNode,
} from 'vue';
import intersection from 'lodash/intersection';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import Checkbox from './checkbox';
import props from './checkbox-group-props';
import { CheckboxOptionObj, TdCheckboxProps, CheckboxGroupValue } from './type';
import { CheckboxGroupInjectionKey } from './constants';
import { usePrefixClass, useVModel, useChildComponentSlots } from '../hooks';
import { getCheckboxStore } from './store';

export default defineComponent({
  name: 'TCheckboxGroup',

  props,

  setup(props) {
    /** 样式 */
    const COMPONENT_NAME = usePrefixClass('checkbox-group');
    const date = new Date();
    const storeKey = [
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getUTCMilliseconds(),
    ].join('_');
    const checkboxStore = getCheckboxStore(storeKey);
    checkboxStore.init();

    const { isArray } = Array;
    const { value, disabled, name } = toRefs(props);
    const [innerValue, setInnerValue] = useVModel(value, props.defaultValue, props.onChange);

    const optionList = ref<Array<CheckboxOptionObj>>([]);

    const intersectionLen = computed<number>(() => {
      if (!isArray(innerValue.value)) return 0;
      const values = optionList.value.map((item) => item.value);
      const n = intersection(innerValue.value, values);
      return n.length;
    });

    const isCheckAll = computed<boolean>(() => {
      const optionItems = optionList.value.filter((item) => !item.disabled && !item.checkAll).map((t) => t.value);
      const intersectionValues = intersection(optionItems, innerValue.value);
      return intersectionValues.length === optionItems.length;
    });

    const indeterminate = computed<boolean>(
      () => !isCheckAll.value && intersectionLen.value < optionList.value.length && intersectionLen.value !== 0,
    );

    const maxExceeded = computed<boolean>(() => !isUndefined(props.max) && innerValue.value.length === props.max);

    watch([disabled, maxExceeded, name], ([disabled, maxExceeded, checkboxName]) => {
      checkboxStore.updateCheckbox({ disabled, maxExceeded, checkboxName });
    });

    onMounted(() => {
      checkboxStore.updateCheckbox({
        disabled: disabled.value,
        maxExceeded: maxExceeded.value,
        checkboxName: name.value,
      });
    });

    watchEffect(() => {
      if (!props.options) return [];
      optionList.value = props.options.map((item) => (isObject(item) ? item : { label: String(item), value: item }));
    });

    const getAllCheckboxValue = (): CheckboxGroupValue => {
      const val = new Set<TdCheckboxProps['value']>();
      for (let i = 0, len = optionList.value.length; i < len; i++) {
        const item = optionList.value[i];
        if (item.checkAll) continue;
        if (item.disabled) continue;
        val.add(item.value);
        if (maxExceeded.value) break;
      }
      return [...val];
    };

    const onCheckAllChange = (checked: boolean, context: { e: Event; source?: 't-checkbox' }) => {
      const value: CheckboxGroupValue = checked ? getAllCheckboxValue() : [];
      setInnerValue(value, {
        e: context.e,
        type: checked ? 'check' : 'uncheck',
        current: undefined,
        option: undefined,
      });
    };

    const handleCheckboxChange = (data: { checked: boolean; e: Event; option: TdCheckboxProps }) => {
      const currentValue = data.option.value;
      if (!isArray(innerValue.value)) {
        console.warn(`TDesign CheckboxGroup Warn: \`value\` must be an array, instead of ${typeof innerValue.value}`);
        return;
      }
      const val = [...innerValue.value];
      if (data.checked) {
        val.push(currentValue);
      } else {
        const i = val.indexOf(currentValue);
        val.splice(i, 1);
      }
      setInnerValue(val, {
        e: data.e,
        current: data.option.value,
        option: data.option,
        type: data.checked ? 'check' : 'uncheck',
      });
    };

    const onCheckedChange = (p: { checked: boolean; checkAll: boolean; e: Event; option: TdCheckboxProps }) => {
      const { checked, checkAll, e } = p;
      if (checkAll) {
        onCheckAllChange(checked, { e });
      } else {
        handleCheckboxChange(p);
      }
    };

    const getChildComponentSlots = useChildComponentSlots();

    const getOptionListBySlots = () => {
      const nodes = getChildComponentSlots('Checkbox');
      const arr: Array<CheckboxOptionObj> = [];
      nodes?.forEach((node) => {
        const option = node.componentOptions.propsData as CheckboxOptionObj;
        if (!option) return;
        if (option['check-all'] === '' || option['check-all'] === true) {
          option.checkAll = true;
        }
        arr.push(option);
      });
      return arr;
    };

    /**
     * do not use provide/inject variables. it will cause performance problems.
     * using store.ts for variables instead.
     * 请勿使用 provide/inject 提供变量数据传递，如：name/isCheckAll/checkedValues/disabled/maxExceeded/indeterminate，这位造成组件性能问题。
     */
    provide(
      CheckboxGroupInjectionKey,
      computed(() => ({
        handleCheckboxChange,
        onCheckedChange,
      })),
    );

    watch(
      [innerValue, isCheckAll, indeterminate],
      ([val, isCheckAll, indeterminate], [oldValue]) => {
        nextTick(() => {
          checkboxStore.updateChecked({
            checked: val,
            oldChecked: oldValue,
            isCheckAll,
            indeterminate,
          });
        });
      },
      { immediate: true },
    );

    const addStoreKeyToCheckbox = (nodes: VNode[]) => {
      for (let i = 0, len = nodes.length; i < len; i++) {
        const vNode = nodes[i];
        if (vNode.componentOptions && /TCheckbox/.test(vNode.tag)) {
          (vNode.componentOptions.propsData as any).storeKey = storeKey;
        }
        if (vNode.children?.length) {
          addStoreKeyToCheckbox(vNode.children);
        }
      }
    };

    return {
      storeKey,
      optionList,
      innerValue,
      COMPONENT_NAME,
      getOptionListBySlots,
      addStoreKeyToCheckbox,
    };
  },

  render() {
    let children = null;
    if (this.options?.length) {
      children = this.optionList?.map((option, index) => (
        <Checkbox
          // @ts-ignore
          key={option.value ?? index}
          lazyLoad={this.lazyLoad}
          props={option}
          index={index}
          data={option}
          checked={this.innerValue?.includes(option.value) || false}
          storeKey={this.storeKey}
          scopedSlots={this.$scopedSlots}
        ></Checkbox>
      ));
    } else {
      const nodes = this.$scopedSlots.default?.(null);
      this.optionList = this.getOptionListBySlots();
      this.addStoreKeyToCheckbox(nodes);
      children = nodes;
    }
    return (
      <div class={this.COMPONENT_NAME} role="group" aria-label="checkbox-group">
        {children}
      </div>
    );
  },
});
