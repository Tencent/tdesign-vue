import { VNode } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isBoolean from 'lodash/isBoolean';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';
import { CloseCircleFilledIcon } from 'tdesign-icons-vue';
import Loading from '../loading';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { TreeSelectConfig } from '../config-provider/config-receiver';
import { renderTNodeJSX } from '../utils/render-tnode';
import { emitEvent } from '../utils/event';
import Popup, { PopupProps } from '../popup';
import Tag from '../tag';
import Tree, { TreeNodeModel, TreeNodeValue } from '../tree';
import Input, { InputValue, InputBlurEventParams, InputFocusEventParams } from '../input';
import FakeArrow from '../common-components/fake-arrow';
import CLASSNAMES from '../utils/classnames';
import props from './props';
import { TreeSelectValue, TdTreeSelectProps, TreeSelectNodeValue } from './type';
import { ClassName, TreeOptionData } from '../common';
import { prefix } from '../config';
import { RemoveOptions, NodeOptions } from './interface';
import { TreeInstanceFunctions } from '../tree/type';

export default mixins(getConfigReceiverMixins<Vue, TreeSelectConfig>('treeSelect')).extend({
  name: 'TTreeSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props,
  data() {
    return {
      // 表单控制禁用态时的变量
      formDisabled: undefined,
      visible: false,
      isHover: false,
      focusing: false,
      defaultProps: {
        trigger: 'click',
        placement: 'bottom-left',
        overlayClassName: '',
        overlayStyle: (trigger) => ({
          width: `${trigger.offsetWidth}px`,
        }),
      } as PopupProps,
      filterText: '',
      filterByText: null,
      actived: [],
      expanded: [],
      nodeInfo: null,
      treeKey: 0,
    };
  },
  watch: {
    async value() {
      await this.changeNodeInfo();
      if (!this.multiple) {
        this.actived = this.nodeInfo ? [this.nodeInfo.value] : [];
      }
    },
    async data() {
      await this.changeNodeInfo();
      this.treeRerender();
    },
  },
  computed: {
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
    classes(): ClassName {
      return [
        `${prefix}-select`,
        `${prefix}-select-polyfill`,
        {
          [CLASSNAMES.STATUS.disabled]: this.tDisabled,
          [CLASSNAMES.STATUS.active]: this.visible,
          [CLASSNAMES.SIZE[this.size]]: this.size,
          [`${prefix}-has-prefix`]: this.prefixIconSlot,
          [`${prefix}-select-selected`]: this.selectedSingle || !isEmpty(this.selectedMultiple),
        },
      ];
    },
    popupClass(): ClassName {
      const { popupObject } = this;
      return `${popupObject.overlayClassName} ${prefix}-select__dropdown narrow-scrollbar`;
    },
    isObjectValue(): boolean {
      return this.valueType === 'object';
    },
    checked(): Array<TreeSelectValue> {
      if (this.multiple) {
        if (this.isObjectValue) {
          return isArray(this.value) ? this.value.map((item) => (item as NodeOptions).value) : [];
        }
        return isArray(this.value) ? this.value : [];
      }
      return [];
    },
    showArrow(): boolean {
      return (
        !this.clearable
        || !this.isHover
        || this.tDisabled
        || (!this.multiple && !this.value && this.value !== 0)
        || (this.multiple && isArray(this.value) && isEmpty(this.value))
      );
    },
    showLoading(): boolean {
      return this.loading && !this.tDisabled;
    },
    showClose(): boolean {
      return (
        this.clearable
        && this.isHover
        && !this.tDisabled
        && ((!this.multiple && (!!this.value || this.value === 0))
          || (this.multiple && !isEmpty(this.value as Array<TreeSelectValue>)))
      );
    },
    showPlaceholder(): boolean {
      if (
        !this.showFilter
        && ((isString(this.value) && this.value === '' && !this.selectedSingle)
          || (isArray(this.value) && isEmpty(this.value))
          || isNil(this.value))
      ) {
        return true;
      }
      return false;
    },
    showFilter(): boolean {
      if (this.tDisabled) {
        return false;
      }
      if (!this.multiple && this.selectedSingle && (this.filterable || isFunction(this.filter))) {
        return this.visible;
      }
      return this.filterable || isFunction(this.filter);
    },
    showTree(): boolean {
      return !this.loading;
    },
    popupObject(): PopupProps {
      const propsObject = this.popupProps ? { ...this.defaultProps, ...this.popupProps } : this.defaultProps;
      return propsObject;
    },
    selectedSingle(): TreeSelectValue {
      if (!this.multiple && (isString(this.value) || isNumber(this.value) || isObject(this.value))) {
        if (this.nodeInfo) {
          return (this.nodeInfo as NodeOptions).label;
        }
        return `${this.value}`;
      }
      return '';
    },
    selectedMultiple(): Array<TreeSelectValue> {
      if (this.multiple && isArray(this.value) && !isEmpty(this.value)) {
        return this.value;
      }
      return [];
    },
    multiLimitDisabled() {
      if (this.multiple && this.max && isArray(this.value) && this.max <= this.value.length) {
        return true;
      }
      return false;
    },
    filterPlaceholder(): TreeSelectValue {
      if (this.multiple && isArray(this.value) && !isEmpty(this.value)) {
        return '';
      }
      const single = this.selectedSingle instanceof Array ? this.selectedSingle[0] : this.selectedSingle;
      if (!this.multiple && single) {
        return single;
      }
      return this.placeholder;
    },
    loadingTextSlot(): ScopedSlotReturnValue {
      const useLocale = !this.loadingText && !this.$scopedSlots.loadingText;
      return useLocale ? (
        <div class={`${prefix}-select__empty`}>{this.t(this.global.loadingText)}</div>
      ) : (
        renderTNodeJSX(this, 'loadingText')
      );
    },
    emptySlot(): ScopedSlotReturnValue {
      const useLocale = !this.empty && !this.$scopedSlots.empty;
      return useLocale ? (
        <div class={`${prefix}-select__empty`}>{this.t(this.global.empty)}</div>
      ) : (
        renderTNodeJSX(this, 'empty')
      );
    },
    prefixIconSlot(): ScopedSlotReturnValue {
      return renderTNodeJSX(this, 'prefixIcon');
    },
    realLabel(): string {
      const { treeProps } = this;
      if (!isEmpty(treeProps) && !isEmpty(treeProps.keys)) {
        return treeProps.keys.label || 'label';
      }
      return 'label';
    },
    realValue(): string {
      const { treeProps } = this;
      if (!isEmpty(treeProps) && !isEmpty(treeProps.keys)) {
        return treeProps.keys.value || 'value';
      }
      return 'value';
    },
    realChildren(): string {
      const { treeProps } = this;
      return treeProps?.keys?.children || 'children';
    },
    tagList(): Array<TreeSelectValue> {
      if (this.nodeInfo && isArray(this.nodeInfo)) {
        return this.nodeInfo.map((node) => node.label);
      }
      return this.selectedMultiple;
    },
  },
  async mounted() {
    if (!this.value && this.defaultValue) {
      await this.change(this.defaultValue, null);
    }
    if (this.isObjectValue) {
      this.actived = isArray(this.value)
        ? this.value.map((item) => (item as NodeOptions).value)
        : [(this.value as NodeOptions).value];
    } else {
      this.actived = isArray(this.value) ? this.value : [this.value];
    }
    this.changeNodeInfo();
  },
  methods: {
    async popupVisibleChange(visible: boolean) {
      await (this.visible = visible);
      this.filterText = '';
      this.filterByText = null;
      if (this.showFilter && this.visible) {
        const searchInput = this.$refs.input as HTMLElement;
        searchInput?.focus();
        this.focusing = true;
      }
    },
    removeTag(index: number, data: TreeOptionData, e?: MouseEvent) {
      if (this.tDisabled) {
        return;
      }
      this.remove({ value: this.value[index], data, e });
      isArray(this.value) && this.value.splice(index, 1);
      this.change(this.value, null);
    },
    change(value: TreeSelectValue, node: TreeNodeModel<TreeOptionData>) {
      emitEvent<Parameters<TdTreeSelectProps['onChange']>>(this, 'change', value, { node });
      this.changeNodeInfo();
    },
    clear(e: MouseEvent) {
      const defaultValue: TreeSelectValue = this.multiple ? [] : '';
      this.change(defaultValue, null);
      this.actived = [];
      this.filterText = '';
      this.filterByText = null;
      emitEvent<Parameters<TdTreeSelectProps['onClear']>>(this, 'clear', { e });
    },
    focus(ctx: InputFocusEventParams[1]) {
      this.focusing = true;
      emitEvent<Parameters<TdTreeSelectProps['onFocus']>>(this, 'focus', { value: this.value, ...ctx });
    },
    blur(ctx: InputBlurEventParams[1]) {
      this.focusing = false;
      emitEvent<Parameters<TdTreeSelectProps['onBlur']>>(this, 'blur', { value: this.value, ...ctx });
    },
    remove(options: RemoveOptions<TreeOptionData>) {
      emitEvent<Parameters<TdTreeSelectProps['onRemove']>>(this, 'remove', options);
    },
    search(filterWords: string) {
      emitEvent<Parameters<TdTreeSelectProps['onSearch']>>(this, 'search', filterWords);
    },
    treeNodeChange(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<TreeOptionData>; e: MouseEvent }) {
      let current: TreeSelectValue = value;
      if (this.isObjectValue) {
        current = value.map((nodeValue) => this.getTreeNode(this.data, nodeValue));
      }
      this.change(current, context.node);
      this.actived = value;
    },
    treeNodeActive(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<TreeOptionData>; e: MouseEvent }) {
      // 多选模式屏蔽 Active 事件
      if (this.multiple) {
        return;
      }

      const triggerValue = this.isObjectValue ? context.node.data : context.node.data[this.realValue];
      // 参照 Select 下点击即选中
      this.change(triggerValue, context.node);
      this.actived = [triggerValue];
      this.visible = false;
    },
    treeNodeExpand(value: Array<TreeNodeValue>) {
      this.expanded = value;
    },
    onInputChange() {
      if (!this.filterText) {
        this.filterByText = null;
        return null;
      }
      this.filterByText = (node: TreeNodeModel<TreeOptionData>) => {
        if (isFunction(this.filter)) {
          const filter: boolean | Promise<boolean> = this.filter(this.filterText, node);
          if (isBoolean(filter)) {
            return filter;
          }
        }
        return node.data[this.realLabel].indexOf(this.filterText) >= 0;
      };
      this.search(this.filterText);
    },
    // get tree data, even load async load
    getTreeData() {
      return ((this.$refs.tree as TreeInstanceFunctions)?.getItems() || []).map((item) => ({
        [this.realLabel]: item.data[this.realLabel],
        [this.realValue]: item.data[this.realValue],
      }));
    },
    async changeNodeInfo() {
      await this.value;
      if (!this.multiple && (this.value || this.value === 0)) {
        this.changeSingleNodeInfo();
      } else if (this.multiple && isArray(this.value)) {
        this.changeMultipleNodeInfo();
      } else {
        this.nodeInfo = null;
      }
    },
    changeSingleNodeInfo() {
      const { tree } = this.$refs;
      const nodeValue = this.isObjectValue ? (this.value as NodeOptions).value : this.value;

      if (tree && this.treeProps?.load) {
        if (!isEmpty(this.data)) {
          const node = (tree as any).getItem(nodeValue);
          if (!node) return;
          this.nodeInfo = { label: node.data[this.realLabel], value: node.data[this.realValue] };
        } else {
          this.nodeInfo = { label: nodeValue, value: nodeValue };
        }
      } else {
        const node = this.getTreeNode(this.data, nodeValue);
        if (!node) {
          this.nodeInfo = { label: nodeValue, value: nodeValue };
        } else {
          this.nodeInfo = node;
        }
      }
    },
    changeMultipleNodeInfo() {
      const { tree } = this.$refs;

      this.nodeInfo = (this.value as Array<TreeSelectValue>).map((value) => {
        const nodeValue = this.isObjectValue ? (value as NodeOptions).value : value;
        if (tree && this.treeProps?.load) {
          if (!isEmpty(this.data)) {
            const node = (tree as any).getItem(nodeValue);
            if (!node) return;
            return { label: node.data[this.realLabel], value: node.data[this.realValue] };
          }
          return { label: nodeValue, value: nodeValue };
        }
        const node = this.getTreeNode(this.data, nodeValue);
        if (!node) {
          return { label: nodeValue, value: nodeValue };
        }
        return node;
      });
    },
    getTreeNode(data: Array<TreeOptionData>, targetValue: TreeSelectValue): TreeSelectNodeValue | null {
      for (let i = 0, len = data.length; i < len; i++) {
        if (data[i][this.realValue] === targetValue) {
          return { label: data[i][this.realLabel], value: data[i][this.realValue] };
        }
        const childrenData = data[i][this.realChildren];
        if (childrenData) {
          const data = Array.isArray(childrenData) ? childrenData : this.getTreeData();
          const result = this.getTreeNode(data, targetValue);
          if (!isNil(result)) {
            return result;
          }
        }
      }
      return null;
    },
    treeRerender() {
      this.treeKey += 1;
    },
  },
  render(): VNode {
    const {
      treeProps, popupObject, classes, popupClass, treeKey,
    } = this;
    const iconStyle = { 'font-size': this.size };
    const treeItem = (
      <Tree
        ref="tree"
        v-show={this.showTree}
        key={treeKey}
        value={this.checked}
        hover
        data={this.data}
        activable={!this.multiple}
        checkable={this.multiple}
        disabled={this.tDisabled || this.multiLimitDisabled}
        empty={this.empty}
        size={this.size}
        filter={this.filterByText}
        actived={this.actived}
        expanded={this.expanded}
        activeMultiple={this.multiple}
        onChange={this.treeNodeChange}
        onActive={this.treeNodeActive}
        onExpand={this.treeNodeExpand}
        expandOnClickNode={true}
        checkStrictly={false}
        {...{ props: treeProps }}
      >
        <template slot="empty">{this.emptySlot}</template>
      </Tree>
    );
    const searchInput = (
      <Input
        ref="input"
        v-show={this.showFilter}
        v-model={this.filterText}
        class={`${prefix}-select__input`}
        size={this.size}
        disabled={this.tDisabled}
        placeholder={this.filterPlaceholder}
        onChange={this.onInputChange}
        onBlur={(value: InputValue, context: InputBlurEventParams[1]) => this.blur(context)}
        onFocus={(value: InputValue, context: InputFocusEventParams[1]) => this.focus(context)}
      />
    );
    const tagItem = !isEmpty(this.tagList) && (this.valueDisplay || this.$scopedSlots.valueDisplay)
      ? renderTNodeJSX(this, 'valueDisplay', {
        params: {
          value: this.nodeInfo,
          onClose: (index: number) => this.removeTag(index, null),
        },
      })
      : this.tagList.map((label, index) => (
            <Tag
              v-show={this.minCollapsedNum <= 0 || index < this.minCollapsedNum}
              key={index}
              size={this.size}
              closable={!this.tDisabled}
              disabled={this.tDisabled}
              maxWidth={300}
              title={label}
              onClose={(e: MouseEvent) => this.removeTag(index, null, e)}
            >
              {label}
            </Tag>
      ));
    const selectedSingle = this.valueDisplay || this.$scopedSlots.valueDisplay ? (
      renderTNodeJSX(this, 'valueDisplay', {
        params: { value: this.nodeInfo || { [this.realLabel]: '', [this.realValue]: '' } },
      })
    ) : (
        <span
          title={this.selectedSingle}
          class={`${prefix}-select__single ${prefix}-tree-select ${prefix}-single-suffix`}
        >
          {this.selectedSingle}
        </span>
    );
    const collapsedItem = (this.collapsedItems || this.$scopedSlots.collapsedItems)
      && this.minCollapsedNum > 0
      && this.tagList.length > this.minCollapsedNum ? (
        renderTNodeJSX(this, 'collapsedItems', {
          params: {
            count: this.tagList.length - this.minCollapsedNum,
            value: this.selectedMultiple,
            collapsedSelectedItems: this.selectedMultiple.slice(this.minCollapsedNum),
          },
        })
      ) : (
        <Tag v-show={this.minCollapsedNum > 0 && this.tagList.length > this.minCollapsedNum} size={this.size}>
          {`+${this.tagList.length - this.minCollapsedNum}`}
        </Tag>
      );
    return (
      <div ref="treeSelect" class={`${prefix}-select__wrap`}>
        <Popup
          ref="popup"
          class={`${prefix}-select__popup-reference`}
          visible={this.visible}
          disabled={this.tDisabled}
          placement={popupObject.placement}
          trigger={popupObject.trigger}
          overlayStyle={popupObject.overlayStyle}
          overlayClassName={popupClass}
          on={{ 'visible-change': this.popupVisibleChange }}
          expandAnimation={true}
        >
          <div class={classes} onmouseenter={() => (this.isHover = true)} onmouseleave={() => (this.isHover = false)}>
            {this.prefixIconSlot && <span class={`${prefix}-select__left-icon`}>{this.prefixIconSlot[0]}</span>}
            <span v-show={this.showPlaceholder} class={`${prefix}-select__placeholder`}>
              {this.placeholder || this.global.placeholder}
            </span>
            <span class={`${prefix}-tree-select ${prefix}-tag-prefix`}>{tagItem}</span>
            {collapsedItem}
            {!this.multiple && !this.showPlaceholder && !this.showFilter && selectedSingle}
            {searchInput}
            {this.showArrow && !this.showLoading && (
              <FakeArrow
                overlayClassName={`${prefix}-select__right-icon ${prefix}-select__right-icon-polyfill`}
                overlayStyle={iconStyle}
                isActive={this.visible && !this.tDisabled}
              />
            )}
            <CloseCircleFilledIcon
              v-show={this.showClose && !this.showLoading}
              class={[
                `${prefix}-select__right-icon`,
                `${prefix}-select__right-icon-polyfill`,
                `${prefix}-select__right-icon-clear`,
              ]}
              size={this.size}
              nativeOnClick={this.clear}
            />
            <Loading
              v-show={this.showLoading}
              class={`${prefix}-select__right-icon ${prefix}-select__right-icon-polyfill ${prefix}-select__active-icon`}
              size="small"
            />
          </div>
          <div slot="content">
            <p v-show={this.showLoading} class={`${prefix}-select__loading-tips ${prefix}-select__right-icon-polyfill`}>
              {this.loadingTextSlot}
            </p>
            {treeItem}
          </div>
        </Popup>
      </div>
    );
  },
});
