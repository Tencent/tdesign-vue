import { VNode } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isBoolean from 'lodash/isBoolean';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import mixins from '../utils/mixins';
import getLocalReceiverMixins from '../locale/local-receiver';
import { renderTNodeJSX } from '../utils/render-tnode';

import Popup, { PopupProps } from '../popup';
import IconCloseCircleFilled from '../icon/close-circle-filled';
import IconLoading from '../icon/loading';
import Tag from '../tag';
import Tree, { TreeNodeModel, TreeNodeValue } from '../tree';
import Input from '../input';
import FakeArrow from '../common-components/fake-arrow';

import CLASSNAMES from '../utils/classnames';
import props from './props';

import { TreeSelectValue } from './type';
import { ClassName, TreeOptionData } from '../common';
import { prefix } from '../config';

import { RemoveOptions, NodeOptions } from './interface';

const name = `${prefix}-tree-select`;

export default mixins(getLocalReceiverMixins('treeSelect')).extend({
  name,
  model: {
    prop: 'value',
    event: 'change',
  },
  props,
  data() {
    return {
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
    };
  },
  computed: {
    classes(): ClassName {
      return [
        `${prefix}-select`,
        {
          [CLASSNAMES.STATUS.disabled]: this.disabled,
          [CLASSNAMES.STATUS.active]: this.visible,
          [CLASSNAMES.SIZE[this.size]]: this.size,
          [`${prefix}-has-prefix`]: this.prefixIconSlot,
          [`${prefix}-select-selected`]: this.selectedSingle || !isEmpty(this.selectedMultiple),
        },
      ];
    },
    popupClass(): ClassName {
      const { popupObject } = this;
      return `${popupObject.overlayClassName} ${prefix}-select-dropdown narrow-scrollbar`;
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
        || this.disabled
        || (!this.multiple && !this.value && this.value !== 0)
        || (this.multiple && isArray(this.value) && isEmpty(this.value))
      );
    },
    showLoading(): boolean {
      return this.loading && !this.disabled;
    },
    showClose(): boolean {
      return (
        this.clearable
        && this.isHover
        && !this.disabled
        && ((!this.multiple && (!!this.value || this.value === 0)) || (this.multiple && !isEmpty(this.value as Array<TreeSelectValue>)))
      );
    },
    showPlaceholder(): boolean {
      if (
        !this.showFilter
        && ((isString(this.value) && this.value === '' && !this.selectedSingle)
        || (isArray(this.value) && isEmpty(this.value))
        || this.value === null)
      ) {
        return true;
      }
      return false;
    },
    showFilter(): boolean {
      if (this.disabled) {
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
      const propsObject = this.popupProps ? ({ ...this.defaultProps, ...this.popupProps }) : this.defaultProps;
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
      if (!this.multiple && this.selectedSingle) {
        return this.selectedSingle;
      }
      return this.placeholder;
    },
    loadingTextSlot(): ScopedSlotReturnValue {
      const useLocale = !this.loadingText && !this.$scopedSlots.loadingText;
      return useLocale
        ? <div class={`${prefix}-select-empty`}>{ this.t(this.locale.loadingText) }</div>
        : renderTNodeJSX(this, 'loadingText');
    },
    emptySlot(): ScopedSlotReturnValue {
      const useLocale = !this.empty && !this.$scopedSlots.empty;
      return useLocale
        ? <div class={`${prefix}-select-empty`}>{ this.t(this.locale.empty) }</div>
        : renderTNodeJSX(this, 'empty');
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
      this.actived = isArray(this.value) ? this.value.map((item) => (item as NodeOptions).value) : [(this.value as NodeOptions).value];
    } else {
      this.actived = isArray(this.value) ? this.value : [this.value];
    }
    this.changeNodeInfo();
  },
  methods: {
    async popupVisibleChange(visible: boolean) {
      if (this.focusing && !visible) {
        this.visible = true;
        return;
      }
      await (this.visible = visible);
      if (this.showFilter && this.visible) {
        const searchInput = this.$refs.input as HTMLElement;
        searchInput?.focus();
        this.focusing = true;
      }
    },
    removeTag(index: number, data: TreeOptionData, e: MouseEvent) {
      if (this.disabled) {
        return;
      }
      this.remove({ value: this.value[index], data, e });
      isArray(this.value) && this.value.splice(index, 1);
      this.change(this.value, null);
    },
    change(value: TreeSelectValue, node: TreeNodeModel<TreeOptionData>) {
      this.$emit('change', value, { node });
      isFunction(this.onChange) && this.onChange(value, { node });
      this.changeNodeInfo();
    },
    clear(e: MouseEvent) {
      const defaultValue: TreeSelectValue = this.multiple ? [] : '';
      this.change(defaultValue, null);
      this.actived = [];
      this.filterText = '';
      this.$emit('clear', { e });
      isFunction(this.onClear) && this.onClear({ e });
    },
    focus(e: FocusEvent) {
      this.focusing = true;
      this.$emit('focus', { value: this.value, e });
      isFunction(this.onFocus) && this.onFocus({ e });
    },
    blur(e: FocusEvent) {
      this.focusing = false;
      this.filterText = '';
      this.$emit('blur', { value: this.value, e });
      isFunction(this.onBlur) && this.onBlur({ value: this.value, e });
    },
    remove(options: RemoveOptions<TreeOptionData>) {
      this.$emit('remove', options);
      isFunction(this.onRemove) && this.onRemove(options);
    },
    search(filterWords: string) {
      this.$emit('search', filterWords);
      isFunction(this.onSearch) && this.onSearch(filterWords);
    },
    treeNodeChange(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<TreeOptionData>; e: MouseEvent }) {
      let current: TreeSelectValue = value;
      if (this.isObjectValue) {
        const { tree } = this.$refs;
        current = value.map((nodeValue) => {
          const node = (tree as any).getItem(nodeValue);
          return { label: node.data[this.realLabel], value: node.data[this.realValue] };
        });
      }
      this.change(current, context.node);
      this.actived = value;
    },
    treeNodeActive(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<TreeOptionData>; e: MouseEvent }) {
      // 多选模式屏蔽 Active 事件
      if (this.multiple) {
        return;
      }
      let current: TreeSelectValue = value;
      if (this.isObjectValue) {
        const { tree } = this.$refs;
        const nodeValue = isEmpty(value) ? '' : value[0];
        const node = (tree as any).getItem(nodeValue);
        current = { label: node.data[this.realLabel], value: node.data[this.realValue] };
      } else {
        current = isEmpty(value) ? '' : value[0];
      }
      this.change(current, context.node);
      this.actived = value;
      this.visible = false;
    },
    treeNodeExpand(value: Array<TreeNodeValue>) {
      this.expanded = value;
    },
    onInput() {
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
    async changeNodeInfo() {
      const { tree } = this.$refs;
      await this.value;

      if (tree && !this.multiple && this.value) {
        const nodeValue = this.isObjectValue ? (this.value as NodeOptions).value : this.value;
        const node = (tree as any).getItem(nodeValue);
        this.nodeInfo = { label: node.data[this.realLabel], value: node.data[this.realValue] };
      } else if (tree && this.multiple && isArray(this.value)) {
        this.nodeInfo = this.value.map((value) => {
          const nodeValue = this.isObjectValue ? (value as NodeOptions).value : value;
          const node = (tree as any).getItem(nodeValue);
          return { label: node.data[this.realLabel], value: node.data[this.realValue] };
        });
      } else {
        this.nodeInfo = null;
      }
    },
  },
  render(): VNode {
    const {
      treeProps, popupObject, classes, popupClass,
    } = this;
    const iconStyle = { 'font-size': this.size };
    const treeItem = (
      <Tree
        ref="tree"
        v-show={this.showTree}
        value={this.checked}
        hover
        expandAll
        expandOnClickNode
        data={this.data}
        activable={!this.multiple}
        checkable={this.multiple}
        disabled={this.disabled || this.multiLimitDisabled}
        empty={this.empty}
        size={this.size}
        filter={this.filterByText}
        actived={this.actived}
        expanded={this.expanded}
        activeMultiple={this.multiple}
        onChange={this.treeNodeChange}
        onActive={this.treeNodeActive}
        onExpand={this.treeNodeExpand}
        {...{ props: treeProps }}
      >
        <template slot='empty'>
          {this.emptySlot}
        </template>
      </Tree>
    );
    const searchInput = (
      <Input
        ref="input"
        v-show={this.showFilter}
        v-model={this.filterText}
        class={`${prefix}-select-input`}
        size={this.size}
        disabled={this.disabled}
        placeholder={this.filterPlaceholder}
        onInput={this.onInput}
        onBlur={(value: TreeSelectValue, e: FocusEvent) => this.blur(e)}
        onFocus={(value: TreeSelectValue, e: FocusEvent) => this.focus(e)}
      />
    );
    const tagItem = (
      this.tagList.map((label, index) => (
        <Tag
          key={index}
          size={this.size}
          closable={!this.disabled}
          disabled={this.disabled}
          onClose={(e: MouseEvent) => this.removeTag(index, null, e)}
        >
          {label}
        </Tag>
      ))
    );
    return (
      <div ref='treeSelect'>
        <Popup
          ref="popup"
          class={`${prefix}-select-popup-reference`}
          visible={this.visible}
          disabled={this.disabled}
          placement={popupObject.placement}
          trigger={popupObject.trigger}
          overlayStyle={popupObject.overlayStyle}
          overlayClassName={popupClass}
          on={{ 'visible-change': this.popupVisibleChange }}
          expandAnimation={true}
        >
          <div
            class={classes}
            onmouseenter={() => this.isHover = true}
            onmouseleave={() => this.isHover = false}
          >
            {
              this.prefixIconSlot && (<span class={`${prefix}-select-left-icon`}>{this.prefixIconSlot[0]}</span>)
            }
            <span v-show={this.showPlaceholder} class={`${prefix}-select-placeholder`}>{this.placeholder}</span>
            {tagItem}
            {
              !this.multiple && !this.showPlaceholder && !this.showFilter && (
                <span title={this.selectedSingle} class={`${prefix}-select-selectedSingle`}>{this.selectedSingle}</span>
              )
            }
            {searchInput}
            {
              this.showArrow && !this.showLoading && (
                <FakeArrow overlayClass={`${prefix}-select-right-icon`} style={iconStyle} isActive={this.visible && !this.disabled}/>
              )
            }
            <IconCloseCircleFilled v-show={this.showClose && !this.showLoading} name="close" class={`${prefix}-select-right-icon`} size={this.size} nativeOnClick={this.clear} />
            <IconLoading v-show={this.showLoading} name="loading" class={`${prefix}-select-right-icon ${prefix}-select-active-icon`} size={this.size} />
          </div>
          <div slot="content">
            <p v-show={this.showLoading} class={`${prefix}-select-loading-tips`}>
              {this.loadingTextSlot}
            </p>
            {treeItem}
          </div>
        </Popup>
      </div>
    );
  },
});
