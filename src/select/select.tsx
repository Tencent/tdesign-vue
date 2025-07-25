import {
  computed,
  defineComponent,
  ref,
  toRefs,
  watch,
  nextTick,
  getCurrentInstance,
  provide,
} from '@vue/composition-api';
import {
  cloneDeep, debounce, get, isArray, isFunction, isObject,
} from 'lodash-es';
import useDefaultValue from '../hooks/useDefaultValue';
import useVModel from '../hooks/useVModel';
import { useTNodeJSX } from '../hooks/tnode';
import { useConfig, usePrefixClass } from '../config-provider/useConfig';
import {
  TdSelectProps, SelectValue, TdOptionProps, SelectValueChangeTrigger,
} from './type';
import props from './props';
import TLoading from '../loading';
import Popup, { PopupVisibleChangeContext } from '../popup';
import TInput from '../input/index';
import Tag from '../tag/index';
import SelectInput from '../select-input';
import type {
  SelectInputValue,
  SelectInputChangeContext,
  SelectInputValueChangeContext,
  SelectInputRemoveTrigger,
} from '../select-input';
import FakeArrow from '../common-components/fake-arrow';
import { off, on } from '../utils/dom';
import Option from './option';
import SelectPanel from './select-panel';
import {
  getSingleContent,
  getMultipleContent,
  getNewMultipleValue,
  flattenOptions,
  getAllSelectableOption,
} from './util';
import useSelectOptions from './hooks/useSelectOptions';
import { SelectPanelInstance } from './instance';
import log from '../_common/js/log';
import useFormDisabled from '../hooks/useFormDisabled';
import type { OptionData, PlainObject } from '../common';

export type OptionInstance = InstanceType<typeof Option>;

