import Vue, { VNode } from 'vue';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import set from 'lodash/set';
import {
  ChevronDownIcon as TIconChevronDown,
  CloseCircleFilledIcon as TIconClose,
} from 'tdesign-icons-vue';
import TLoading from '../loading';
import Popup, { PopupProps } from '../popup';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { SelectConfig } from '../config-provider/config-receiver';
import { renderTNodeJSX } from '../utils/render-tnode';
import { prefix } from '../config';
import CLASSNAMES from '../utils/classnames';
import TInput from '../input/index';
import Tag from '../tag/index';
import FakeArrow from '../common-components/fake-arrow';
import Option from './option';
import props from './props';
import {
  SelectOption, TdOptionProps, SelectValue, TdSelectProps, SelectOptionGroup,
} from './type';
import { ClassName } from '../common';
import { emitEvent } from '../utils/event';

export type OptionInstance = InstanceType<typeof Option>;

const name = `${prefix}-select`;
// trigger元素不超过此宽度时，下拉选项的最大宽度（用户未设置overStyle width时）
// 用户设置overStyle width时，以设置的为准
const DEFAULT_MAX_OVERLAY_WIDTH = 500;

export default mixins(getConfigReceiverMixins<Vue, SelectConfig>('select')).extend({
  name: 'TSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: { ...props },
  data() {
    return {
      isHover: false,
      visible: false,
      searchInput: '',
      showCreateOption: false,
      hasOptions: false, // select的slot是否有options组件
      defaultProps: {
        trigger: 'click',
        placement: 'bottom-left' as string,
        overlayClassName: '' as ClassName,
        overlayStyle: {},
      } as PopupProps,
      focusing: false, // filterable时，输入框是否在focus中
      labelInValue: this.valueType === 'object',
      realValue: this.keys && this.keys.value ? this.keys.value : 'value',
      realLabel: this.keys && this.keys.label ? this.keys.label : 'label',
      realOptions: [] as Array<TdOptionProps>,
    };
  },
  components: {
    TIconChevronDown,
    TIconClose,
    TInput,
    TLoading,
    Tag,
    Popup,
    TOption: Option,
    FakeArrow,
  },
  provide(): any {
    return {
      tSelect: this,
    };
  },

  computed: {
    classes(): ClassName {
      return [
        `${name}`,
        {
          [CLASSNAMES.STATUS.disabled]: this.disabled,
          [CLASSNAMES.STATUS.active]: this.visible,
          [CLASSNAMES.SIZE[this.size]]: this.size,
          [`${prefix}-has-prefix`]: this.$scopedSlots.prefixIcon,
          [`${prefix}-no-border`]: !this.bordered,
        },
      ];
    },
    popClass(): string {
      const { popupObject } = this;
      return `${popupObject.overlayClassName} ${name}-dropdown narrow-scrollbar`;
    },
    tipsClass(): ClassName {
      return [
        `${name}-loading-tips`,
        {
          [CLASSNAMES.SIZE[this.size]]: this.size,
        },
      ];
    },
    emptyClass(): ClassName {
      return [
        `${name}-empty`,
        {
          [CLASSNAMES.SIZE[this.size]]: this.size,
        },
      ];
    },
    showPlaceholder(): boolean {
      if (
        !this.showFilter
          && ((!this.multiple && !this.selectedSingle)
          || (!this.multiple && typeof this.value === 'object' && !this.selectedSingle)
          || (Array.isArray(this.value) && !this.value.length)
          || this.value === null
          || this.value === undefined
          || this.value === '')
      ) {
        return true;
      }
      return false;
    },
    // 是否为分组选择器
    isGroupOption(): boolean {
      const firstOption = this.options?.[0];
      return !!(firstOption && ('group' in firstOption) && ('children' in firstOption));
    },
    filterPlaceholder(): string {
      if (this.multiple && Array.isArray(this.value) && this.value.length) {
        return '';
      }
      if (!this.multiple && this.selectedSingle) {
        return this.selectedSingle;
      }
      return this.placeholder;
    },
    showClose(): boolean {
      return Boolean(this.clearable
        && this.isHover
        && !this.disabled
        && (
          (!this.multiple && (this.value || this.value === 0))
          || (this.multiple && Array.isArray(this.value) && this.value.length)
        ));
    },
    showArrow(): boolean {
      return (
        !this.clearable
        || !this.isHover
        || this.disabled
        || (!this.multiple && !this.value && this.value !== 0)
        || (this.multiple && (!Array.isArray(this.value) || (Array.isArray(this.value) && !this.value.length)))
      );
    },
    canFilter(): boolean {
      return this.filterable || isFunction(this.filter);
    },
    showLoading(): boolean {
      return this.loading && !this.disabled;
    },
    showFilter(): boolean {
      if (this.disabled) return false;
      if (!this.multiple && this.selectedSingle && this.canFilter) {
        return this.visible;
      }
      return this.canFilter;
    },
    selectedSingle(): string {
      if (!this.multiple && (typeof this.value === 'string' || typeof this.value === 'number')) {
        let target: Array<TdOptionProps> = [];
        if (this.realOptions && this.realOptions.length) {
          target = this.realOptions.filter((item) => get(item, this.realValue) === this.value);
        }
        if (target.length) {
          if (get(target[0], this.realLabel) === '') {
            return get(target[0], this.realValue);
          }
          return get(target[0], this.realLabel);
        }
      }
      const showText = get(this.value, this.realLabel);
      // label为空时显示value值
      if (!this.multiple && typeof this.value === 'object' && showText !== undefined) {
        return showText === '' ? get(this.value, this.realValue) : showText;
      }
      return '';
    },
    selectedMultiple(): Array<TdOptionProps> {
      if (this.multiple && Array.isArray(this.value) && this.value.length) {
        return this.value.map((item: string | number | TdOptionProps) => {
          if (typeof item === 'object') {
            return item;
          }
          const tmp = this.realOptions.filter((op) => get(op, this.realValue) === item);
          const valueLabel = {};
          set(valueLabel, this.realValue, item);
          set(valueLabel, this.realLabel, tmp.length ? get(tmp[0], this.realLabel) : item);
          return tmp.length && tmp[0].disabled ? { ...valueLabel, disabled: true } : valueLabel;
        });
      }
      return [];
    },
    popupObject(): PopupProps {
      const propsObject = this.popupProps ? ({ ...this.defaultProps, ...this.popupProps }) : this.defaultProps;
      return propsObject;
    },
    filterOptions(): Array<TdOptionProps> {
      // filter优先级 filter方法>仅filterable
      if (isFunction(this.filter)) {
        return this.realOptions.filter((option) => this.filter(this.searchInput, option));
      } if (this.filterable) {
        // 仅有filterable属性时，默认不区分大小写过滤label
        return this.realOptions.filter((option) => option[this.realLabel].toString().toLowerCase()
          .indexOf(this.searchInput.toString().toLowerCase()) !== -1);
      }
      return [];
    },
    displayOptions(): Array<TdOptionProps> {
      // 展示优先级，用户远程搜索传入>组件通过filter过滤>getOptions后的完整数据
      if (isFunction(this.onSearch) || this.$listeners.search) {
        return this.realOptions;
      } if (this.canFilter && !this.creatable) {
        if (this.searchInput === '') {
          return this.realOptions;
        }
        return this.filterOptions;
      }
      return this.realOptions;
    },
    displayOptionsMap(): Map<TdOptionProps, boolean> {
      const map = new Map();
      this.displayOptions.forEach((item) => {
        map.set(item, true);
      });
      return map;
    },
  },
  watch: {
    showFilter(val) {
      if (val && this.selectedSingle) {
        this.$nextTick(() => {
          this.doFocus();
        });
      }
    },
    searchInput(val) {
      if (isFunction(this.onSearch) || this.$listeners.search) {
        this.debounceOnRemote();
      }
      if (this.canFilter && val && this.creatable) {
        const tmp = this.realOptions.filter((item) => get(item, this.realLabel).toString() === val);
        this.showCreateOption = !tmp.length;
      } else {
        this.showCreateOption = false;
      }
    },
    options: {
      immediate: true,
      handler(options: SelectOption[]) {
        if (Array.isArray(options)) {
          this.realOptions = this.getRealOptions(options);
        } else {
          console.error('TDesign Select: options must be an array.');
        }
      },
    },
  },
  methods: {
    getRealOptions(options: SelectOption[]): Array<TdOptionProps> {
      if (this.isGroupOption) {
        let arr: TdOptionProps[] = [];
        options.forEach((item) => {
          if ('children' in item) {
            arr = arr.concat(item.children);
          }
        });
        return arr;
      }
      return [...options];
    },
    multiLimitDisabled(value: string | number) {
      if (this.multiple && this.max) {
        if (
          Array.isArray(this.value)
          && this.value.indexOf(value) === -1
          && this.max <= this.value.length
        ) {
          return true;
        }
      }
      return false;
    },
    visibleChange(val: boolean) {
      emitEvent<Parameters<TdSelectProps['onVisibleChange']>>(this, 'visible-change', val);
      if (this.focusing && !val) {
        this.visible = true;
        return;
      }
      this.visible = val;
      if (!val) {
        if (!this.multiple || !this.reserveKeyword || this.creatable) {
          this.searchInput = '';
        }
      }
      val && this.monitorWidth();
      val && this.canFilter && this.doFocus();
    },
    onOptionClick(value: string | number, e: MouseEvent) {
      if (this.value !== value) {
        if (this.multiple) {
          const tempValue = Array.isArray(this.value) ? [].concat(this.value) : [];
          if (this.labelInValue) {
            const index = tempValue.map((item) => get(item, this.realValue)).indexOf(value);
            if (index > -1) {
              this.removeTag(index, { e });
            } else {
              tempValue.push(this.realOptions.filter((item) => get(item, this.realValue) === value)[0]);
              this.emitChange(tempValue);
            }
          } else {
            const index = tempValue.indexOf(value);
            if (index > -1) {
              this.removeTag(index, { e });
            } else {
              tempValue.push(value);
              this.emitChange(tempValue);
            }
          }
        } else {
          this.emitChange(value);
        }
      }
      if (!this.multiple) {
        this.searchInput = '';
        this.hideMenu();
      } else {
        if (!this.reserveKeyword) {
          this.searchInput = '';
        }
        this.canFilter && this.doFocus();
      }
    },
    removeTag(index: number, context?: { e?: MouseEvent }) {
      const { e } = context || {};
      e && e.stopPropagation();
      if (this.disabled) {
        return;
      }
      const val = this.value[index];
      const removeOption = this.realOptions.filter((item) => get(item, this.realValue) === val);
      const tempValue = Array.isArray(this.value) ? [].concat(this.value) : [];
      tempValue.splice(index, 1);
      this.emitChange(tempValue);
      emitEvent<Parameters<TdSelectProps['onRemove']>>(this, 'remove', { value: val, data: removeOption[0], e });
    },
    hideMenu() {
      this.visible = false;
    },
    clearSelect(e: MouseEvent) {
      e.stopPropagation();
      if (this.multiple) {
        this.emitChange([]);
      } else {
        this.emitChange('');
      }
      this.focusing = false;
      this.searchInput = '';
      this.visible = false;
      emitEvent<Parameters<TdSelectProps['onClear']>>(this, 'clear', { e });
    },
    getOptions(option: OptionInstance) {
      // create option值不push到options里
      if (option.$el && option.$el.className.indexOf(`${name}-create-option-special`) !== -1) return;
      const tmp = this.realOptions.filter((item) => get(item, this.realValue) === option.value && get(item, this.realLabel) === option.label);
      if (!tmp.length) {
        this.hasOptions = true;
        const valueLabel = {};
        set(valueLabel, this.realValue, option.value);
        set(valueLabel, this.realLabel, option.label);
        const valueLabelAble = option.disabled ? { ...valueLabel, disabled: true } : valueLabel;
        this.realOptions = [valueLabelAble].concat(this.realOptions);
      }
    },
    destroyOptions(option: OptionInstance) {
      this.realOptions.forEach((item, index) => {
        if (item[this.realValue] === option.value && item[this.realLabel] === option.label) {
          this.realOptions.splice(index, 1);
        }
      });
    },
    emitChange(val: SelectValue | Array<SelectValue>) {
      let value: SelectValue | Array<SelectValue> | Array<TdOptionProps> | TdOptionProps;
      if (this.labelInValue) {
        if (Array.isArray(val)) {
          if (!val.length) {
            value = [];
          } else {
            value = val;
          }
        } else {
          const target = this.realOptions.filter((item) => get(item, this.realValue) === val);
          value = target.length ? target[0] : '';
        }
      } else {
        value = val;
      }
      emitEvent<Parameters<TdSelectProps['onChange']>>(this, 'change', value);
    },
    createOption(value: string | number) {
      emitEvent<Parameters<TdSelectProps['onCreate']>>(this, 'create', value);
    },
    debounceOnRemote: debounce(function (this: any) {
      emitEvent<Parameters<TdSelectProps['onSearch']>>(this, 'search', this.searchInput);
    }, 300),
    focus(e: FocusEvent) {
      this.focusing = true;
      emitEvent<Parameters<TdSelectProps['onFocus']>>(this, 'focus', { value: this.value, e });
    },
    blur(e: FocusEvent) {
      this.focusing = false;
      emitEvent<Parameters<TdSelectProps['onBlur']>>(this, 'blur', { value: this.value, e });
    },
    enter(e: KeyboardEvent) {
      emitEvent<Parameters<TdSelectProps['onEnter']>>(this, 'enter', {
        inputValue: this.searchInput,
        value: this.value,
        e,
      });
    },
    hoverEvent(v: boolean) {
      this.isHover = v;
    },
    getOverlayElm(): HTMLElement {
      let r;
      try {
        r = (this.$refs.popup as any).$refs.overlay || (this.$refs.popup as any).$refs.component.$refs.overlay;
      } catch (e) {
        console.warn('TDesign Warn:', e);
      }
      return r;
    },
    // 打开浮层时，监听trigger元素和浮层宽度，取max
    monitorWidth() {
      this.$nextTick(() => {
        let styles = (this.popupProps && this.popupProps.overlayStyle) || {};
        if (this.popupProps && isFunction(this.popupProps.overlayStyle)) {
          styles = this.popupProps.overlayStyle(this.$refs.select as HTMLElement) || {};
        }
        if (typeof styles === 'object' && !styles.width) {
          const elWidth = (this.$refs.select as HTMLElement).getBoundingClientRect().width;
          const popupWidth = this.getOverlayElm().getBoundingClientRect().width;
          const width = elWidth > DEFAULT_MAX_OVERLAY_WIDTH
            ? elWidth
            : Math.min(DEFAULT_MAX_OVERLAY_WIDTH, Math.max(elWidth, popupWidth));
          Vue.set(this.defaultProps.overlayStyle, 'width', `${Math.ceil(width)}px`);
        }
      });
    },
    getEmpty() {
      const useLocale = !this.empty && !this.$scopedSlots.empty;
      return useLocale ? this.t(this.global.empty) : renderTNodeJSX(this, 'empty');
    },
    getLoadingText() {
      const useLocale = !this.loadingText && !this.$scopedSlots.loadingText;
      return useLocale ? this.t(this.global.loadingText) : renderTNodeJSX(this, 'loadingText');
    },
    getPlaceholderText() {
      return this.placeholder || this.t(this.global.placeholder);
    },
    getCloseIcon() {
      const closeIconClass = [`${name}-right-icon`, `${name}-right-icon__clear`];
      if (isFunction(this.global.clearIcon)) {
        return (
          <span class={closeIconClass} onClick={this.clearSelect}>
            {this.global.clearIcon(this.$createElement)}
          </span>
        );
      }
      return (
        <t-icon-close
          class={closeIconClass}
          size={this.size}
          nativeOnClick={this.clearSelect}
        />
      );
    },
    doFocus() {
      const input = this.$refs.input as HTMLElement;
      input?.focus();
      this.focusing = true;
    },
    renderGroupOptions(options: SelectOptionGroup[]) {
      return (
        <ul>
          {options.map((groupList: SelectOptionGroup) => {
            const children = groupList.children.filter((item) => this.displayOptionsMap.get(item));
            return (
              <t-option-group label={groupList.group} divider={groupList.divider}>
                {this.renderOptions(children)}
              </t-option-group>
            );
          })}
        </ul>
      );
    },
    // options 直传时
    renderOptions(options: SelectOption[]) {
      return (
        <ul>
          {options.map((item: TdOptionProps, index: number) => (
            <t-option
              value={get(item, this.realValue)}
              label={get(item, this.realLabel)}
              content={item.content}
              disabled={item.disabled || this.multiLimitDisabled(get(item, this.realValue))}
              key={index}
            ></t-option>
          ))}
        </ul>
      );
    },
    // 两类：普通选择器和分组选择器
    renderDataWithOptions() {
      return this.isGroupOption
        ? this.renderGroupOptions(this.options as SelectOptionGroup[])
        : this.renderOptions(this.displayOptions);
    },
  },
  render(): VNode {
    const {
      classes,
      popupObject,
      disabled,
      popClass,
      size,
      showPlaceholder,
      selectedMultiple,
      multiple,
      showFilter,
      selectedSingle,
      filterPlaceholder,
      tipsClass,
      loading,
      loadingText,
      emptyClass,
      hasOptions,
      realLabel,
      showCreateOption,
      displayOptions,
    } = this;
    const children = renderTNodeJSX(this, 'default');
    const prefixIconSlot = renderTNodeJSX(this, 'prefixIcon');
    const emptySlot = this.getEmpty();
    const loadingTextSlot = this.getLoadingText();
    const placeholderText = this.getPlaceholderText();
    return (
      <div ref='select' class={`${name}-wrap`}>
        <Popup
          ref='popup'
          visible={this.visible}
          class={`${name}-popup-reference`}
          disabled={disabled}
          on={{ 'visible-change': this.visibleChange }}
          expandAnimation={true}
          { ...{ props: { ...popupObject, overlayClassName: popClass } } }
        >
          <div
            class={classes}
            onMouseenter={ this.hoverEvent.bind(null, true) }
            onMouseleave={ this.hoverEvent.bind(null, false) }
          >
            {
              prefixIconSlot && (<span class="t-select-left-icon">{ prefixIconSlot[0] }</span>)
            }
            {
              showPlaceholder && (
                <span class={`${name}-placeholder`}> { placeholderText }</span>
              )
            }
            {this.valueDisplay || this.$scopedSlots.valueDisplay
              ? renderTNodeJSX(this, 'valueDisplay', {
                params: { value: selectedMultiple, onClose: (index: number) => this.removeTag(index) },
              })
              : (
                selectedMultiple.map((item: TdOptionProps, index: number) => (
                  <tag
                    v-show={this.minCollapsedNum <= 0 || index < this.minCollapsedNum}
                    key={index}
                    size={size}
                    closable={!item.disabled && !disabled}
                    disabled={disabled}
                    style="max-width: 100%;"
                    maxWidth="100%"
                    title={get(item, realLabel)}
                    onClose={this.removeTag.bind(null, index)}
                  >
                    { get(item, realLabel) }
                  </tag>
                ))
              )
            }
            {this.collapsedItems || this.$scopedSlots.collapsedItems
              ? renderTNodeJSX(this, 'collapsedItems', {
                params: {
                  value: selectedMultiple,
                  collapsedSelectedItems: selectedMultiple.slice(this.minCollapsedNum),
                  count: selectedMultiple.length - this.minCollapsedNum,
                },
              })
              : <tag
                  v-show={this.minCollapsedNum > 0 && selectedMultiple.length > this.minCollapsedNum}
                  size={size}
                >
                  { `+${selectedMultiple.length - this.minCollapsedNum}` }
                </tag>
            }
            {!multiple && !showPlaceholder && !showFilter && (
              <span title={selectedSingle} class={`${name}-selectedSingle`}>{ selectedSingle }</span>
            )}
            {
              showFilter && (
                <t-input
                  ref='input'
                  v-model={this.searchInput}
                  size={size}
                  placeholder={ filterPlaceholder }
                  disabled={disabled}
                  class={`${name}-input`}
                  onFocus={this.focus}
                  onBlur={this.blur}
                  onEnter={this.enter}
                />
              )
            }
            {
              this.showArrow && !this.showLoading && (
                <fake-arrow overlayClassName={`${name}-right-icon`} isActive={ this.visible && !this.disabled}/>
              )
            }
            {
              this.showClose && !this.showLoading && this.getCloseIcon()
            }
            {
              this.showLoading && (
                <t-loading class={`${name}-right-icon ${name}-active-icon`} size="small"/>
              )
            }
          </div>
          <div slot='content'>
            <ul v-show={showCreateOption} class={`${name}-create-option`}>
              <t-option value={this.searchInput} label={this.searchInput} class={`${name}-create-option-special`} />
            </ul>
            {
              loading && (
                <li class={tipsClass}>{ loadingTextSlot || loadingText }</li>
              )
            }
            {
              !loading && !displayOptions.length && !showCreateOption && (
                <li class={emptyClass}>{ emptySlot }</li>
              )
            }
            {
              !hasOptions && displayOptions.length && !loading
                ? this.renderDataWithOptions()
                : <ul v-show={!loading && displayOptions.length} class={`${prefix}-select__groups`}>{children}</ul>
            }
          </div>
        </Popup>
      </div>
    );
  },
});
