import { defineComponent, ref, computed } from '@vue/composition-api';
import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import Tree, { TreeNodeModel } from '../tree';
import SelectInput from '../select-input';
import { TagInputChangeContext } from '../tag-input';
import { InputValue } from '../input';
import FakeArrow from '../common-components/fake-arrow';
import { PopupVisibleChangeContext } from '../popup';
import { TreeSelectValue, TdTreeSelectProps, RemoveOptions } from './type';
import { TreeOptionData } from '../common';
import props from './props';
import { useTNodeJSX, useTNodeDefault } from '../hooks/tnode';
import useTreeSelect from './useTreeSelect';

export default defineComponent({
  name: 'TTreeSelect',

  props: { ...props },

  setup(props: TdTreeSelectProps, context) {
    const treeSelectInfo = useTreeSelect(props, context);

    const {
      treeRef, tKeys, dropdownInnerSize, innerVisible, treeSelectValue, setInnerVisible, setInnerInputValue,
    } = treeSelectInfo;

    // data
    const filterByText = ref(null);
    const treeKey = ref(0);

    const multiLimitDisabled = computed(
      () => props.multiple
        && !!props.max
        && isArray(treeSelectValue.value)
        && props.max <= (treeSelectValue.value as Array<TreeSelectValue>).length,
    );

    const inputChange = (value: InputValue): boolean => {
      // 未打开状态不处理输入框输入
      const searchValue = String(value);
      if (!innerVisible.value) {
        props.onSearch?.(searchValue);
        context.emit('search', searchValue);
        return;
      }
      setInnerInputValue(value, { trigger: 'input' });
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
        if (isFunction(node.data[tKeys.value.label]?.indexOf)) {
          return node.data[tKeys.value.label]?.indexOf(value) >= 0;
        }
        return false;
      };
      props.onSearch?.(searchValue);
      // emit('search', searchValue);
    };

    const tagChange = (value: string | number, context: TagInputChangeContext) => {
      const { trigger, index } = context;
      const fitTrigger = ['tag-remove', 'backspace'].includes(trigger);
      if (fitTrigger) {
        isArray(treeSelectValue.value) && (treeSelectValue.value as Array<TreeSelectValue>).splice(index, 1);
      }
      const removeParams: RemoveOptions<any> = {
        value,
        data: treeRef.value.getItem(value),
        e: context.e,
        // @ts-ignore
        trigger: fitTrigger ? trigger : undefined,
        index,
      };
      props.onRemove?.(removeParams);
      // emit('remove', removeParams);
      // change(treeSelectValue.value, null, trigger as 'tag-remove' | 'backspace');
    };

    // const treeRerender = () => {
    //   treeKey.value += 1;
    // };

    return {
      ...treeSelectInfo,
      treeKey,
      filterByText,
      dropdownInnerSize,
      multiLimitDisabled,
      setInnerVisible,
      tagChange,
      inputChange,
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

    getTreePanel() {
      const renderDefaultTNode = useTNodeDefault();
      return (
        <div
          class={[
            `${this.classPrefix}-select__dropdown-inner`,
            `${this.classPrefix}-select__dropdown-inner--size-${this.dropdownInnerSize}`,
          ]}
        >
          {this.loading && !this.tDisabled ? (
            <p class={[`${this.classPrefix}-select-loading-tips`, `${this.classPrefix}-select__right-icon-polyfill`]}>
              {renderDefaultTNode('loadingText', {
                defaultNode: <div class={`${this.classPrefix}-select__empty`}>{this.global.loadingText}</div>,
              })}
            </p>
          ) : null}
          {!this.loading ? (
            <Tree
              ref="treeRef"
              props={{
                key: this.treeKey,
                value: [...this.multipleChecked],
                actived: this.singleActivated,
                hover: true,
                data: this.data,
                activable: !this.multiple,
                checkable: this.multiple,
                disabled: this.tDisabled || this.multiLimitDisabled,
                size: this.size,
                filter: this.filterByText,
                icon: !this.filterByText,
                activeMultiple: this.multiple,
                onExpand: this.treeNodeExpand,
                onLoad: this.treeNodeLoad,
                expandOnClickNode: true,
                empty: () => renderDefaultTNode('empty', {
                  defaultNode: <div class={`${this.classPrefix}-select__empty`}>{this.global.empty}</div>,
                }),
                ...this.treeProps,
              }}
              on={{
                change: this.treeNodeChange,
                active: this.treeNodeActive,
              }}
            />
          ) : null}
        </div>
      );
    },
  },

  render() {
    const renderTNodeJSX = useTNodeJSX();
    return (
      <SelectInput
        scopedSlots={this.$scopedSlots}
        class={`${this.classPrefix}-tree-select`}
        {...{
          props: {
            value: this.nodeInfo,
            inputValue: this.innerVisible ? this.innerInputValue : '',
            popupVisible: this.innerVisible,
            disabled: this.tDisabled,
            multiple: this.multiple,
            loading: this.loading,
            clearable: this.clearable,
            autofocus: this.autofocus,
            autoWidth: this.autoWidth,
            borderless: this.borderless,
            readonly: this.readonly,
            placeholder: this.inputPlaceholder,
            status: this.status,
            tips: this.tips,
            allowInput: this.filterable || isFunction(this.filter),
            minCollapsedNum: this.minCollapsedNum,
            collapsedItems: this.collapsedItems,
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
              this.$emit('blur', { value, e: context.e });
            },
            onFocus: (value: InputValue, context: { e: FocusEvent }) => {
              this.onFocus?.({ value, e: context.e });
              this.$emit('focus', { value, e: context.e });
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
                  value: this.nodeInfo || { [this.tKeys.label]: '', [this.tKeys.value]: undefined },
                },
            }),

            panel: this.getTreePanel,
            ...this.selectInputProps,
          },
        }}
      />
    );
  },
});
