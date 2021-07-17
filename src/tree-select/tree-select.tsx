import { VNode } from 'vue';
import mixins from '../utils/mixins';
import getLocalRecevierMixins from '../locale/local-receiver';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { renderTNodeJSX } from '../utils/render-tnode';

import Popup, { PopupProps } from '../popup';
import IconChevronDown from '../icon/chevron-down';
import IconClose from '../icon/close';
import IconLoading from '../icon/loading';
import Tag from '../tag';
import Tree from '../tree';
import Input from '../input';

import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';

import CLASSNAMES from '../utils/classnames';
import props from '../../types/tree-select/props';
import { InputValue } from '../../types/input/TdInputProps';
import { TreeSelectValue } from '../../types/tree-select/TdTreeSelectProps';
import { TreeNodeModel, TreeNodeValue } from '../../types/tree/TdTreeProps';
import { ClassName, TreeOptionData } from '../../types/common';
import { prefix } from '../config';

import { RemoveOptions } from './types';

const name = `${prefix}-tree-select`;

export default mixins(getLocalRecevierMixins('treeSelect')).extend({
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
        overlayStyle: trigger => ({ width: `${trigger.offsetWidth}px` }),
      } as PopupProps,
      filterText: '',
      filterByText: null,
      actived: [],
      expanded: [],
    };
  },
  computed: {
    classes(): ClassName {
      return [
        `${prefix}-select`,
        {
          [CLASSNAMES.STATUS.disabled]: this.disabled,
          [CLASSNAMES.STATUS.active]: this.isHover || this.visible,
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
    arrowClass(): ClassName {
      return [
        `${prefix}-select-right-icon`,
        {
          [CLASSNAMES.STATUS.visible]: this.visible,
        },
      ];
    },
    checked(): Array<string | number> {
      if (this.multiple) {
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
        && ((!this.multiple && (!!this.value || this.value === 0)) || (this.multiple && !isEmpty(this.value as Array<number | string>)))
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
      const propsObject = this.popupProps ? Object.assign({}, this.defaultProps, this.popupProps) : this.defaultProps;
      return propsObject;
    },
    selectedSingle(): TreeSelectValue {
      if (!this.multiple && (isString(this.value) || isNumber(this.value))) {
        return this.value;
      }
      return '';
    },
    selectedMultiple(): Array<number | string> {
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
  },
  async mounted() {
    if (!this.value && this.defaultValue) {
      await this.change(this.defaultValue, null);
    }
    this.actived = isArray(this.value) ? this.value : [this.value];
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
    },
    clear(e: MouseEvent) {
      const defaultValue: TreeSelectValue = this.multiple ? [] : '';
      this.change(defaultValue, null);
      this.actived = [];
      this.filterText = '';
      this.$emit('clear', { e });
      isFunction(this.onClear) && this.onClear({ e });
    },
    focus(value: InputValue, context: { e: FocusEvent }) {
      this.focusing = true;
      this.$emit('focus', { value: this.value, e: context.e });
      isFunction(this.onFocus) && this.onFocus({ e: context.e });
    },
    blur(value: InputValue, context: { e: FocusEvent }) {
      this.focusing = false;
      this.filterText = '';
      this.$emit('blur', { value: this.value, e: context.e });
      isFunction(this.onBlur) && this.onBlur({ value: this.value, e: context.e });
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
      this.change(value, context.node);
      this.actived = value;
    },
    treeNodeActive(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<TreeOptionData>; e: MouseEvent }) {
      let current: TreeSelectValue = value;
      if (!this.multiple) {
        current = isEmpty(value) ? '' : value[0];
      }
      this.change(current, context.node);
      this.actived = value;
      if (!this.multiple) {
        this.visible = false;
      }
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
        return node.data.label.indexOf(this.filterText) >= 0;
      };
      this.search(this.filterText);
    },
  },
  render(): VNode {
    const { treeProps, popupObject, classes, popupClass, arrowClass } = this;
    const treeItem = (
      <Tree
        ref="tree"
        v-show={this.showTree}
        value={this.checked}
        hover
        expandAll
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
        onBlur={this.blur}
        onFocus={this.focus}
      />
    );
    const tagItem = (
      this.selectedMultiple.map((item, index) => (
        <Tag
          key={index}
          size={this.size}
          closable={!this.disabled}
          disabled={this.disabled}
          onClose={(e: MouseEvent) => this.removeTag(index, null, e)}
        >
          {item}
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
            <IconChevronDown v-show={this.showArrow && !this.showLoading} name="chevron-down" class={arrowClass} size={this.size} />
            <IconClose v-show={this.showClose && !this.showLoading} name="close" class={`${prefix}-select-right-icon`} size={this.size} nativeOnClick={this.clear} />
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
