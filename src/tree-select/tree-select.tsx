import { defineComponent, computed } from '@vue/composition-api';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import Tree from '../tree';
import props from './props';
import SelectInput from '../select-input';
import { TagInputChangeContext, TagInputValue } from '../tag-input';
import { InputValue } from '../input';
import FakeArrow from '../common-components/fake-arrow';
import { TreeSelectValue, TdTreeSelectProps } from './type';
import { useTNodeJSX, useTNodeDefault } from '../hooks/tnode';
import useTreeSelect from './useTreeSelect';

export default defineComponent({
  name: 'TTreeSelect',

  props: { ...props },

  setup(props: TdTreeSelectProps, context) {
    const treeSelectInfo = useTreeSelect(props, context);

    const renderTNodeJSX = useTNodeJSX();
    const renderDefaultTNode = useTNodeDefault();

    const { dropdownInnerSize, treeSelectValue } = treeSelectInfo;

    const multiLimitDisabled = computed(
      () => props.multiple
        && !!props.max
        && isArray(treeSelectValue.value)
        && props.max <= (treeSelectValue.value as Array<TreeSelectValue>).length,
    );

    return {
      ...treeSelectInfo,
      dropdownInnerSize,
      multiLimitDisabled,
      renderTNodeJSX,
      renderDefaultTNode,
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
      return (
        <div
          class={[
            `${this.classPrefix}-select__dropdown-inner`,
            `${this.classPrefix}-select__dropdown-inner--size-${this.dropdownInnerSize}`,
          ]}
        >
          {this.loading && !this.tDisabled ? (
            <p class={[`${this.classPrefix}-select-loading-tips`, `${this.classPrefix}-select__right-icon-polyfill`]}>
              {this.renderDefaultTNode('loadingText', {
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
                empty: () => this.renderDefaultTNode('empty', {
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
            label: () => this.renderTNodeJSX('prefixIcon'),
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
            onPopupVisibleChange: this.onInnerPopupVisibleChange,
            valueDisplay: () => this.renderTNodeJSX('valueDisplay', {
              params: this.multiple
                ? {
                  value: this.nodeInfo,
                  onClose: (value: TagInputValue, context: TagInputChangeContext) => {
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
