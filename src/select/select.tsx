import Vue, { VNode } from 'vue';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import set from 'lodash/set';
import { CloseCircleFilledIcon } from 'tdesign-icons-vue';
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
const listName = `${name}__list`;
// trigger元素不超过此宽度时，下拉选项的最大宽度（用户未设置overStyle width时）
// 用户设置overStyle width时，以设置的为准
const DEFAULT_MAX_OVERLAY_WIDTH = 500;
// 默认垂直滚动条宽度 .narrow-scrollbar 8px
const DEFAULT_SCROLLY_WIDTH = 8;

export default mixins(getConfigReceiverMixins<Vue, SelectConfig>('select')).extend({
  name: 'TSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: { ...props },
  data() {
    return {
      // Form 表单控制禁用态时的变量
      formDisabled: undefined,
      isHover: false,
      visible: false,
      searchInput: '',
      showCreateOption: false,
      hasSlotOptions: false, // select的slot是否有options组件
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
      hoverIndex: -1,
      popupOpenTime: 250, // popup打开弹出层的延迟时间
      checkScroll: true, // 弹出层执行加宽事件（仅执行一次，且在有滚动条时执行）
      isInited: false,
    };
  },
  components: {
    CloseCircleFilledIcon,
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
        `${prefix}-select-polyfill`, // 基于select-input改造时需要移除，polyfill代码，同时移除common中此类名
        {
          [CLASSNAMES.STATUS.disabled]: this.tDisabled,
          [CLASSNAMES.STATUS.active]: this.visible,
          [CLASSNAMES.SIZE[this.size]]: this.size,
          [`${prefix}-has-prefix`]: this.$scopedSlots.prefixIcon,
          [`${prefix}-no-border`]: !this.bordered,
        },
      ];
    },
    popClass(): string {
      const { popupObject } = this;
      return `${popupObject.overlayClassName} ${name}__dropdown narrow-scrollbar`;
    },
    tipsClass(): ClassName {
      return [
        `${name}__loading-tips`,
        {
          [CLASSNAMES.SIZE[this.size]]: this.size,
        },
      ];
    },
    emptyClass(): ClassName {
      return [
        `${name}__empty`,
        {
          [CLASSNAMES.SIZE[this.size]]: this.size,
        },
      ];
    },
    tDisabled(): boolean {
      return this.formDisabled || this.disabled;
    },
    showPlaceholder(): boolean {
      if (
        !this.showFilter
        && ((!this.multiple && !this.selectedSingle)
          || (!this.multiple && typeof this.value === 'object' && !this.selectedSingle)
          || (this.multiple && !this.selectedMultiple.length)
          || this.value === null
          || this.value === undefined)
      ) {
        return true;
      }
      return false;
    },
    // 是否为分组选择器
    isGroupOption(): boolean {
      const firstOption = this.options?.[0];
      return !!(firstOption && 'group' in firstOption && 'children' in firstOption);
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
      return Boolean(
        this.clearable
          && this.isHover
          && !this.tDisabled
          && ((!this.multiple && (this.value || this.value === 0))
            || (this.multiple && Array.isArray(this.value) && this.value.length)),
      );
    },
    showRightArrow(): boolean {
      if (!this.showArrow) return false;
      return (
        !this.clearable
        || !this.isHover
        || this.tDisabled
        || (!this.multiple && !this.value && this.value !== 0)
        || (this.multiple && (!Array.isArray(this.value) || (Array.isArray(this.value) && !this.value.length)))
      );
    },
    canFilter(): boolean {
      return this.filterable || isFunction(this.filter);
    },
    showLoading(): boolean {
      return this.loading && !this.tDisabled;
    },
    showFilter(): boolean {
      if (this.tDisabled) return false;
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
          if (get(target[target.length - 1], this.realLabel) === '') {
            return get(target[target.length - 1], this.realValue);
          }
          return get(target[target.length - 1], this.realLabel);
        }
        return this.value.toString();
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
          set(valueLabel, this.realLabel, tmp.length ? get(tmp[tmp.length - 1], this.realLabel) : item);
          return tmp.length && tmp[tmp.length - 1].disabled ? { ...valueLabel, disabled: true } : valueLabel;
        });
      }
      return [];
    },
    popupObject(): PopupProps {
      const propsObject = this.popupProps ? { ...this.defaultProps, ...this.popupProps } : this.defaultProps;
      return propsObject;
    },
    filterOptions(): Array<TdOptionProps> {
      // filter优先级 filter方法>仅filterable
      if (isFunction(this.filter)) {
        return this.realOptions.filter((option) => this.filter(this.searchInput, option));
      }
      if (this.filterable) {
        // 仅有filterable属性时，默认不区分大小写过滤label
        return this.realOptions.filter(
          (option) => option[this.realLabel].toString().toLowerCase().indexOf(this.searchInput.toString().toLowerCase()) !== -1,
        );
      }
      return [];
    },
    displayOptions(): Array<TdOptionProps> {
      // 展示优先级，用户远程搜索传入>组件通过filter过滤>getOptions后的完整数据
      if (isFunction(this.onSearch) || this.$listeners.search) {
        return this.realOptions;
      }
      if (this.canFilter && !this.creatable) {
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
    hoverOptions(): Array<TdOptionProps> {
      if (!this.showCreateOption) {
        if (isFunction(this.filter) || this.filterable) {
          return this.filterOptions;
        }
        return this.realOptions;
      }
      const willCreateOption = [{ value: this.searchInput, label: this.searchInput }] as Array<TdOptionProps>;
      if (isFunction(this.filter) || this.filterable) {
        return willCreateOption.concat(this.filterOptions);
      }
      return willCreateOption.concat(this.realOptions);
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
      if (!val && !this.visible) return;
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
    visible() {
      this.visible && document.addEventListener('keydown', this.keydownEvent);
      !this.visible && document.removeEventListener('keydown', this.keydownEvent);
      !this.visible && (this.showCreateOption = false);
    },
  },
  methods: {
    getRealOptions(options: SelectOption[]): Array<TdOptionProps> {
      let result = [];
      if (this.isGroupOption) {
        let arr: TdOptionProps[] = [];
        options.forEach((item) => {
          if ('children' in item) {
            arr = arr.concat(item.children);
          }
        });
        result = arr;
      } else {
        result = [...options];
      }
      // support ['A', 'B', 'C'] this type of options
      return result.map((item) => {
        if (typeof item !== 'object') return { label: item, value: item };
        return item;
      });
    },
    multiLimitDisabled(value: string | number) {
      if (this.multiple && this.max) {
        if (Array.isArray(this.value) && this.value.indexOf(value) === -1 && this.max <= this.value.length) {
          return true;
        }
      }
      return false;
    },
    visibleChange(val: boolean) {
      emitEvent<Parameters<TdSelectProps['onVisibleChange']>>(this, 'visible-change', val);
      this.visible = val;
      if (!val) {
        this.searchInput = '';
      }
      val && this.monitorWidth();
      val && this.canFilter && this.doFocus();
    },
    onOptionClick(value: string | number, e: MouseEvent | KeyboardEvent) {
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
    removeTag(index: number, context?: { e?: MouseEvent | KeyboardEvent }) {
      const { e } = context || {};
      e?.stopPropagation();
      if (this.tDisabled) {
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
      emitEvent<Parameters<TdSelectProps['onVisibleChange']>>(this, 'visible-change', false);
    },
    clearSelect(e: MouseEvent) {
      e?.stopPropagation();
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
      if (option.$el && option.$el.className && option.$el.className.indexOf(`${name}__create-option--special`) !== -1) return;
      const tmp = this.realOptions.filter(
        (item) => get(item, this.realValue) === option.value && get(item, this.realLabel) === option.label,
      );
      if (!tmp.length) {
        this.hasSlotOptions = true;
        const valueLabel = {};
        set(valueLabel, this.realValue, option.value);
        set(valueLabel, this.realLabel, option.label);
        const valueLabelAble = option.disabled ? { ...valueLabel, disabled: true } : valueLabel;
        this.realOptions.push(valueLabelAble);
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
    createOption(value: string) {
      emitEvent<Parameters<TdSelectProps['onCreate']>>(this, 'create', value);
    },
    debounceOnRemote: debounce(function (this: any) {
      emitEvent<Parameters<TdSelectProps['onSearch']>>(this, 'search', this.searchInput);
    }, 300),
    focus(value: string, context: { e: FocusEvent }) {
      this.focusing = true;
      emitEvent<Parameters<TdSelectProps['onFocus']>>(this, 'focus', { value: this.value, e: context?.e });
    },
    blur(value: string, context: { e: FocusEvent | KeyboardEvent }) {
      this.focusing = false;
      emitEvent<Parameters<TdSelectProps['onBlur']>>(this, 'blur', { value: this.value, e: context?.e });
    },
    enter(value: string, context: { e: KeyboardEvent }) {
      emitEvent<Parameters<TdSelectProps['onEnter']>>(this, 'enter', {
        inputValue: this.searchInput,
        value: this.value,
        e: context?.e,
      });
    },
    keydownEvent(e: KeyboardEvent) {
      if (!this.hoverOptions.length) return;
      const preventKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'];
      if (preventKeys.includes(e.code)) {
        e.preventDefault();
      }
      switch (e.code) {
        case 'ArrowDown':
          if (this.hoverIndex === -1) {
            this.initHoverindex();
            return;
          }
          if (this.hoverIndex < this.hoverOptions.length - 1) {
            this.hoverIndex += 1;
            this.arrowDownOption();
          } else {
            this.hoverIndex = 0;
            this.arrowDownOption();
          }
          break;
        case 'ArrowUp':
          if (this.hoverIndex === -1) {
            this.initHoverindex();
            return;
          }
          if (this.hoverIndex > 0) {
            this.hoverIndex -= 1;
            this.arrowUpOption();
          } else {
            this.hoverIndex = this.hoverOptions.length - 1;
            this.arrowUpOption();
          }
          break;
        case 'Enter':
          if (this.hoverIndex === -1) return;
          if (this.showCreateOption && this.hoverIndex === 0) {
            this.createOption(this.searchInput);
          }
          this.hoverOptions[this.hoverIndex]
            && this.onOptionClick(this.hoverOptions[this.hoverIndex][this.realValue], e);
          break;
        case 'Escape':
        case 'Tab':
          this.visible = false;
          emitEvent<Parameters<TdSelectProps['onVisibleChange']>>(this, 'visible-change', false);
          this.searchInput = '';
          if (this.focusing) {
            this.blur(this.searchInput, { e });
          }
          break;
      }
    },
    arrowDownOption() {
      let count = 0;
      while (this.hoverIndex < this.hoverOptions.length) {
        if (!this.hoverOptions[this.hoverIndex] || !this.hoverOptions[this.hoverIndex].disabled) {
          break;
        }
        if (this.hoverIndex === this.hoverOptions.length - 1) {
          this.hoverIndex = 0;
        } else {
          this.hoverIndex += 1;
        }
        count += 1;
        if (count >= this.hoverOptions.length) break;
      }
    },
    arrowUpOption() {
      let count = 0;
      while (this.hoverIndex > -1) {
        if (!this.hoverOptions[this.hoverIndex] || !this.hoverOptions[this.hoverIndex].disabled) {
          break;
        }
        if (this.hoverIndex === 0) {
          this.hoverIndex = this.hoverOptions.length - 1;
        } else {
          this.hoverIndex -= 1;
        }
        count += 1;
        if (count >= this.hoverOptions.length) break;
      }
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
          styles = this.popupProps.overlayStyle(this.$refs.select as HTMLElement, this.$refs.content as HTMLElement) || {};
        }
        if (typeof styles === 'object' && !styles.width) {
          const elWidth = (this.$refs.select as HTMLElement).getBoundingClientRect().width;
          const popupWidth = this.getOverlayElm().getBoundingClientRect().width;
          const width = elWidth > DEFAULT_MAX_OVERLAY_WIDTH
            ? elWidth
            : Math.min(DEFAULT_MAX_OVERLAY_WIDTH, Math.max(elWidth, popupWidth));
          Vue.set(this.defaultProps, 'overlayStyle', { width: `${Math.ceil(width)}px` });
          // isuse-549 弹出层出现滚动条时，需要加上滚动条宽度，否则会挤压宽度，导致出现省略号
          if (this.checkScroll) {
            const timer = setTimeout(() => {
              const { scrollHeight, clientHeight } = this.getOverlayElm();
              if (scrollHeight > clientHeight) {
                Vue.set(this.defaultProps, 'overlayStyle', { width: `${Math.ceil(width) + DEFAULT_SCROLLY_WIDTH}px` });
              }
              this.checkScroll = false;
              clearTimeout(timer);
            }, this.popupOpenTime);
          }
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
      // TODO 基于select-input改造时需要移除，polyfill代码，同时移除common中此类名
      const closeIconClass = [`${name}__right-icon`, `${name}__right-icon-clear`, `${name}__right-icon-polyfill`];
      if (isFunction(this.global.clearIcon)) {
        return (
          <span class={closeIconClass} onClick={this.clearSelect}>
            {this.global.clearIcon(this.$createElement)}
          </span>
        );
      }
      return <CloseCircleFilledIcon class={closeIconClass} size={this.size} nativeOnClick={this.clearSelect} />;
    },
    doFocus() {
      const input = this.$refs.input as HTMLElement;
      input?.focus();
      this.focusing = true;
    },
    renderGroupOptions(options: SelectOptionGroup[]) {
      return (
        <ul class={listName}>
          {options.map((groupList: SelectOptionGroup) => {
            const children = groupList.children.filter((item) => this.displayOptionsMap.get(item));
            return (
              <t-option-group v-show={children.length} label={groupList.group} divider={groupList.divider}>
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
        <ul class={listName}>
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
    initHoverindex() {
      const ableOptionIndex = Object.keys(this.hoverOptions).filter((i) => !this.hoverOptions[i].disabled);
      const ableIndex = ableOptionIndex.length ? ableOptionIndex[0] : '0';
      if (!this.multiple && (typeof this.value === 'string' || typeof this.value === 'number')) {
        const targetIndex = Object.keys(this.hoverOptions).filter(
          (i) => get(this.hoverOptions[i], this.realValue) === this.value,
        );
        this.hoverIndex = targetIndex.length
          ? parseInt(targetIndex[targetIndex.length - 1], 10)
          : parseInt(ableIndex, 10);
      } else if (this.multiple) {
        this.hoverIndex = parseInt(ableIndex, 10);
        Array.isArray(this.value)
          && this.value.some((item: string | number | TdOptionProps) => {
            const targetIndex = Object.keys(this.hoverOptions).filter(
              (i) => (typeof item === 'object' && get(this.hoverOptions[i], this.realValue) === get(item, this.realValue))
                || get(this.hoverOptions[i], this.realValue) === item,
            );
            this.hoverIndex = targetIndex.length
              ? parseInt(targetIndex[targetIndex.length - 1], 10)
              : parseInt(ableIndex, 10);
            return this.hoverIndex !== -1;
          });
      }
    },

    renderContent() {
      const { loading, showCreateOption, displayOptions } = this;
      const children = renderTNodeJSX(this, 'default');
      const emptySlot = this.getEmpty();
      const loadingTextSlot = this.getLoadingText();
      return (
        <div slot="content" class={`${name}__dropdown-inner`}>
          {renderTNodeJSX(this, 'panelTopContent')}
          <ul v-show={showCreateOption} class={[`${name}__create-option`, listName]}>
            <t-option value={this.searchInput} label={this.searchInput} class={`${name}__create-option--special`} />
          </ul>
          {loading && <div class={this.tipsClass}>{loadingTextSlot}</div>}
          {!loading && !displayOptions.length && !showCreateOption && <div class={this.emptyClass}>{emptySlot}</div>}
          {!this.hasSlotOptions && displayOptions.length && !loading ? (
            this.renderDataWithOptions()
          ) : (
            <ul v-show={!loading && displayOptions.length} class={[`${prefix}-select__groups`, listName]}>
              {children}
            </ul>
          )}
          {renderTNodeJSX(this, 'panelBottomContent')}
        </div>
      );
    },
    /**
     * Parse options from slots before popup, execute only once
     */
    initOptions() {
      if (this.realOptions.length || this.isInited) return;

      const children = renderTNodeJSX(this, 'default');
      if (children) {
        this.realOptions = parseOptions(children);
        this.isInited = true;
        this.hasSlotOptions = true;
      }

      function parseOptions(vnodes: VNode[]): TdOptionProps[] {
        if (!vnodes) return [];
        return vnodes.reduce((options, vnode) => {
          const { componentOptions } = vnode;
          if (componentOptions?.tag === 't-option') {
            const propsData = componentOptions.propsData as any;
            return options.concat({
              label: propsData.label,
              value: propsData.value,
              disabled: propsData.disabled,
              content: componentOptions.children ? () => componentOptions.children : propsData.content,
              default: propsData.default,
            });
          }
          if (componentOptions?.tag === 't-option-group') {
            return options.concat(parseOptions(componentOptions.children));
          }
          return options;
        }, []);
      }
    },
  },

  mounted() {
    this.initOptions();
  },
  updated() {
    this.initOptions();
  },

  render(): VNode {
    const {
      classes,
      popupObject,
      tDisabled,
      popClass,
      size,
      showPlaceholder,
      selectedMultiple,
      multiple,
      showFilter,
      selectedSingle,
      filterPlaceholder,
      realLabel,
    } = this;
    const prefixIconSlot = renderTNodeJSX(this, 'prefixIcon');
    const placeholderText = this.getPlaceholderText();
    return (
      <div ref="select" class={`${name}__wrap`}>
        <Popup
          ref="popup"
          visible={this.visible}
          class={`${name}__popup-reference`}
          disabled={tDisabled}
          on={{ 'visible-change': this.visibleChange }}
          expandAnimation={true}
          {...{ props: { ...popupObject, overlayClassName: popClass } }}
        >
          <div
            class={classes}
            onMouseenter={this.hoverEvent.bind(null, true)}
            onMouseleave={this.hoverEvent.bind(null, false)}
          >
            {prefixIconSlot && <span class={`${name}__left-icon`}>{prefixIconSlot[0]}</span>}
            {showPlaceholder && <span class={`${name}__placeholder`}> {placeholderText}</span>}
            {this.valueDisplay || this.$scopedSlots.valueDisplay
              ? renderTNodeJSX(this, 'valueDisplay', {
                params: { value: selectedMultiple, onClose: (index: number) => this.removeTag(index) },
              })
              : selectedMultiple.map((item: TdOptionProps, index: number) => (
                  <tag
                    v-show={this.minCollapsedNum <= 0 || index < this.minCollapsedNum}
                    key={index}
                    size={size}
                    closable={!item.disabled && !tDisabled}
                    disabled={tDisabled}
                    style="max-width: 100%;"
                    maxWidth="100%"
                    onClose={this.removeTag.bind(null, index)}
                  >
                    {get(item, realLabel)}
                  </tag>
              ))}
            {this.collapsedItems || this.$scopedSlots.collapsedItems ? (
              renderTNodeJSX(this, 'collapsedItems', {
                params: {
                  value: selectedMultiple,
                  collapsedSelectedItems: selectedMultiple.slice(this.minCollapsedNum),
                  count: selectedMultiple.length - this.minCollapsedNum,
                },
              })
            ) : (
              <tag v-show={this.minCollapsedNum > 0 && selectedMultiple.length > this.minCollapsedNum} size={size}>
                {`+${selectedMultiple.length - this.minCollapsedNum}`}
              </tag>
            )}
            {!multiple && !showPlaceholder && !showFilter && <span class={`${name}__single`}>{selectedSingle}</span>}
            {showFilter && (
              <t-input
                ref="input"
                v-model={this.searchInput}
                size={size}
                placeholder={filterPlaceholder}
                disabled={tDisabled}
                class={`${name}__input`}
                readonly={!this.visible || !this.showFilter}
                onFocus={this.focus}
                onBlur={this.blur}
                onEnter={this.enter}
              />
            )}
            {this.showRightArrow && !this.showLoading && (
              // TODO 基于select-input改造时需要移除，polyfill代码，同时移除common中此类名
              <fake-arrow
                overlayClassName={`${name}__right-icon ${name}__right-icon-polyfill`}
                isActive={this.visible && !this.tDisabled}
              />
            )}
            {this.showClose && !this.showLoading && this.getCloseIcon()}
            {/* TODO 基于select-input改造时需要移除，polyfill代码，同时移除common中此类名 */}
            {this.showLoading && (
              <t-loading class={`${name}__right-icon ${name}__active-icon ${name}__right-icon-polyfill`} size="small" />
            )}
          </div>
          {this.renderContent()}
        </Popup>
      </div>
    );
  },
});
