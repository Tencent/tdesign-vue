import { defineComponent, computed } from 'vue';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import Tree, { TreeProps } from '../tree';
import props from './props';
import SelectInput, { SelectInputProps } from '../select-input';
import FakeArrow from '../common-components/fake-arrow';
import { TreeSelectValue, TdTreeSelectProps } from './type';
import { useTNodeJSX, useTNodeDefault } from '../hooks/tnode';
import useTreeSelect from './useTreeSelect';
import { TreeOptionData } from '..';

export default defineComponent({
  name: 'TTreeSelect',

  props: { ...props },

  setup(props: TdTreeSelectProps, context) {
    const renderTNodeJSX = useTNodeJSX();
    const renderDefaultTNode = useTNodeDefault();

    const treeSelectInfo = useTreeSelect(props, context);
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

    renderLabel() {
      const label = this.renderTNodeJSX('label');
      const prefixIcon = this.renderTNodeJSX('prefixIcon');
      if (label && prefixIcon) {
        return (
          <div>
            {label}
            {prefixIcon}
          </div>
        );
      }
      return label || prefixIcon;
    },

    getTreePanel() {
      return (
        <div
          class={[
            `${this.classPrefix}-select__dropdown-inner`,
            `${this.classPrefix}-select__dropdown-inner--size-${this.dropdownInnerSize}`,
          ]}
        >
          {this.renderTNodeJSX('panelTopContent')}
          {this.loading && !this.tDisabled ? (
            <p class={[`${this.classPrefix}-select__loading-tips`, `${this.classPrefix}-select__right-icon-polyfill`]}>
              {this.renderDefaultTNode('loadingText', {
                defaultNode: <div class={`${this.classPrefix}-select__empty`}>{this.global.loadingText}</div>,
              })}
            </p>
          ) : null}
          {!this.loading ? (
            <Tree
              ref="treeRef"
              key={!(this.treeProps as TreeProps)?.load && this.treeKey}
              props={{
                keys: this.tKeys,
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
                // @ts-ignore
                onExpand: this.treeNodeExpand,
                // @ts-ignore
                onLoad: this.treeNodeLoad,
                onChange: this.treeNodeChange,
                onActive: this.treeNodeActive,
                expandOnClickNode: true,
                empty: () => this.renderDefaultTNode('empty', {
                  defaultNode: <div class={`${this.classPrefix}-select__empty`}>{this.global.empty}</div>,
                }),
                // support all tree component props
                ...(this.treeProps as TreeProps),
              }}
            />
          ) : null}
          {this.renderTNodeJSX('panelBottomContent')}
        </div>
      );
    },

    renderCollapsedItems() {
      const selectedNodeInfo = this.nodeInfo || [];
      const value = Array.isArray(selectedNodeInfo) ? selectedNodeInfo : [selectedNodeInfo];
      return this.renderTNodeJSX('collapsedItems', {
        params: {
          value,
          collapsedSelectedItems: value.slice(this.minCollapsedNum),
          count: value.length - this.minCollapsedNum,
        },
      });
    },
  },

  render() {
    const slots = this.$scopedSlots;
    return (
      <SelectInput
        scopedSlots={{
          tips: slots.tips,
          suffix: slots.suffix,
        }}
        class={`${this.classPrefix}-tree-select`}
        {...{
          props: {
            keys: this.tKeys,
            value: this.nodeInfo,
            inputValue: this.innerInputValue,
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
            suffix: this.suffix,
            allowInput: Boolean(this.filterable || isFunction(this.filter) || this.$listeners.search || this.onSearch),
            minCollapsedNum: this.minCollapsedNum,
            collapsedItems: this.renderCollapsedItems,
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
            label: this.renderLabel,
            suffixIcon: this.renderSuffixIcon,
            onClear: this.clear,
            onBlur: this.onInnerBlur,
            onFocus: this.onInnerFocus,
            onInputChange: this.inputChange,
            onTagChange: this.tagChange,
            onEnter: this.onInnerEnter,
            onPopupVisibleChange: this.onInnerPopupVisibleChange,

            // custom value tag fro multiple tree select
            valueDisplay: () => this.renderTNodeJSX('valueDisplay', {
              params: this.multiple
                ? {
                  value: this.nodeInfo as TreeOptionData<string | number>[],
                  onClose: (index: number) => {
                    const value = this.nodeInfo.map((node: TreeOptionData) => node.value);
                    this.tagChange(value, {
                      trigger: 'tag-remove',
                      index,
                      item: value[index],
                    });
                  },
                }
                : {
                  value: this.nodeInfo || { [this.tKeys.label]: '', [this.tKeys.value]: undefined },
                },
            }),

            // tree panel
            panel: this.getTreePanel,

            // support all select-input component props
            ...(this.selectInputProps as SelectInputProps),
          },
        }}
      />
    );
  },
});
