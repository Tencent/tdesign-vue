import {
  SetupContext, ref, computed, toRefs, watch,
} from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import { RemoveOptions, TdTreeSelectProps, TreeSelectValue } from './type';
import { TreeProps, TreeInstanceFunctions, TreeNodeValue } from '../tree';
import { usePrefixClass, useConfig } from '../hooks/useConfig';
import useFormDisabled from '../hooks/useFormDisabled';
import { TreeOptionData, TreeKeysType } from '../common';
import useVModel from '../hooks/useVModel';
import useDefaultValue from '../hooks/useDefaultValue';
import { SelectInputProps } from '../select-input';
import { getNodeDataByValue } from './utils';

const DEFAULT_KEYS = {
  label: 'label',
  value: 'value',
  children: 'children',
};

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
    props.defaultInputValue || '',
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

  const inputPlaceholder = computed(() => {
    let label = nodeInfo.value?.[tKeys.value.label];
    if (typeof label === 'number') label = String(label);
    return (innerVisible.value && label) || props.placeholder || global.value.placeholder;
  });

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
    () => [...props.data],
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
        const finalValue = typeof item === 'object' ? item.value : item;
        return (
          treeRef.value.getItem(finalValue)?.data || {
            [tKeys.value.label]: finalValue,
            [tKeys.value.value]: finalValue,
          }
        );
      });
    }
    const onlyValues = list.map((item) => (typeof item === 'object' ? item[tKeys.value.value] : item));
    return getNodeDataByValue(onlyValues, props.data, tKeys.value);
  }

  // single tree select node info
  function getSingleNodeInfo(): TreeOptionData {
    const { value } = treeSelectValue;
    if (value === '' || value === undefined || value === null) {
      return undefined;
    }
    const oneValue = Array.isArray(value) ? value[0] : value;
    const finalValue = typeof oneValue === 'object' ? oneValue.value : oneValue;
    if (treeRef.value) {
      return (
        treeRef.value.getItem(finalValue)?.data || {
          [tKeys.value.label]: finalValue,
          [tKeys.value.value]: finalValue,
        }
      );
    }
    return getNodeDataByValue([finalValue], props.data, tKeys.value)[0];
  }

  // clear all value
  const clear: SelectInputProps['onClear'] = ({ e }) => {
    const defaultValue: TreeSelectValue = props.multiple ? [] : undefined;
    setTreeSelectValue(defaultValue, {
      e,
      node: null,
      data: null,
      trigger: 'clear',
    });
    props.onClear?.({ e });
    context.emit('clear', { e });
    // close popup after clear
    setInnerVisible(false, { e, trigger: 'clear' });
  };

  // only for multiple tree select
  const treeNodeChange: TreeProps['onChange'] = (value, ctx) => {
    if (!props.multiple) return;
    let current: TreeSelectValue = value;
    if (isObjectValue.value) {
      current = value.map((nodeValue) => treeRef.value.getItem(nodeValue));
    }
    const tmpValue = Array.isArray(treeSelectValue.value) ? treeSelectValue.value : [treeSelectValue.value];
    setTreeSelectValue(current, {
      ...ctx,
      data: ctx.node.data,
      trigger: value.length > tmpValue.length ? 'check' : 'uncheck',
    });
    innerInputValue.value && setInnerInputValue('', { trigger: 'change', e: ctx.e });
  };

  // only for single tree select
  const treeNodeActive: TreeProps['onActive'] = (value, ctx) => {
    if (props.multiple) return;
    if (treeSelectValue.value === ctx.node.data[tKeys.value.value]) {
      return;
    }
    const onlyLeafNode = Boolean(
      !props.multiple
        && props.treeProps?.valueMode === 'onlyLeaf'
        && Array.isArray(ctx.node?.data?.children)
        && ctx.node?.data?.children?.length,
    );
    let current: TreeSelectValue = value;
    const nodeValue = Array.isArray(value) ? value[0] : value;
    current = isObjectValue.value ? treeRef.value.getItem(nodeValue) : nodeValue;
    if (!onlyLeafNode) {
      setTreeSelectValue(current, { ...ctx, data: ctx.node.data, trigger: 'check' });
      setInnerVisible(false, {
        e: ctx.e,
        trigger: 'trigger-element-click',
      });
    }
    innerInputValue.value && setInnerInputValue('', { trigger: 'change', e: ctx.e });
  };

  // label could be used as TNode, then use text to filter
  const defaultFilterFunction: TreeProps['filter'] = (node) => {
    const label = node.data[tKeys.value.label];
    const searchLabel = isFunction(label) ? node.data.text : label || node.data.text;
    return searchLabel?.indexOf(innerInputValue.value) >= 0;
  };

  // filterable - 内置过滤规则； filter - 自定义过滤规则；filterable + onSearch 远程过滤
  const filterByText = computed<TreeProps['filter'] | undefined>(() => {
    if (props.onSearch || context.listeners.search) return;
    if ((props.filter || props.filterable) && innerInputValue.value && !context.listeners.search) {
      return props.filter ? (node) => props.filter(innerInputValue.value, node) : (node) => defaultFilterFunction(node);
    }
    return undefined;
  });

  const inputChange: SelectInputProps['onInputChange'] = (value = '', ctx) => {
    if (value === innerInputValue.value) return;
    setInnerInputValue(value, ctx);
    if (context.listeners.search || props.onSearch) {
      props.onSearch?.(value, { e: ctx.e });
      context.emit('search', value);
    }
  };

  const onInnerPopupVisibleChange: SelectInputProps['onPopupVisibleChange'] = (state, ctx) => {
    setInnerVisible(state, ctx);
    if (state) {
      treeRerender();
    }
    if (!state && innerInputValue.value) {
      setInnerInputValue('', { trigger: 'blur', e: ctx.e });
    }
  };

  // multiple tree select
  const tagChange: SelectInputProps['onTagChange'] = (_, ctx) => {
    const { trigger, index } = ctx;
    const fitTrigger = trigger === 'tag-remove' || trigger === 'backspace';
    if (!fitTrigger) return;
    // handle remove event
    const current = treeSelectValue.value[index];
    const currentDeleteValue = typeof current === 'object' ? current[tKeys.value.value] : current;
    const currentNode = treeRef.value?.getItem(currentDeleteValue);
    const data = currentNode ? currentNode.data : getNodeDataByValue([currentDeleteValue], props.data, tKeys.value)[0];
    if (fitTrigger) {
      const removeParams: RemoveOptions = {
        value: currentDeleteValue,
        data,
        node: currentNode,
        trigger: fitTrigger ? trigger : undefined,
        index,
        e: ctx.e,
      };
      props.onRemove?.(removeParams);
      context.emit('remove', removeParams);
    }

    // handle multiple tree select change event
    if (Array.isArray(treeSelectValue.value)) {
      const newValue = [...treeSelectValue.value];
      newValue.splice(index, 1);
      setTreeSelectValue(newValue, {
        node: currentNode,
        data,
        index,
        e: ctx.e,
        trigger: fitTrigger ? trigger : undefined,
      });
    }
    innerInputValue.value && setInnerInputValue('', { trigger: 'change', e: ctx.e });
  };

  const onInnerFocus: SelectInputProps['onFocus'] = (_, ctx) => {
    props.onFocus?.({ value: treeSelectValue.value, e: ctx.e });
    context.emit('focus', { value: treeSelectValue.value, e: ctx.e });
  };

  const onInnerBlur: SelectInputProps['onBlur'] = (_, ctx) => {
    props.onBlur?.({ value: treeSelectValue.value, ...ctx });
    context.emit('blur', { value: treeSelectValue.value, ...ctx });
  };

  const onInnerEnter: SelectInputProps['onEnter'] = (_, ctx) => {
    const enterParams = {
      value: treeSelectValue.value,
      inputValue: ctx.inputValue,
      e: ctx.e,
    };
    props.onEnter?.(enterParams);
    context.emit('enter', enterParams);
    props.onSearch?.(ctx.inputValue, { e: ctx.e });
    context.emit('search', ctx.inputValue, { e: ctx.e });
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
    multipleChecked,
    singleActivated,
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
    onInnerFocus,
    onInnerBlur,
    onInnerEnter,
  };
}
