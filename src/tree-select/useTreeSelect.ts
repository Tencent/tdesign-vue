import {
  SetupContext, ref, computed, toRefs, watch,
} from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import { RemoveOptions, TdTreeSelectProps, TreeSelectValue } from './type';
import {
  TreeProps, TreeInstanceFunctions, TreeKeysType, TreeNodeValue,
} from '../tree';
import { usePrefixClass, useConfig } from '../hooks/useConfig';
import useFormDisabled from '../hooks/useFormDisabled';
import { TreeOptionData } from '../common';
import useVModel from '../hooks/useVModel';
import useDefaultValue from '../hooks/useDefaultValue';
import { SelectInputProps } from '../select-input';

const DEFAULT_KEYS = {
  label: 'label',
  value: 'value',
  children: 'children',
};

function getNodeDataByValue(
  values: Array<string | number>,
  data: TreeOptionData[],
  keys: TreeKeysType,
  results: TreeOptionData[] = [],
) {
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i];
    const index = values.findIndex((val) => item[keys.value] === val);
    if (index !== -1) {
      results.push(item);
    }
    if (item.children?.length) {
      results.push(...getNodeDataByValue(values, item.children, keys, results));
    }
    if (results.length >= values.length) return results;
  }
  return results || [];
}

export default function useTreeSelect(props: TdTreeSelectProps, context: SetupContext) {
  const classPrefix = usePrefixClass();
  const { global } = useConfig('treeSelect');
  const { formDisabled } = useFormDisabled();
  const treeRef = ref<TreeInstanceFunctions>(null);
  const treeKey = ref(0);

  /**
   * model
   */
  const { value, popupVisible, inputValue } = toRefs(props);

  const [treeSelectValue, setTreeSelectValue] = useVModel(value, props.defaultValue, props.onChange, 'change');

  const [innerVisible, setInnerVisible] = useDefaultValue(
    popupVisible,
    props.defaultPopupVisible,
    props.onPopupVisibleChange,
    'popupVisible',
    'popup-visible-change',
  );

  const [innerInputValue, setInnerInputValue] = useDefaultValue(
    inputValue,
    props.defaultInputValue,
    props.onInputChange,
    'inputValue',
    'input-change',
  );

  /**
   * computed
   */
  const tDisabled = computed(() => formDisabled.value || props.disabled);
  const isObjectValue = computed(() => props.valueType === 'object');

  const tKeys = computed<TreeKeysType>(() => ({ ...DEFAULT_KEYS, ...props.treeProps?.keys, ...props.keys }));

  const inputPlaceholder = computed(
    () => (innerVisible.value && nodeInfo.value?.[tKeys.value.label]) || (props.placeholder ?? global.value.placeholder),
  );

  const popupClass = computed(() => [`${classPrefix.value}-select__dropdown`, 'narrow-scrollbar']);
  const dropdownInnerSize = computed(
    () => ({
      small: 's',
      medium: 'm',
      large: 'l',
    }[props.size]),
  );

  const treeRerender = () => {
    treeKey.value += 1;
  };

  watch(
    () => props.data,
    () => {
      treeRerender();
    },
    { immediate: true, flush: 'post' },
  );

  // controlled nodeInfo only decided by treeSelectValue; it will be used to compute singleActivated and multipleChecked
  const nodeInfo = computed<TreeOptionData | TreeOptionData[]>(() => props.multiple ? getMultipleNodeInfo() : getSingleNodeInfo());

  // single tree-select use nodeInfo to compute singleActivated
  const singleActivated = computed(() => {
    if (props.multiple || !nodeInfo.value) return [];
    if (nodeInfo.value instanceof Array) return [nodeInfo.value[0]?.[tKeys.value.value]];
    return [nodeInfo.value[tKeys.value.value]];
  });

  // multiple tree-select: use nodeInfo to compute multipleChecked, because nodeInfo also decided by treeSelectValue
  const multipleChecked = computed((): Array<TreeNodeValue> => {
    if (!props.multiple || !nodeInfo.value) return [];
    if (nodeInfo.value instanceof Array) {
      return nodeInfo.value.map((item: TreeOptionData) => item[tKeys.value.value]);
    }
    return [nodeInfo.value[tKeys.value.value]];
  });

  // multiple tree select node info list
  function getMultipleNodeInfo(): TreeOptionData[] {
    const { value } = treeSelectValue;
    const list = Array.isArray(value) ? value : [value];
    if (treeRef.value) {
      return list.map((item) => {
        const finalValue = typeof item === 'object' ? item[tKeys.value.value] : item;
        return treeRef.value.getItem(finalValue)?.data;
      });
    }
    const onlyValues = list.map((item) => (typeof item === 'object' ? item[tKeys.value.value] : item));
    return getNodeDataByValue(onlyValues, props.data, tKeys.value);
  }

  // single tree select node info
  function getSingleNodeInfo(): TreeOptionData {
    const { value } = treeSelectValue;
    const oneValue = Array.isArray(value) ? value[0] : value;
    const finalValue = typeof oneValue === 'object' ? oneValue[tKeys.value.value] : oneValue;
    if (treeRef.value) return treeRef.value.getItem(finalValue)?.data;
    return getNodeDataByValue([finalValue], props.data, tKeys.value);
  }

  // clear all value
  const clear: SelectInputProps['onClear'] = ({ e }) => {
    const defaultValue: TreeSelectValue = props.multiple ? [] : undefined;
    setTreeSelectValue(defaultValue, { e, node: undefined, trigger: 'clear' });
    const clearParams = { e };
    props.onClear?.(clearParams);
    context.emit('clear', clearParams);
  };

  // only for multiple tree select
  const treeNodeChange: TreeProps['onChange'] = (value, context) => {
    if (!props.multiple) return;
    let current: TreeSelectValue = value;
    if (isObjectValue.value) {
      current = value.map((nodeValue) => treeRef.value.getItem(nodeValue));
    }
    setTreeSelectValue(current, {
      ...context,
      trigger: context.node.checked ? 'check' : 'uncheck',
    });
  };

  // only for single tree select
  const treeNodeActive: TreeProps['onActive'] = (value, ctx) => {
    if (props.multiple) return;
    if (treeSelectValue.value === ctx.node.data[tKeys.value.value]) {
      return;
    }
    let current: TreeSelectValue = value;
    const nodeValue = Array.isArray(value) ? value[0] : value;
    current = isObjectValue.value ? treeRef.value.getItem(nodeValue) : nodeValue;
    setTreeSelectValue(current, { ...ctx, trigger: 'check' });
    setInnerVisible(false, ctx);
  };

  // label could be used as TNode, then use text to filter
  const defaultFilterFunction: TreeProps['filter'] = (node) => {
    const label = node.data[tKeys.value.label];
    const searchLabel = isFunction(label) ? node.data.text : label || node.data.text;
    return searchLabel?.indexOf(value) >= 0;
  };

  // filterable - 内置过滤规则； filter - 自定义过滤规则；filterable + onSearch 远程过滤
  const filterByText = computed<TreeProps['filter'] | undefined>(() => {
    if ((props.filter || props.filterable) && inputValue.value && !context.listeners.search) {
      return props.filter ? (node) => props.filter(inputValue.value, node.data) : defaultFilterFunction;
    }
    return undefined;
  });

  const inputChange: SelectInputProps['onInputChange'] = (value, ctx) => {
    setInnerInputValue(value, ctx);
    if (context.listeners.search && props.filterable) {
      props.onSearch?.(value);
      context.emit('search', value);
    }
  };

  const onInnerPopupVisibleChange: SelectInputProps['onPopupVisibleChange'] = (state, ctx) => {
    setInnerVisible(state, ctx);
    if (state) {
      treeRerender();
    }
  };

  // multiple tree select
  const tagChange: SelectInputProps['onTagChange'] = (_, ctx) => {
    const { trigger, index } = ctx;
    // handle remove event
    const current = treeSelectValue.value[index];
    const currentDeleteValue = typeof current === 'object' ? current[tKeys.value.value] : current;
    const fitTrigger = trigger === 'tag-remove' || trigger === 'backspace';
    const currentNode = treeRef.value.getItem(currentDeleteValue);
    const removeParams: RemoveOptions = {
      value: currentDeleteValue,
      data: currentNode?.data,
      node: currentNode,
      trigger: fitTrigger ? trigger : undefined,
      index,
      e: ctx.e,
    };
    props.onRemove?.(removeParams);
    context.emit('remove', removeParams);

    // handle multiple tree select change event
    if (Array.isArray(treeSelectValue.value)) {
      treeSelectValue.value.splice(index, 1);
      setTreeSelectValue(treeSelectValue.value, {
        node: currentNode,
        index,
        e: ctx.e,
        trigger: fitTrigger ? trigger : undefined,
      });
    }
  };

  return {
    classPrefix,
    global,
    tDisabled,
    treeRef,
    tKeys,
    treeKey,
    popupClass,
    isObjectValue,
    dropdownInnerSize,
    inputPlaceholder,
    innerVisible,
    nodeInfo,
    treeSelectValue,
    innerInputValue,
    singleActivated,
    multipleChecked,
    clear,
    filterByText,
    setInnerVisible,
    setTreeSelectValue,
    setInnerInputValue,
    treeNodeChange,
    treeNodeActive,
    inputChange,
    tagChange,
    onInnerPopupVisibleChange,
  };
}