export default defineComponent({
  name: 'TSelect',
  props: { ...props },
  components: {
    TInput,
    TLoading,
    Tag,
    Popup,
    TOption: Option,
    FakeArrow,
    SelectPanel,
  },
  setup(props: TdSelectProps, ctx) {
    const { t, global } = useConfig('select');
    const renderTNode = useTNodeJSX();
    const instance = getCurrentInstance();
    const selectInputRef = ref(null);
    const selectPanelRef = ref<SelectPanelInstance>();
    const popupOpenTime = ref(250);
    const { formDisabled } = useFormDisabled();
    const COMPONENT_NAME = usePrefixClass('select');
    const { classPrefix } = useConfig('classPrefix');

    const {
      valueType,
      disabled,
      size,
      value: valueProps,
      multiple,
      placeholder,
      loading,
      max,
      reserveKeyword,
      inputValue,
      popupVisible,
      minCollapsedNum,
      creatable,
    } = toRefs(props);

    const keys = computed(() => ({
      label: props.keys?.label || 'label',
      value: props.keys?.value || 'value',
      disabled: props.keys?.disabled || 'disabled',
    }));
    const {
      options: innerOptions, optionsMap, optionsList, optionsCache,
    } = useSelectOptions(props, instance, keys);

    const [value, setValue] = useVModel(valueProps, props.defaultValue, props.onChange, 'change');
    const innerValue = computed(() => {
      const isObjValue = valueType.value === 'object';
      let _value = value.value;
      // 多选场景 value 类型检测与修复
      if (!multiple.value && isArray(_value)) {
        log.warn('Select', 'Invalid value for "value" props: got an Array when multiple was set to false');
        _value = isObjValue ? {} : '';
      }
      if (multiple.value && !isArray(_value)) {
        log.warn('Select', 'Invalid value for "value" props: expected an Array when multiple was set to true');
        _value = [];
      }

      // 若为 object 类型 value，读取其 keys.value 中内容作为组件的 value 值
      if (isObjValue) {
        if (multiple.value) {
          return (_value as SelectValue[])
            .filter((option) => {
              const isObj = isObject(option);
              if (!isObj) {
                log.warn('Select', `Invalid value for "value" props: expected an Object, but got ${typeof option}`);
              }
              return isObj;
            })
            .map((option: PlainObject) => option[keys.value.value]);
        }
        const isObj = isObject(_value);
        if (!isObj) {
          log.warn('Select', `Invalid value for "value" props: expected an Object, but got ${typeof _value}`);
          return '';
        }
        return (_value as PlainObject)[keys.value.value];
      }
      // value 类型的 value 变量，直接返回
      return _value;
    });

    const setInnerValue = (
      newVal: SelectValue,
      context: { trigger: SelectValueChangeTrigger; e?: MouseEvent | KeyboardEvent },
      optionValue?: SelectValue,
    ) => {
      if (newVal === value.value) return;

      const selectedOptions: TdOptionProps[] = [];
      const { value: valueOfKeys, label: labelOfKeys } = keys.value;
      // 若为多选情况，将历史 value 加入 option 待取列表，兼容远程搜索改变 options 数组后旧选项无法找到的问题
      const oldValueMap = new Map<SelectValue, TdOptionProps>();
      if (multiple.value) {
        const mapValue = value.value || [];
        (mapValue as TdOptionProps[]).forEach?.((option: PlainObject) => {
          oldValueMap.set(option[valueOfKeys], option);
        });
      }
      const getOriginOptions = (val: SelectValue) => {
        const option = optionsMap.value.get(val);
        if (option) delete (option as any).index;
        return option;
      };
      const getFormatOption = (val: SelectValue) => {
        const option = optionsMap.value.get(val) || oldValueMap.get(val);
        if (option) delete (option as any).index;
        return {
          [valueOfKeys]: get(option, 'value'),
          [labelOfKeys]: get(option, 'label'),
        };
      };
      const addCache = (val: SelectValue) => {
        if (multiple.value) {
          const newCache: TdOptionProps[] = [];
          (val as SelectValue[]).forEach((item) => {
            const option = optionsMap.value.get(item);
            if (option) {
              newCache.push(option);
            }
          });
          optionsCache.value = Array.from(new Set([...newCache, ...optionsCache.value]));
        } else {
          const option = optionsMap.value.get(val);
          if (option) {
            optionsCache.value = Array.from(new Set([option, ...optionsCache.value]));
          }
        }
      };
      const getSelectedOption = (newVal: SelectValue) => {
        let selectedOption: SelectValue = getOriginOptions(newVal);
        if (!selectedOption && optionValue) {
          // 处理create场景
          selectedOption = { label: optionValue, value: optionValue };
        }
        return selectedOption;
      };

      // 构造 selectOptions
      if (multiple.value) {
        (newVal as SelectValue[]).forEach((v) => selectedOptions.push(getSelectedOption(v)));
      } else {
        selectedOptions.push(getSelectedOption(newVal));
      }
      // 当 value 为 object 类型时，通过 innerValue 寻找对应的 object
      if (valueType.value === 'object') {
        // eslint-disable-next-line no-param-reassign
        newVal = multiple.value
          ? (newVal as SelectValue[]).map((val) => getFormatOption(val))
          : getFormatOption(newVal);
      }

      const outputContext = { ...context, selectedOptions };
      if (optionValue) {
        const outputContextOption: SelectValue = getSelectedOption(optionValue);

        Reflect.set(outputContext, 'option', outputContextOption);
      }
      nextTick(() => {
        addCache(newVal);
      });
      setValue(newVal, outputContext);

      // 触发 remove 事件
      if (props.multiple && context.trigger === 'uncheck' && optionValue) {
        const removeContext = {
          value: optionValue as string | number,
          data: optionsMap.value.get(optionValue),
          e: context.e,
        };
        instance.emit('remove', removeContext);
        props.onRemove?.(removeContext);
      }
    };

    const [tInputValue, setTInputValue] = useDefaultValue(
      inputValue,
      props.defaultInputValue || '',
      props.onInputChange,
      'inputValue',
      'input-change',
    );

    const [innerPopupVisible, setInnerPopupVisible] = useDefaultValue(
      popupVisible,
      props.defaultPopupVisible,
      (visible: boolean, context: PopupVisibleChangeContext) => {
        props.onPopupVisibleChange?.(visible, context);
        instance.emit('visible-change', visible);
      },
      'popupVisible',
      'popup-visible-change',
    );

    const isDisabled = computed(() => formDisabled.value || disabled.value);
    const isLoading = computed(() => loading.value && !isDisabled.value);
    // 是否支持筛选
    const isFilterable = computed(() => Boolean(props.filterable || global.value.filterable || isFunction(props.filter)));
    // 选中项是否已达最大数量 max 限制
    const isReachMaxLimit = computed(
      () => multiple.value && max.value !== 0 && max.value <= (innerValue.value as SelectValue[]).length,
    );

    const getFilteredOptions = () => getAllSelectableOption(optionsList.value).filter((option) => {
      if (isFunction(props.filter)) {
        return props.filter(`${tInputValue.value}`, option);
      }
      return option.label?.toLowerCase()?.includes(`${tInputValue.value}`.toLowerCase());
    });

    const isAllOptionsChecked = computed(() => {
      const filteredOptions = getFilteredOptions();
      return filteredOptions.length === (innerValue.value as SelectValue[]).length;
    });

    const placeholderText = computed(
      () => ((!multiple.value
          && innerPopupVisible.value
          && ((valueType.value === 'object' && ((value.value as PlainObject)?.[keys.value.label] || innerValue.value))
            || getSingleContent(innerValue.value, optionsMap.value)))
          || placeholder.value)
        ?? t(global.value.placeholder),
    );

    const displayText = computed(() => {
      if (multiple.value) {
        if (valueType.value === 'object') {
          return (value.value as SelectValue[]).map((v: PlainObject) => v[keys.value.label]);
        }
        return getMultipleContent(innerValue.value as SelectValue[], optionsMap.value);
      }
      if (valueType.value === 'object') {
        return (value.value as PlainObject)?.[keys.value.label] || innerValue.value;
      }
      return getSingleContent(innerValue.value, optionsMap.value);
    });

    const valueDisplayParams = computed(() => {
      const val = multiple.value
        ? (innerValue.value as SelectValue[]).map((value) => ({
          value,
          label: optionsMap.value.get(value)?.label,
        }))
        : innerValue.value;
      const params = {
        value: val,
        onClose: multiple.value ? (index: number) => removeTag(index) : () => {},
      };
      if (minCollapsedNum.value && multiple.value) {
        return {
          ...params,
          displayValue: val?.slice?.(0, minCollapsedNum.value),
        };
      }
      return params;
    });

    const collapsedItemsParams = computed(() => {
      const tValue = innerValue.value || [];
      const values = Array.isArray(tValue) ? tValue : [tValue];
      return multiple.value
        ? {
          value: values,
          collapsedSelectedItems: values
            .map((item: any) => {
              const tmpValue = typeof item === 'object' ? item[props.keys?.value || 'value'] : item;
              return props.options?.find((t: OptionData) => t.value === tmpValue);
            })
            .slice(minCollapsedNum.value),
          count: values.length - minCollapsedNum.value,
          onClose: (index: number) => removeTag(index),
        }
        : {};
    });

    const removeTag = (index: number, context?: SelectInputChangeContext) => {
      const { e, trigger = 'tag-remove' } = (context as SelectInputChangeContext & { trigger: SelectInputRemoveTrigger }) || {};
      e?.stopPropagation();
      if (isDisabled.value) {
        return;
      }
      const selectValue = cloneDeep(innerValue.value) as SelectValue[];
      const value = selectValue[index];
      selectValue.splice(index, 1);
      setInnerValue(selectValue, { e, trigger });
      const evtObj = {
        value: value as string | number,
        data: optionsMap.value.get(value),
        e,
      };
      instance.emit('remove', evtObj);
      props.onRemove?.(evtObj);
    };

    // 全选点击回调，t-option 的事件调用到这里处理
    const handleCheckAllClick = (e: MouseEvent | KeyboardEvent) => {
      const filteredOptions = getFilteredOptions();
      setInnerValue(
        isAllOptionsChecked.value ? [] : filteredOptions.map((option) => option.value).slice(0, max.value || Infinity),
        { e, trigger: isAllOptionsChecked.value ? 'uncheck' : 'check' },
      );
      !reserveKeyword?.value && setTInputValue('', { e, trigger: 'change' });
    };

    const handleCreate = (e: KeyboardEvent) => {
      if (!tInputValue.value) return;
      const createVal = tInputValue.value;
      // 只有多选情况下需要帮用户清除一次输入框内容，单选场景选中后 popup 消失，携带内容清除的作用
      multiple.value && setTInputValue('', { e, trigger: 'change' });
      instance.emit('create', createVal);
      props.onCreate?.(createVal);
    };

    const handleClear = ({ e }: { e: MouseEvent }) => {
      e?.stopPropagation();
      if (multiple.value) {
        setInnerValue([], { trigger: 'clear', e });
      } else {
        setInnerValue('', { trigger: 'clear', e });
      }
      instance.emit('clear', { e });
      props.onClear?.({ e });
    };

    const handleTInputValueChange = (val: string, context: SelectInputValueChangeContext) => {
      if (context.trigger === 'blur' || !innerPopupVisible.value) return;
      setTInputValue(val, context);
      debounceSearch({ e: context.e as KeyboardEvent });
    };

    const handleTagChange = (currentTags: SelectInputValue, context: SelectInputChangeContext) => {
      const { trigger, index } = context;

      if (['tag-remove', 'backspace'].includes(trigger)) {
        removeTag(index, context);
      }
    };

    const handleFocus = (value: string, context: { e: FocusEvent }) => {
      instance.emit('focus', { value, e: context?.e });
      props.onFocus?.({ value, e: context?.e });
    };

    const handleBlur = (value: string, context: { e: FocusEvent | KeyboardEvent }) => {
      instance.emit('blur', { value, e: context?.e });
      props.onBlur?.({ value, e: context?.e });
    };

    const handleEnter = (value: string, context: { e: KeyboardEvent }) => {
      instance.emit('enter', { value, e: context?.e, inputValue: tInputValue.value });
      props.onEnter?.({ value, e: context?.e, inputValue: tInputValue.value.toString() });
    };

    const debounceSearch = debounce((context: { e: KeyboardEvent }) => {
      instance.emit('search', tInputValue.value);
      props.onSearch?.(tInputValue.value.toString(), { e: context.e });
    }, 300);

    const getOverlayElm = (): HTMLElement => {
      let r;
      try {
        const popupRefs = selectInputRef.value.$refs.selectInputPopupRef.$refs;
        r = popupRefs.overlay || popupRefs.component.$refs.overlay;
      } catch (e) {
        log.warn('Select', e);
      }
      return r;
    };

    const updateScrollTop = (content: HTMLDivElement) => {
      // 虚拟滚动不支持移动定位到选中项
      if (props.scroll?.type === 'virtual') return;
      const overlayEl = getOverlayElm();
      if (!overlayEl) return;
      const firstSelectedNode: HTMLDivElement = overlayEl?.querySelector(`.${classPrefix.value}-is-selected`);
      nextTick(() => {
        if (firstSelectedNode && content) {
          const { paddingBottom } = getComputedStyle(firstSelectedNode);
          const { marginBottom } = getComputedStyle(content);
          const elementBottomHeight = parseInt(paddingBottom, 10) + parseInt(marginBottom, 10);
          // 小于0时不需要特殊处理，会被设为0
          const updateValue = firstSelectedNode.offsetTop
            - content.offsetTop
            - (content.clientHeight - firstSelectedNode.clientHeight)
            + elementBottomHeight;
          // eslint-disable-next-line no-param-reassign
          content.scrollTop = updateValue;
        }
      });
    };

    // 键盘操作逻辑相关
    const hoverIndex = ref(-1);
    const keydownEvent = (e: KeyboardEvent) => {
      const displayOptions: (TdOptionProps & { isCreated?: boolean })[] = flattenOptions(
        selectPanelRef.value?.getDisplayOptions(),
      );

      const displayOptionsLength = displayOptions.length;
      const arrowDownOption = () => {
        let count = 0;
        while (hoverIndex.value < displayOptionsLength) {
          if (!(displayOptions[hoverIndex.value] as TdOptionProps)?.disabled) {
            break;
          }
          if (hoverIndex.value === displayOptionsLength - 1) {
            hoverIndex.value = 0;
          } else {
            hoverIndex.value += 1;
          }
          count += 1;
          if (count >= displayOptionsLength) break;
        }
        setHoverIntoView();
      };
      const arrowUpOption = () => {
        let count = 0;
        while (hoverIndex.value > -1) {
          if (!(displayOptions[hoverIndex.value] as TdOptionProps)?.disabled) {
            break;
          }
          if (hoverIndex.value === 0) {
            hoverIndex.value = displayOptionsLength - 1;
          } else {
            hoverIndex.value -= 1;
          }
          count += 1;
          if (count >= displayOptionsLength) break;
        }
        setHoverIntoView();
      };
      /** 让hover元素滚动到下拉面板视口 */
      const setHoverIntoView = () => {
        nextTick(() => {
          const hoverDom = selectPanelRef.value?.$el.querySelector(
            `li.${classPrefix.value}-select-option.${classPrefix.value}-select-option__hover`,
          ) as HTMLElement | null;
          if (hoverDom) {
            const container = selectPanelRef.value.$el.parentNode as HTMLElement;
            const containerRect = container.getBoundingClientRect();
            const hoverDomRect = hoverDom.getBoundingClientRect();
            const offsetTop = hoverDomRect.top - containerRect.top + container.scrollTop;
            container.scrollTo({
              top: offsetTop - (container.offsetHeight - hoverDom.offsetHeight * 2),
              behavior: 'smooth',
            });
          }
        });
      };
      if (displayOptionsLength === 0) return;
      const preventKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'];
      if (preventKeys.includes(e.code) && selectInputRef.value?.$el.contains(e.target)) {
        e.preventDefault();
      }
      switch (e.code) {
        case 'ArrowDown':
          if (hoverIndex.value === -1) {
            hoverIndex.value = 0;
            return;
          }
          if (hoverIndex.value < displayOptionsLength - 1) {
            hoverIndex.value += 1;
            arrowDownOption();
          } else {
            hoverIndex.value = 0;
            arrowDownOption();
          }
          break;
        case 'ArrowUp':
          if (hoverIndex.value === -1) {
            hoverIndex.value = 0;
            return;
          }
          if (hoverIndex.value > 0) {
            hoverIndex.value -= 1;
            arrowUpOption();
          } else {
            hoverIndex.value = displayOptionsLength - 1;
            arrowUpOption();
          }
          break;
        case 'Enter':
          // 当支持创建、且 hoverIndex 为 -1(未选中)/0(创建条目)、第一项为创建项的时候，才视为触发 create 回调，并继续键盘事件
          if (creatable.value && hoverIndex.value < 1 && displayOptions?.[0]?.isCreated) {
            handleCreate(e);
          } else if (hoverIndex.value === -1) {
            // 否则视为选择列表中筛选出的已有项目
            // 当 hoverIndex 为 -1，即未选中任意项的时候，不触发其他键盘事件
            return;
          }
          // enter 选中逻辑
          if (multiple.value && (displayOptions[hoverIndex.value] as TdOptionProps).checkAll) {
            handleCheckAllClick(e);
          } else {
            const optionValue = (displayOptions[hoverIndex.value] as TdOptionProps)?.value;

            if (!optionValue) return;
            if (!multiple.value) {
              setInnerValue(optionValue, { e, trigger: 'check' }, optionValue);
              setInnerPopupVisible(false, { e });
            } else {
              const newValue = getNewMultipleValue(innerValue.value, optionValue);
              setInnerValue(newValue.value, { e, trigger: newValue.isCheck ? 'check' : 'uncheck' }, optionValue);
            }
          }
          break;
        case 'Escape':
        case 'Tab':
          setInnerPopupVisible(false, { trigger: 'keydown-esc', e });
          setTInputValue('', { e, trigger: 'blur' });
          break;
      }
    };

    // 为 eventListener 加单独的 sync watch，以防组件在卸载的时候未能正常清除监听 (https://github.com/Tencent/tdesign-vue/issues/1170)
    watch(
      innerPopupVisible,
      (val) => {
        val && on(document, 'keydown', keydownEvent);
        !val && off(document, 'keydown', keydownEvent);
      },
      {
        flush: 'sync',
      },
    );
    // 其余逻辑使用默认 pre watch
    watch(innerPopupVisible, (value) => {
      if (value) {
        // 显示 popup 的时候重置 hover 选项下标
        hoverIndex.value = -1;
      } else {
        tInputValue.value && setTInputValue('', { trigger: 'blur' });
      }
    });
    provide('tSelect', {
      size,
      multiple,
      popupOpenTime,
      hoverIndex,
      selectValue: innerValue,
      reserveKeyword,
      isReachMaxLimit,
      isAllOptionsChecked,
      getOverlayElm,
      handleCheckAllClick,
      handleCreate,
      handleValueChange: setInnerValue,
      handlerInputChange: setTInputValue,
      handlePopupVisibleChange: setInnerPopupVisible,
      isRemoteSearch: Boolean(props.onSearch || ctx.listeners?.search),
    });

    return {
      isFilterable,
      isDisabled,
      isLoading,
      innerOptions,
      placeholderText,
      selectInputRef,
      selectPanelRef,
      innerPopupVisible,
      displayText,
      tInputValue,
      collapsedItemsParams,
      valueDisplayParams,
      handleFocus,
      handleBlur,
      handleEnter,
      handleClear,
      handleTagChange,
      handleTInputValueChange,
      setInnerPopupVisible,
      removeTag,
      renderTNode,
      updateScrollTop,
      componentName: COMPONENT_NAME,
    };
  },

  methods: {
    renderSuffixIcon() {
      const suffixIcon = this.renderTNode('suffixIcon');
      if (suffixIcon) return suffixIcon;
      const {
        isLoading, showArrow, innerPopupVisible, isDisabled,
      } = this;
      if (isLoading) {
        return (
          <t-loading class={[`${this.componentName}__right-icon`, `${this.componentName}__active-icon`]} size="small" />
        );
      }
      return showArrow ? (
        <fake-arrow
          overlayClassName={`${this.componentName}__right-icon`}
          isActive={innerPopupVisible && !isDisabled}
        />
      ) : null;
    },

    renderLabel() {
      const label = this.renderTNode('label');
      const prefixIcon = this.renderTNode('prefixIcon');
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
  },

  render() {
    const { renderTNode } = this;

    const { overlayClassName, ...restPopupProps } = this.popupProps || {};

    return (
      <div ref="select" class={`${this.componentName}__wrap`}>
        <SelectInput
          ref="selectInputRef"
          class={this.componentName}
          scopedSlots={{
            tips: this.$scopedSlots.tips,
            tag: this.$scopedSlots.tag,
            suffix: this.$scopedSlots.suffix,
          }}
          {...{
            props: {
              autoWidth: this.autoWidth,
              borderless: this.borderless,
              readonly: this.readonly,
              allowInput: this.isFilterable,
              multiple: this.multiple,
              keys: this.keys,
              status: this.status,
              tips: this.tips,
              suffix: this.suffix,
              tag: this.tag,
              value: this.displayText,
              valueDisplay: () => renderTNode('valueDisplay', { params: this.valueDisplayParams }),
              clearable: this.clearable,
              disabled: this.isDisabled,
              label: this.renderLabel,
              suffixIcon: this.renderSuffixIcon,
              placeholder: this.placeholderText,
              inputValue: this.tInputValue,
              inputProps: {
                size: this.size,
                ...this.inputProps,
              },
              tagInputProps: { size: this.size, ...this.tagInputProps },
              tagProps: this.tagProps,
              minCollapsedNum: this.minCollapsedNum,
              collapsedItems: () => renderTNode('collapsedItems', { params: this.collapsedItemsParams }),
              popupVisible: this.innerPopupVisible,
              popupProps: {
                overlayClassName: [`${this.componentName}__dropdown`, overlayClassName],
                ...restPopupProps,
              },
              updateScrollTop: this.updateScrollTop,
              ...this.selectInputProps,
              panel: () => (
                <select-panel
                  ref="selectPanelRef"
                  scopedSlots={this.$scopedSlots}
                  size={this.size}
                  options={this.innerOptions}
                  inputValue={this.tInputValue}
                  multiple={this.multiple}
                  empty={this.empty}
                  filter={this.filter}
                  filterable={this.isFilterable}
                  creatable={this.creatable}
                  scroll={this.scroll}
                  loading={this.isLoading}
                  loadingText={this.loadingText}
                  panelTopContent={this.panelTopContent}
                  panelBottomContent={this.panelBottomContent}
                />
              ),
            },
            on: {
              focus: this.handleFocus,
              blur: this.handleBlur,
              enter: this.handleEnter,
              clear: this.handleClear,
              'input-change': this.handleTInputValueChange,
              'popup-visible-change': this.setInnerPopupVisible,
              'tag-change': this.handleTagChange,
            },
          }}
        />
      </div>
    );
  },
});
