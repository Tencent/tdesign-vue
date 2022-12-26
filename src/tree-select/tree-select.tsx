import {
  defineComponent, ref, computed, watch, onMounted, toRefs,
} from '@vue/composition-api';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';

import Tree, { TreeProps, TreeNodeModel, TreeNodeValue } from '../tree';
import SelectInput from '../select-input';
import { TagInputChangeContext } from '../tag-input';
import { InputValue } from '../input';
import FakeArrow from '../common-components/fake-arrow';
import { PopupVisibleChangeContext } from '../popup';

import { NodeOptions } from './interface';
import { TreeSelectValue, TdTreeSelectProps, TreeSelectValueChangeTrigger } from './type';
import { TreeOptionData } from '../common';
import props from './props';

// hooks
import { usePrefixClass, useConfig } from '../hooks/useConfig';
import useFormDisabled from '../hooks/useFormDisabled';
import { useTNodeJSX, useTNodeDefault } from '../hooks/tnode';
import useVModel from '../hooks/useVModel';
import useDefaultValue from '../hooks/useDefaultValue';

export default defineComponent({
  name: 'TTreeSelect',
  props: { ...props },
  setup(props: TdTreeSelectProps, { emit }) {
    const classPrefix = usePrefixClass();
    const { global } = useConfig('treeSelect');
    const { formDisabled } = useFormDisabled();

    // ref
    const treeRef = ref(null);

    // data
    const filterByText = ref(null);
    const activated = ref([]);
    const expanded = ref([]);
    const nodeInfo = ref(null);
    const treeKey = ref(0);

    // model
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

    // watch
    watch(treeSelectValue, async () => {
      await changeNodeInfo();
      if (!props.multiple) {
        activated.value = nodeInfo.value ? [nodeInfo.value.value] : [];
      }
    });

    watch(
      () => props.data,
      async () => {
        await changeNodeInfo();
        treeRerender();
      },
    );

    // computed
    const tDisabled = computed(() => formDisabled.value || props.disabled);

    const inputPlaceholder = computed(
      () => (innerVisible.value && nodeInfo.value?.label) || props.placeholder || global.value.placeholder,
    );

    const popupClass = computed(() => [`${classPrefix.value}-select__dropdown`, 'narrow-scrollbar']);

    const dropdownInnerSize = computed(
      () => ({
        small: 's',
        medium: 'm',
        large: 'l',
      }[props.size]),
    );

    const isObjectValue = computed(() => props.valueType === 'object');

    const checked = computed((): Array<TreeNodeValue> => {
      if (props.multiple) {
        if (isObjectValue.value) {
          return isArray(treeSelectValue.value)
            ? (treeSelectValue.value as Array<TreeSelectValue>).map((item) => (item as NodeOptions).value)
            : [];
        }
        return isArray(treeSelectValue.value)
          ? (treeSelectValue.value as Array<TreeSelectValue>).map((item) => item as TreeNodeValue)
          : [];
      }
      return [];
    });

    const multiLimitDisabled = computed(
      () => props.multiple
        && !!props.max
        && isArray(treeSelectValue.value)
        && props.max <= (treeSelectValue.value as Array<TreeSelectValue>).length,
    );

    const realLabel = computed(() => {
      if (!isEmpty(props.treeProps) && !isEmpty((props.treeProps as TreeProps).keys)) {
        return (props.treeProps as TreeProps).keys.label || 'label';
      }
      return 'label';
    });

    const realValue = computed(() => {
      if (!isEmpty(props.treeProps) && !isEmpty((props.treeProps as TreeProps).keys)) {
        return (props.treeProps as TreeProps).keys.value || 'value';
      }
      return 'value';
    });

    const realChildren = computed(() => {
      if (!isEmpty(props.treeProps) && !isEmpty((props.treeProps as TreeProps).keys)) {
        return (props.treeProps as TreeProps).keys.children || 'children';
      }
      return 'children';
    });

    onMounted(async () => {
      if (!treeSelectValue.value && props.defaultValue) {
        await change(props.defaultValue, null, 'uncheck');
      }
      if (isObjectValue.value) {
        activated.value = isArray(treeSelectValue.value)
          ? (treeSelectValue.value as Array<TreeSelectValue>).map((item) => (item as NodeOptions).value)
          : [(treeSelectValue.value as NodeOptions).value];
      } else {
        (activated.value as TreeSelectValue) = isArray(treeSelectValue.value)
          ? treeSelectValue.value
          : [treeSelectValue.value];
      }
      changeNodeInfo();
    });

    // methods

    const change = (
      valueParam: TreeSelectValue,
      node: TreeNodeModel<TreeOptionData>,
      trigger: TreeSelectValueChangeTrigger,
    ) => {
      setTreeSelectValue(valueParam, { node, trigger });
      changeNodeInfo();
    };

    const clear = (content: { e: MouseEvent }) => {
      const defaultValue: TreeSelectValue = props.multiple ? [] : '';
      activated.value = [];
      change(defaultValue, null, 'clear');
      props.onClear?.({ e: content.e });
      emit('clear', { e: content.e });
    };

    const treeNodeChange = (
      valueParam: Array<TreeNodeValue>,
      context: { node: TreeNodeModel<TreeOptionData>; e: MouseEvent },
    ) => {
      let current: TreeSelectValue = valueParam;
      if (isObjectValue.value) {
        current = valueParam.map((nodeValue) => getTreeNode(props.data, nodeValue));
      }
      change(current, context.node, 'check');
    };

    const treeNodeActive = (
      valueParam: Array<TreeNodeValue>,
      context: { node: TreeNodeModel<TreeOptionData>; e: MouseEvent },
    ) => {
      // 多选模式屏蔽 Active 事件
      if (props.multiple) return;

      setInnerVisible(false, context);

      // 单选模式重复选择不清空
      if (treeSelectValue.value === context.node.data[realValue.value]) {
        return;
      }
      let current: TreeSelectValue = valueParam;
      if (isObjectValue.value) {
        const nodeValue = isEmpty(valueParam) ? '' : valueParam[0];
        current = getTreeNode(props.data, nodeValue);
      } else {
        current = isEmpty(valueParam) ? '' : valueParam[0];
      }
      change(current, context.node, 'check');
      activated.value = valueParam;
    };

    const treeNodeExpand = (valueParam: Array<TreeNodeValue>) => {
      expanded.value = valueParam;
    };

    const treeNodeLoad = () => {
      changeNodeInfo();
    };

    const inputChange = (value: InputValue): boolean => {
      // 未打开状态不处理输入框输入
      const searchValue = String(value);
      if (!innerVisible.value) {
        props.onSearch?.(searchValue);
        emit('search', searchValue);
        return;
      }
      setInnerInputValue(value);
      if (!value) {
        filterByText.value = null;
        return null;
      }
      filterByText.value = (node: TreeNodeModel<TreeOptionData>) => {
        if (isFunction(props.filter)) {
          const filter: boolean | Promise<boolean> = props.filter(searchValue, node);
          if (isBoolean(filter)) {
            return filter;
          }
        }
        return node.data[realLabel.value].indexOf(value) >= 0;
      };
      props.onSearch?.(searchValue);
      emit('search', searchValue);
    };

    const tagChange = (value: string | number, context: TagInputChangeContext) => {
      const { trigger, index } = context;
      if (['tag-remove', 'backspace'].includes(trigger)) {
        isArray(treeSelectValue.value) && (treeSelectValue.value as Array<TreeSelectValue>).splice(index, 1);
      }
      props.onRemove?.({ value, data: null, e: context && (context.e as MouseEvent) });
      emit('remove', { value, data: null, e: context && (context.e as MouseEvent) });
      change(treeSelectValue.value, null, trigger as 'tag-remove' | 'backspace');
    };

    const changeNodeInfo = async () => {
      await treeSelectValue.value;

      if (!props.multiple) {
        if (treeSelectValue.value || treeSelectValue.value === 0) {
          nodeInfo.value = getSingleNodeInfo();
        } else {
          nodeInfo.value = '';
        }
      } else if (props.multiple) {
        if (isArray(treeSelectValue.value)) {
          nodeInfo.value = getMultipleNodeInfo();
        } else {
          nodeInfo.value = [];
        }
      } else {
        nodeInfo.value = null;
      }
    };

    const getSingleNodeInfo = () => {
      const nodeValue = isObjectValue.value ? (treeSelectValue.value as NodeOptions).value : treeSelectValue.value;
      if (treeRef.value && (props.treeProps as TreeProps)?.load) {
        if (!isEmpty(props.data)) {
          const node = treeRef.value.getItem(nodeValue);
          if (node) {
            return { label: node.data[realLabel.value], value: node.data[realValue.value] };
          }
        }
        return { label: nodeValue, value: nodeValue };
      }
      const node = getTreeNode(props.data, nodeValue);
      if (!node) {
        return { label: nodeValue, value: nodeValue };
      }
      return node;
    };

    const getMultipleNodeInfo = () => (treeSelectValue.value as Array<TreeSelectValue>).map((value) => {
      const nodeValue = isObjectValue.value ? (value as NodeOptions).value : value;
      if (treeRef.value && (props.treeProps as TreeProps)?.load) {
        if (!isEmpty(props.data)) {
          const node = treeRef.value.getItem(nodeValue);
          if (node) {
            return { label: node.data[realLabel.value], value: node.data[realValue.value] };
          }
        }
        return { label: nodeValue, value: nodeValue };
      }
      const node = getTreeNode(props.data, nodeValue);
      if (!node) {
        return { label: nodeValue, value: nodeValue };
      }
      return node;
    });
    const getTreeNode = (data: Array<TreeOptionData>, targetValue: TreeSelectValue): TreeSelectValue | null => {
      for (let i = 0, len = data.length; i < len; i++) {
        if (data[i][realValue.value] === targetValue) {
          return { label: data[i][realLabel.value], value: data[i][realValue.value] };
        }
        if (data[i]?.[realChildren.value]) {
          const result = getTreeNode(data[i]?.[realChildren.value], targetValue);
          if (!isNil(result)) {
            return result;
          }
        }
      }
      return null;
    };

    const treeRerender = () => {
      treeKey.value += 1;
    };

    return {
      innerVisible,
      classPrefix,
      nodeInfo,
      inputPlaceholder,
      popupClass,
      clear,
      setInnerVisible,
      tagChange,
      treeKey,
      treeRef,
      checked,
      innerInputValue,
      tDisabled,
      filterByText,
      activated,
      realLabel,
      realValue,
      inputChange,
      dropdownInnerSize,
      global,
      treeNodeChange,
      treeNodeExpand,
      treeNodeActive,
      multiLimitDisabled,
      treeNodeLoad,
      expanded,
      emit,
    };
  },
  methods: {
    renderSuffixIcon() {
      return (
        <FakeArrow
          isActive={this.innerVisible}
          disabled={this.disabled}
          overlayClassName={{
            [`${this.classPrefix}-fake-arrow--highlight`]: this.innerVisible,
            [`${this.classPrefix}-fake-arrow--disable`]: this.disabled,
          }}
        />
      );
    },
  },
  render() {
    const renderTNodeJSX = useTNodeJSX();
    const renderDefaultTNode = useTNodeDefault();

    return (
      <SelectInput
        {...{
          class: `${this.classPrefix}-tree-select`,
          props: {
            value: this.nodeInfo,
            inputValue: this.innerVisible ? this.innerInputValue : '',
            popupVisible: this.innerVisible,
            disabled: this.tDisabled,
            multiple: this.multiple,
            loading: this.loading,
            clearable: this.clearable,
            autoWidth: this.autoWidth,
            borderless: this.borderless,
            readonly: this.readonly,
            placeholder: this.inputPlaceholder,
            allowInput: this.filterable || isFunction(this.filter),
            minCollapsedNum: this.minCollapsedNum,
            popupProps: {
              overlayClassName: this.popupClass,
              ...(this.popupProps as TdTreeSelectProps['popupProps']),
            },
            inputProps: {
              size: this.size,
              ...(this.inputProps as TdTreeSelectProps['inputProps']),
            },
            tagInputProps: {
              size: this.size,
            },
            tagProps: {
              maxWidth: 300,
              ...(this.tagProps as TdTreeSelectProps['tagProps']),
            },
            label: () => renderTNodeJSX('prefixIcon'),
            suffixIcon: this.renderSuffixIcon,
            onClear: this.clear,
            onBlur: (value: InputValue, context: { e: FocusEvent }) => {
              this.onBlur?.({ value, e: context.e });
              this.emit('blur', { value, e: context.e });
            },
            onFocus: (value: InputValue, context: { e: FocusEvent }) => {
              this.onFocus?.({ value, e: context.e });
              this.emit('focus', { value, e: context.e });
            },
            onInputChange: this.inputChange,
            onTagChange: this.tagChange,
            onPopupVisibleChange: (state: boolean, context: PopupVisibleChangeContext) => this.setInnerVisible(state, context),
            valueDisplay: () => renderTNodeJSX('valueDisplay', {
              params: this.multiple
                ? {
                  value: this.nodeInfo,
                  onClose: (value: string | number, context: TagInputChangeContext) => {
                    this.tagChange(value, context);
                  },
                }
                : {
                  value: this.nodeInfo || { [this.realLabel]: '', [this.realValue]: undefined },
                },
            }),

            panel: () => (
              <div
                class={[
                  `${this.classPrefix}-select__dropdown-inner`,
                  `${this.classPrefix}-select__dropdown-inner--size-${this.dropdownInnerSize}`,
                ]}
              >
                {this.loading && !this.tDisabled ? (
                  <p
                    class={[
                      `${this.classPrefix}-select-loading-tips`,
                      `${this.classPrefix}-select__right-icon-polyfill`,
                    ]}
                  >
                    {renderDefaultTNode('loadingText', {
                      defaultNode: <div class={`${this.classPrefix}-select__empty`}>{this.global.loadingText}</div>,
                    })}
                  </p>
                ) : null}
                {!this.loading ? (
                  <Tree
                    ref="treeRef"
                    {...{
                      props: {
                        key: this.treeKey,
                        value: [...this.checked],
                        hover: true,
                        data: this.data,
                        activable: !this.multiple,
                        checkable: this.multiple,
                        disabled: this.tDisabled || this.multiLimitDisabled,
                        size: this.size,
                        filter: this.filterByText,
                        icon: !this.filterByText,
                        actived: this.activated,
                        expanded: this.expanded,
                        activeMultiple: this.multiple,
                        onChange: this.treeNodeChange,
                        onActive: this.treeNodeActive,
                        onExpand: this.treeNodeExpand,
                        onLoad: this.treeNodeLoad,
                        expandOnClickNode: true,
                        empty: () => renderDefaultTNode('empty', {
                          defaultNode: <div class={`${this.classPrefix}-select__empty`}>{this.global.empty}</div>,
                        }),
                        ...(this.treeProps as TdTreeSelectProps['treeProps']),
                      },
                    }}
                  />
                ) : null}
              </div>
            ),
            collapsedItems: () => renderTNodeJSX('collapsedItems'),
            ...this.selectInputProps,
          },
        }}
      />
    );
  },
});
