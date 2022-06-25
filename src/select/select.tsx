import {
  computed,
  defineComponent,
  ref,
  SetupContext,
  toRefs,
  watch,
  nextTick,
  getCurrentInstance,
  onMounted,
  onUpdated,
  provide,
} from '@vue/composition-api';
import { CreateElement } from 'vue';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import set from 'lodash/set';
import { CloseCircleFilledIcon } from 'tdesign-icons-vue';
import useDefaultValue from '../hooks/useDefaultValue';
import { useTNodeJSX } from '../hooks/tnode';
import { useConfig } from '../config-provider/useConfig';
import { TdSelectProps, SelectOption, TdOptionProps } from './type';
import props from './props';
import { prefix } from '../config';
import TLoading from '../loading';
import Popup, { PopupVisibleChangeContext } from '../popup';
import TInput from '../input/index';
import Tag from '../tag/index';
import SelectInput, {
  SelectInputValue,
  SelectInputChangeContext,
  SelectInputValueChangeContext,
} from '../select-input';
import FakeArrow from '../common-components/fake-arrow';
import Option from './option';
import SelectPanel from './select-panel';
import { parseOptions } from './util';

export type OptionInstance = InstanceType<typeof Option>;

export const name = `${prefix}-select`;

export default defineComponent({
  name: 'TSelect',
  props: { ...props },
  components: {
    CloseCircleFilledIcon,
    TInput,
    TLoading,
    Tag,
    Popup,
    TOption: Option,
    FakeArrow,
    SelectPanel,
  },
  setup(props: TdSelectProps, context: SetupContext) {
    const instance = getCurrentInstance();
    const { t, global } = useConfig('select');
    const renderTNode = useTNodeJSX();

    // init values
    const {
      valueType,
      keys,
      disabled,
      size,
      value: valueProps,
      multiple,
      filterable,
      options,
      placeholder,
      valueDisplay,
      loading,
      creatable,
      max,
      reserveKeyword,
      onSearch,
      inputValue,
      minCollapsedNum,
    } = toRefs(props);

    const formDisabled = ref();
    const visible = ref(props.popupVisible ?? false);
    const [value, setValue] = useDefaultValue(valueProps, props.defaultValue, props.onChange, 'value', 'change');
    const [tInputValue, setTInputValue] = useDefaultValue(
      inputValue,
      props.defaultInputValue || '',
      props.onInputChange,
      'inputValue',
      'input-change',
    );
    const showCreateOption = ref(false);
    const hasSlotOptions = ref(false);
    const focusing = ref(false);
    const labelInValue = ref(valueType.value === 'object');
    const realValue = ref(keys.value?.value || 'value');
    const realLabel = ref(keys.value?.label || 'label');
    const realOptions = ref([] as Array<TdOptionProps>);
    const hoverIndex = ref(-1);
    const popupOpenTime = ref(250);
    const isInit = ref(false);
    const selectInputRef = ref<HTMLElement>(null);

    const tDisabled = computed(() => formDisabled.value || disabled.value);
    const renderValueDisplay = (h: CreateElement) => {
      const valueSlot = context.slots.valueDisplay;
      const valueProps = valueDisplay.value;

      if (!valueProps && !valueSlot) return '';

      if (typeof valueProps === 'string') {
        return valueProps;
      }
      // 参数比slot优先
      if (typeof valueProps === 'function') {
        return () => valueProps(h, { value: selectedValue.value, onClose: (index: number) => removeTag(index) });
      }
      // 处理slot场景
      if (valueSlot) {
        if (multiple.value) {
          return () => renderTNode('valueDisplay', {
            params: { value: selectedValue.value, onClose: (index: number) => removeTag(index) },
          });
        }
        return () => selectedValue.value
          ? renderTNode('valueDisplay', {
            params: { value: selectedValue.value, onClose: () => {} },
          })
          : '';
      }
    };
    const showFilter = computed(() => {
      if (tDisabled.value) return false;
      if (!multiple.value && selectedSingle.value && canFilter.value) {
        return visible.value;
      }
      return canFilter.value;
    });

    const selectedSingle = computed<string>(() => {
      if (!multiple.value && (typeof value.value === 'string' || typeof value.value === 'number')) {
        let target: Array<TdOptionProps> = [];
        if (realOptions.value && realOptions.value.length) {
          target = realOptions.value.filter((item) => get(item, realValue.value) === value.value);
        }
        if (target.length) {
          if (get(target[target.length - 1], realLabel.value) === '') {
            return get(target[target.length - 1], realValue.value);
          }
          return get(target[target.length - 1], realLabel.value);
        }
        return value.value.toString();
      }
      const showText = get(value.value, realLabel.value);
      // label为空时显示value值
      if (!multiple.value && typeof value.value === 'object' && showText !== undefined) {
        return showText === '' ? get(value.value, realValue.value) : showText;
      }
      return '';
    });

    const selectedMultiple = computed<TdOptionProps[]>(() => {
      if (multiple.value && Array.isArray(value.value) && value.value.length) {
        return value.value.map((item: string | number | TdOptionProps) => {
          if (typeof item === 'object') {
            return item;
          }
          const tmp = realOptions.value.filter((op) => get(op, realValue.value) === item);
          const valueLabel = {};
          set(valueLabel, realValue.value, item);
          set(valueLabel, realLabel.value, tmp.length ? get(tmp[tmp.length - 1], realLabel.value) : item);
          return tmp.length && tmp[tmp.length - 1].disabled ? { ...valueLabel, disabled: true } : valueLabel;
        });
      }
      return [];
    });

    const selectedValue = computed(() => (multiple.value ? selectedMultiple.value : selectedSingle.value));
    const canFilter = computed(() => Boolean((global.value.filterable ?? props.filterable) || isFunction(props.filter)));
    const isGroupOption = computed(() => {
      const firstOption = options.value?.[0];
      return !!(firstOption && 'group' in firstOption && 'children' in firstOption);
    });

    const renderCollapsedItems = () => renderTNode('collapsedItems', {
      params: {
        value: selectedMultiple.value,
        collapsedSelectedItems: selectedMultiple.value.slice(minCollapsedNum.value),
        count: selectedMultiple.value.length - minCollapsedNum.value,
      },
    });

    const showLoading = computed(() => loading.value && !tDisabled.value);
    const filterOptions = computed(() => {
      // filter优先级 filter方法>仅filterable
      if (isFunction(props.filter)) {
        return realOptions.value.filter((option) => props.filter(tInputValue.value?.toString(), option));
      }
      if (filterable.value) {
        // 仅有filterable属性时，默认不区分大小写过滤label
        return realOptions.value.filter(
          (option) => option[realLabel.value].toString().toLowerCase().indexOf(tInputValue.value?.toString().toLowerCase())
            !== -1,
        );
      }
      return [];
    });

    const displayOptions = computed(() => {
      // 展示优先级，用户远程搜索传入>组件通过filter过滤>getOptions后的完整数据
      if (isFunction(onSearch.value) || context.listeners.search) {
        return realOptions.value;
      }
      if (canFilter.value && !creatable.value) {
        if (tInputValue.value === '') {
          return realOptions.value;
        }
        return filterOptions.value;
      }
      return realOptions.value;
    });

    const displayOptionsMap = computed(() => {
      const map = new Map();
      displayOptions.value.forEach((item) => {
        map.set(item, true);
      });
      return map;
    });

    const hoverOptions = computed(() => {
      if (!showCreateOption.value) {
        if (isFunction(props.filter) || filterable.value) {
          return filterOptions.value;
        }
        return realOptions.value;
      }
      const willCreateOption = [{ value: tInputValue.value, label: tInputValue.value }] as Array<TdOptionProps>;
      if (isFunction(props.filter) || filterable.value) {
        return willCreateOption.concat(filterOptions.value);
      }
      return willCreateOption.concat(realOptions.value);
    });

    const doFocus = () => {
      const input = (selectInputRef.value as any).$refs[multiple.value ? 'tagInputRef' : 'inputRef'].$el.querySelector(
        'input',
      );
      input?.focus();
      focusing.value = true;
    };
    watch(showFilter, (val) => {
      if (val && selectedSingle.value) {
        nextTick(() => {
          doFocus();
        });
      }
    });

    const debounceOnRemote = debounce(() => {
      instance.emit('search', tInputValue.value);
    }, 300);

    watch(
      tInputValue,
      (val) => {
        if (!val && !visible.value) return;
        // 远程搜索逻辑
        if (isFunction(props.onSearch) || context.listeners.search) {
          debounceOnRemote();
        }
        // 创建条目逻辑
        if (canFilter.value && val && creatable.value) {
          const tmp = realOptions.value.filter((item) => get(item, realLabel.value).toString() === val);
          showCreateOption.value = !tmp.length;
        } else {
          showCreateOption.value = false;
        }
      },
      { flush: 'post' },
    );

    const getRealOptions = (options: SelectOption[]): Array<TdOptionProps> => {
      let result = [];
      if (isGroupOption.value) {
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
    };
    watch(
      options,
      (val) => {
        if (Array.isArray(val)) {
          realOptions.value = getRealOptions(val);
        } else {
          console.error('TDesign Select: options must be an array.');
        }
      },
      {
        immediate: true,
      },
    );

    const initHoverIndex = () => {
      const ableOptionIndex = Object.keys(hoverOptions.value).filter((i) => !hoverOptions.value[i].disabled);
      const ableIndex = ableOptionIndex.length ? ableOptionIndex[0] : '0';
      if (!multiple.value && (typeof value.value === 'string' || typeof value.value === 'number')) {
        const targetIndex = Object.keys(hoverOptions.value).filter(
          (i) => get(hoverOptions.value[i], realValue.value) === value.value,
        );
        hoverIndex.value = targetIndex.length
          ? parseInt(targetIndex[targetIndex.length - 1], 10)
          : parseInt(ableIndex, 10);
      } else if (multiple.value) {
        hoverIndex.value = parseInt(ableIndex, 10);
        Array.isArray(value.value)
          && value.value.some((item: string | number | TdOptionProps) => {
            const targetIndex = Object.keys(hoverOptions.value).filter(
              (i) => (typeof item === 'object'
                  && get(hoverOptions.value[i], realValue.value) === get(item, realValue.value))
                || get(hoverOptions.value[i], realValue.value) === item,
            );
            hoverIndex.value = targetIndex.length
              ? parseInt(targetIndex[targetIndex.length - 1], 10)
              : parseInt(ableIndex, 10);
            return hoverIndex.value !== -1;
          });
      }
    };
    const arrowDownOption = () => {
      let count = 0;
      while (hoverIndex.value < hoverOptions.value.length) {
        if (!hoverOptions.value[hoverIndex.value]?.disabled) {
          break;
        }
        if (hoverIndex.value === hoverOptions.value.length - 1) {
          hoverIndex.value = 0;
        } else {
          hoverIndex.value += 1;
        }
        count += 1;
        if (count >= hoverOptions.value.length) break;
      }
    };
    const arrowUpOption = () => {
      let count = 0;
      while (hoverIndex.value > -1) {
        if (!hoverOptions.value[hoverIndex.value]?.disabled) {
          break;
        }
        if (hoverIndex.value === 0) {
          hoverIndex.value = hoverOptions.value.length - 1;
        } else {
          hoverIndex.value -= 1;
        }
        count += 1;
        if (count >= hoverOptions.value.length) break;
      }
    };
    const keydownEvent = (e: KeyboardEvent) => {
      if (!hoverOptions.value.length) return;
      const preventKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'];
      if (preventKeys.includes(e.code)) {
        e.preventDefault();
      }
      switch (e.code) {
        case 'ArrowDown':
          if (hoverIndex.value === -1) {
            initHoverIndex();
            return;
          }
          if (hoverIndex.value < hoverOptions.value.length - 1) {
            hoverIndex.value += 1;
            arrowDownOption();
          } else {
            hoverIndex.value = 0;
            arrowDownOption();
          }
          break;
        case 'ArrowUp':
          if (hoverIndex.value === -1) {
            initHoverIndex();
            return;
          }
          if (hoverIndex.value > 0) {
            hoverIndex.value -= 1;
            arrowUpOption();
          } else {
            hoverIndex.value = hoverOptions.value.length - 1;
            arrowUpOption();
          }
          break;
        case 'Enter':
          if (hoverIndex.value === -1) return;
          if (showCreateOption.value && hoverIndex.value === 0) {
            createOption(tInputValue.value.toString());
          }
          hoverOptions.value[hoverIndex.value]
            && onOptionClick(hoverOptions.value[hoverIndex.value][realValue.value], e);
          break;
        case 'Escape':
        case 'Tab':
          visible.value = false;
          instance.emit('visible-change', false);
          instance.emit('popup-visible-change', false, { trigger: 'keydown-esc', e });
          setTInputValue('');
          if (focusing.value) {
            blur(tInputValue.value.toString(), { e });
          }
          break;
      }
    };
    watch(visible, (val) => {
      val && document.addEventListener('keydown', keydownEvent);
      !val && document.removeEventListener('keydown', keydownEvent);
      !val && (showCreateOption.value = false);
      !val && tInputValue.value && setTInputValue('');
    });

    const handlePopupVisibleChange = (val: boolean, context: PopupVisibleChangeContext) => {
      instance.emit('visible-change', val);
      instance.emit('popup-visible-change', val, context);
      visible.value = val;
      if (val) {
        setTInputValue('');
      }
      val && canFilter.value && doFocus();
    };
    const onOptionClick = (v: string | number, e: MouseEvent | KeyboardEvent) => {
      if (value.value !== v) {
        if (multiple.value) {
          const tempValue = Array.isArray(value.value) ? [].concat(value.value) : [];
          if (labelInValue.value) {
            const index = tempValue.map((item) => get(item, realValue.value)).indexOf(v);
            if (index > -1) {
              removeTag(index, { e });
            } else {
              tempValue.push(realOptions.value.filter((item) => get(item, realValue.value) === v)[0]);
              setValue(tempValue, { trigger: 'check', e });
            }
          } else {
            const index = tempValue.indexOf(v);
            if (index > -1) {
              removeTag(index, { e });
            } else {
              tempValue.push(v);
              setValue(tempValue, { trigger: 'check', e });
            }
          }
        } else {
          setValue(v, { trigger: 'check', e });
        }
      }
      if (!multiple.value) {
        setTInputValue('');
        hideMenu({ trigger: 'context-menu', e });
      } else {
        if (!reserveKeyword.value) {
          setTInputValue('');
        }
        canFilter.value && doFocus();
      }
    };

    // 当前组件选中项是否已经达到最大数量 max 限制，若达到，option组件内会对点击事件不做响应，直接return
    const reachMaxLimit = computed(() => Boolean(multiple.value && max.value && value.value instanceof Array && max.value <= value.value.length));

    const removeTag = (index: number, context?: { e?: MouseEvent | KeyboardEvent }) => {
      const { e } = context || {};
      e?.stopPropagation();
      if (tDisabled.value) {
        return;
      }
      const val = value.value[index];
      const removeOption = realOptions.value.filter((item) => get(item, realValue.value) === val);
      const tempValue = Array.isArray(value.value) ? [].concat(value.value) : [];
      tempValue.splice(index, 1);
      setValue(tempValue, { trigger: 'uncheck', e });
      instance.emit('remove', { value: val, data: removeOption[0], e });
    };
    const hideMenu = (context: PopupVisibleChangeContext) => {
      visible.value = false;
      instance.emit('visible-change', false);
      instance.emit('popup-visible-change', false, context);
    };
    const handleTInputValueChange = (val: string, context: SelectInputValueChangeContext) => {
      if (context.trigger === 'blur') {
        return;
      }
      setTInputValue(val);
    };
    const handleTagChange = (currentTags: SelectInputValue, context: SelectInputChangeContext) => {
      const { trigger, index, e } = context;
      if (trigger === 'clear') {
        setValue([], { trigger: 'tag-remove', e });
      }
      if (['tag-remove', 'backspace'].includes(trigger)) {
        removeTag(index);
      }
    };
    const clearSelect = ({ e }: { e: MouseEvent }) => {
      e?.stopPropagation();
      if (multiple.value) {
        setValue([], { trigger: 'clear', e });
      } else {
        setValue('', { trigger: 'clear', e });
      }
      focusing.value = false;
      setTInputValue('');
      visible.value = false;
      instance.emit('clear', { e });
    };
    const getOptions = (option: OptionInstance) => {
      // create option值不push到options里
      const { optionNode } = option.refs as any;
      if (optionNode?.className?.indexOf(`${name}__create-option--special`) !== -1) {
        return;
      }
      const tmp = realOptions.value.filter(
        (item) => get(item, realValue.value) === option.value && get(item, realLabel.value) === option.label,
      );
      if (!tmp.length) {
        hasSlotOptions.value = true;
        const valueLabel = {};
        set(valueLabel, realValue.value, option.value);
        set(valueLabel, realLabel.value, option.label);
        const valueLabelAble = option.disabled ? { ...valueLabel, disabled: true } : valueLabel;
        realOptions.value.push(valueLabelAble);
      }
    };
    const destroyOptions = (option: OptionInstance) => {
      realOptions.value.forEach((item, index) => {
        if (item[realValue.value] === option.value && item[realLabel.value] === option.label) {
          realOptions.value.splice(index, 1);
        }
      });
    };
    const createOption = (value: string) => {
      instance.emit('create', value);
    };
    const focus = (value: string, context: { e: FocusEvent }) => {
      focusing.value = true;
      instance.emit('focus', { value, e: context?.e });
    };
    const blur = (value: string, context: { e: FocusEvent | KeyboardEvent }) => {
      focusing.value = false;
      instance.emit('blur', { value, e: context?.e });
    };
    const enter = (value: string, context: { e: KeyboardEvent }) => {
      instance.emit('enter', { value, e: context?.e, inputValue: tInputValue.value });
    };
    const getOverlayElm = (): HTMLElement => {
      let r;
      try {
        const popupRefs = (context.refs.selectInputRef as any).$refs.selectInputRef.$refs;
        r = popupRefs.overlay || popupRefs.component.$refs.overlay;
      } catch (e) {
        console.warn('TDesign Warn:', e);
      }
      return r;
    };
    const getPlaceholderText = () => ((!multiple.value && visible.value && selectedValue.value) || placeholder.value) ?? t(global.value.placeholder);
    /**
     * Parse options from slots before popup, execute only once
     */
    const initOptions = () => {
      if (realOptions.value.length || isInit.value) return;

      // 这里直接使用 context.slots 没办法拿到后续渲染赋进来的 default slots，采用如下方法动态获取
      const children = getCurrentInstance().vnode.componentInstance.$scopedSlots.default?.({});
      if (children) {
        realOptions.value = parseOptions(children);
        isInit.value = true;
        hasSlotOptions.value = true;
      }
    };

    onMounted(() => {
      initOptions();
    });
    onUpdated(() => {
      initOptions();
    });

    provide('tSelect', {
      getOptions,
      reachMaxLimit,
      visible,
      hoverOptions,
      hoverIndex,
      realValue,
      getOverlayElm,
      popupOpenTime,
      multiple,
      max,
      value,
      size,
      creatable,
      isGroupOption,
      tInputValue,
      canFilter,
      filterOptions,
      labelInValue,
      createOption,
      onOptionClick,
      hasSlotOptions,
      destroyOptions,
      displayOptions,
      displayOptionsMap,
    });

    return {
      selectInputRef,
      visible,
      realOptions,
      showCreateOption,
      showFilter,
      tDisabled,
      showLoading,
      realValue,
      realLabel,
      displayOptions,
      selectedValue,
      hasSlotOptions,
      tInputValue,
      isGroupOption,
      focus,
      blur,
      enter,
      clearSelect,
      getPlaceholderText,
      handlePopupVisibleChange,
      handleTInputValueChange,
      handleTagChange,
      removeTag,
      renderValueDisplay,
      renderTNode,
      renderCollapsedItems,
    };
  },

  methods: {
    renderSuffixIcon() {
      const {
        showLoading, showArrow, visible, tDisabled,
      } = this;
      if (showLoading) {
        return <t-loading class={[`${name}__right-icon`, `${name}__active-icon`]} size="small" />;
      }
      return showArrow ? (
        <fake-arrow overlayClassName={`${name}__right-icon`} isActive={visible && !tDisabled} />
      ) : null;
    },
  },

  render(h) {
    const {
      multiple,
      autoWidth,
      bordered,
      readonly,
      selectedValue,
      clearable,
      tDisabled,
      borderless,
      empty,
      showCreateOption,
      displayOptions,
      isGroupOption,
      options,
      size,
      showFilter,
      tInputValue,
      showLoading,
      loadingText,
      tagInputProps,
      tagProps,
      inputProps,
      minCollapsedNum,
      popupProps,
      selectInputProps,
      max,
      value,
      realValue,
      realLabel,
      visible,
      focus,
      blur,
      enter,
      handlePopupVisibleChange,
      clearSelect,
      handleTInputValueChange,
      handleTagChange,
      renderTNode,
      renderCollapsedItems,
      // 虚拟滚动参数
      scroll,
    } = this;
    const valueDisplay = this.renderValueDisplay(h);
    const placeholderText = this.getPlaceholderText();
    const prefixIcon = () => renderTNode('prefixIcon');
    const collapsedItems = () => renderCollapsedItems();
    const { overlayClassName, ...restPopupProps } = popupProps || {};
    return (
      <div ref="select" class={`${name}__wrap`}>
        <SelectInput
          ref="selectInputRef"
          class={name}
          autoWidth={autoWidth}
          borderless={borderless || !bordered}
          readonly={readonly}
          allowInput={showFilter}
          multiple={multiple}
          value={selectedValue}
          valueDisplay={valueDisplay}
          clearable={clearable}
          disabled={tDisabled}
          label={prefixIcon}
          suffixIcon={this.renderSuffixIcon}
          placeholder={placeholderText}
          inputValue={tInputValue}
          inputProps={{
            size,
            ...inputProps,
          }}
          tagInputProps={{
            ...tagInputProps,
          }}
          tagProps={tagProps}
          minCollapsedNum={minCollapsedNum}
          collapsedItems={collapsedItems}
          popupVisible={visible}
          popupProps={{
            overlayClassName: [`${name}__dropdown`, ['narrow-scrollbar'], overlayClassName],
            ...restPopupProps,
          }}
          on={{
            focus,
            blur,
            enter,
            clear: clearSelect,
            'input-change': handleTInputValueChange,
            'popup-visible-change': handlePopupVisibleChange,
            'tag-change': handleTagChange,
          }}
          {...selectInputProps}
        >
          <select-panel
            slot="panel"
            size={size}
            multiple={multiple}
            scopedSlots={this.$scopedSlots}
            empty={empty}
            loading={showLoading}
            showCreateOption={showCreateOption}
            options={isGroupOption ? options : displayOptions}
            loadingText={loadingText}
            max={max}
            inputValue={tInputValue}
            value={value}
            realLabel={realLabel}
            realValue={realValue}
            scroll={scroll}
          />
        </SelectInput>
      </div>
    );
  },
});
