import {
  SetupContext, ref, computed, toRefs,
} from '@vue/composition-api';
import { TdTreeSelectProps, TreeSelectValue } from './type';
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
  key: 'key',
  children: 'children',
};

export default function useTreeSelect(props: TdTreeSelectProps, context: SetupContext) {
  const classPrefix = usePrefixClass();
  const { global } = useConfig('treeSelect');

  const { formDisabled } = useFormDisabled();
  const treeRef = ref<TreeInstanceFunctions>(null);

  /**
   * model
   */
  const { value, popupVisible, inputValue } = toRefs(props);

  const [treeSelectValue, setTreeSelectValue] = useVModel(value, props.defaultValue, props.onChange, 'change');

  const [innerVisible, setInnerVisible] = useDefaultValue(
    popupVisible,
    false,
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
    () => (innerVisible.value && nodeInfo.value[tKeys.value.label]) || (props.placeholder ?? global.value.placeholder),
  );

  const popupClass = computed(() => [`${classPrefix.value}-select__dropdown`, 'narrow-scrollbar']);
  const dropdownInnerSize = computed(
    () => ({
      small: 's',
      medium: 'm',
      large: 'l',
    }[props.size]),
  );

  // controlled nodeInfo only decided by treeSelectValue; it will be used to compute singleActivated and multipleChecked
  const nodeInfo = computed<TreeOptionData | TreeOptionData[]>(() => props.multiple ? getMultipleNodeInfo() : getSingleNodeInfo());

  // single tree-select use nodeInfo to compute singleActivated
  const singleActivated = computed(() => {
    if (props.multiple) return undefined;
    if (nodeInfo.value instanceof Array) return nodeInfo.value[0][tKeys.value.value];
    return nodeInfo.value[tKeys.value.value];
  });

  // multiple tree-select: use nodeInfo to compute multipleChecked, because nodeInfo also decided by treeSelectValue
  const multipleChecked = computed((): Array<TreeNodeValue> => {
    if (!props.multiple) return [];
    if (nodeInfo.value instanceof Array) {
      return nodeInfo.value.map((item: TreeOptionData) => item[tKeys.value.value]);
    }
    return [nodeInfo.value[tKeys.value.value]];
  });

  function getMultipleNodeInfo(): TreeOptionData[] {
    const { value } = treeSelectValue;
    const list = Array.isArray(value) ? value : [value];
    return list.map((item) => {
      const finalValue = typeof item === 'object' ? item[tKeys.value.value] : item;
      if (treeRef.value) return treeRef.value.getItem(finalValue);
      return getObjectInfoByValue(item);
    });
  }

  function getSingleNodeInfo(): TreeOptionData {
    const { value } = treeSelectValue;
    const oneValue = Array.isArray(value) ? value[0] : value;
    const finalValue = typeof oneValue === 'object' ? oneValue[tKeys.value.value] : oneValue;
    if (treeRef.value) return treeRef.value.getItem(finalValue);
    return getObjectInfoByValue(oneValue);
  }

  function getObjectInfoByValue(value: TreeSelectValue) {
    if (typeof value === 'object') return value;
    return { [tKeys.value.value]: value, [tKeys.value.label]: value };
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
  const treeNodeChange: TreeProps['onChange'] = () => {
    // console.log(value, context);
    // if (!props.multiple) return;
    // let current: TreeSelectValue = valueParam;
    // if (isObjectValue.value) {
    //   current = valueParam.map((nodeValue) => getTreeNode(props.data, nodeValue));
    // }
    // change(current, context.node, 'check');
  };

  // only for single tree select
  const treeNodeActive: TreeProps['onActive'] = () => {
    // console.log(value, context);
    // // 多选模式屏蔽 Active 事件
    // if (props.multiple) return;
    // setInnerVisible(false, context);
    // // 单选模式重复选择不清空
    // if (treeSelectValue.value === context.node.data[tKeys.value.value]) {
    //   return;
    // }
    // let current: TreeSelectValue = valueParam;
    // if (isObjectValue.value) {
    //   const nodeValue = isEmpty(valueParam) ? '' : valueParam[0];
    //   current = getTreeNode(props.data, nodeValue);
    // } else {
    //   current = isEmpty(valueParam) ? '' : valueParam[0];
    // }
    // change(current, context.node, 'check');
  };

  return {
    classPrefix,
    global,
    tDisabled,
    treeRef,
    tKeys,
    popupClass,
    isObjectValue,
    dropdownInnerSize,
    inputPlaceholder,
    innerVisible,
    treeSelectValue,
    innerInputValue,
    singleActivated,
    multipleChecked,
    clear,
    setInnerVisible,
    setTreeSelectValue,
    setInnerInputValue,
    treeNodeChange,
    treeNodeActive,
  };
}
