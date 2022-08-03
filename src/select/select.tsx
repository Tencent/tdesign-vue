import {
  computed,
  defineComponent,
  ref,
  SetupContext,
  toRefs,
  watch,
  nextTick,
  getCurrentInstance,
  provide,
} from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { CloseCircleFilledIcon } from 'tdesign-icons-vue';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import useDefaultValue from '../hooks/useDefaultValue';
import { useTNodeJSX } from '../hooks/tnode';
import { useConfig } from '../config-provider/useConfig';
import { TdSelectProps, SelectValue } from './type';
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
import { getSingleContent, getMultipleContent, getNewMultipleValue } from './util';
import { useSelectOptions } from './hooks';

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
    const { t, global } = useConfig('select');
    const { classPrefix } = useConfig();
    const renderTNode = useTNodeJSX();
    const instance = getCurrentInstance();
    const selectInputRef = ref<HTMLElement>(null);
    const popupOpenTime = ref(250);
    const formDisabled = ref();

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
    } = toRefs(props);

    const keys = computed(() => ({
      label: props.keys?.label || 'label',
      value: props.keys?.value || 'value',
    }));
    const { options: innerOptions, optionsMap, optionsList } = useSelectOptions(props, context, keys);

    const [value, setValue] = useDefaultValue(valueProps, props.defaultValue, props.onChange, 'value', 'change');
    const innerValue = computed(() => {
      if (valueType.value === 'object') {
        return multiple.value
          ? (value.value as SelectValue[]).map((option) => option[keys.value.value])
          : value.value[keys.value.value];
      }
      return value.value;
    });
    const setInnerValue: TdSelectProps['onChange'] = (newVal: SelectValue | SelectValue[], e) => {
      if (valueType.value === 'object') {
        const { value, label } = keys.value;
        const getOption = (val: SelectValue) => {
          const option = optionsMap.value.get(val);
          return {
            [value]: get(option, value),
            [label]: get(option, label),
          };
        };
        // eslint-disable-next-line no-param-reassign
        newVal = multiple.value ? (newVal as SelectValue[]).map((val) => getOption(val)) : getOption(newVal);
      }
      if (newVal === value.value) return;
      setValue(newVal, e);
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
      false,
      (visible: boolean, context: PopupVisibleChangeContext) => {
        props.onPopupVisibleChange?.(visible, context);
        props.onVisibleChange?.(visible);
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

    const placeholderText = computed(
      () => ((!multiple.value && innerPopupVisible.value && getSingleContent(innerValue.value, optionsList.value))
          || placeholder.value)
        ?? t(global.value.placeholder),
    );

    const displayText = computed(() => multiple.value
      ? getMultipleContent(innerValue.value as SelectValue[], optionsList.value)
      : getSingleContent(innerValue.value, optionsList.value));

    const valueDisplayParams = computed(() => {
      const val = multiple.value
        ? (innerValue.value as SelectValue[]).map((value) => ({
          value,
          label: optionsMap.value.get(value)?.label,
        }))
        : innerValue.value;
      return {
        value: val,
        onClose: multiple.value ? (index: number) => removeTag(index) : () => {},
      };
    });

    const collapsedItemsParams = computed(() => multiple.value
      ? {
        value: innerValue.value,
        collapsedSelectedItems: innerValue.value.slice(minCollapsedNum.value),
        count: innerValue.value.length - minCollapsedNum.value,
      }
      : {});

    const removeTag = (index: number, context?: { e?: MouseEvent | KeyboardEvent }) => {
      const { e } = context || {};
      e?.stopPropagation();
      if (isDisabled.value) {
        return;
      }
      const selectValue = cloneDeep(innerValue.value) as SelectValue[];
      const value = selectValue[index];
      selectValue.splice(index, 1);
      setInnerValue(selectValue, { e, trigger: 'tag-remove' });
      const evtObj = {
        value: value as string | number,
        data: optionsMap.value.get(value),
        e,
      };
      instance.emit('remove', evtObj);
      props.onRemove?.(evtObj);
    };

    const handleCreate = () => {
      if (!tInputValue.value) return;
      const createVal = tInputValue.value;
      setTInputValue('');
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
      setTInputValue(val);
      debounceSearch();
    };

    const handleTagChange = (currentTags: SelectInputValue, context: SelectInputChangeContext) => {
      const { trigger, index, e } = context;
      if (trigger === 'clear') {
        setInnerValue([], { trigger: 'tag-remove', e });
      }
      if (['tag-remove', 'backspace'].includes(trigger)) {
        removeTag(index);
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
      handleCreate();
    };

    const debounceSearch = debounce(() => {
      instance.emit('search', tInputValue.value);
      props.onSearch?.(tInputValue.value.toString());
    }, 300);

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
      const optionsListLength = optionsList.value.length;
      const arrowDownOption = () => {
        let count = 0;
        while (hoverIndex.value < optionsListLength) {
          if (!optionsList.value[hoverIndex.value]?.disabled) {
            break;
          }
          if (hoverIndex.value === optionsListLength - 1) {
            hoverIndex.value = 0;
          } else {
            hoverIndex.value += 1;
          }
          count += 1;
          if (count >= optionsListLength) break;
        }
      };
      const arrowUpOption = () => {
        let count = 0;
        while (hoverIndex.value > -1) {
          if (!optionsList.value[hoverIndex.value]?.disabled) {
            break;
          }
          if (hoverIndex.value === 0) {
            hoverIndex.value = optionsListLength - 1;
          } else {
            hoverIndex.value -= 1;
          }
          count += 1;
          if (count >= optionsListLength) break;
        }
      };
      if (optionsListLength === 0) return;
      const preventKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'];
      if (preventKeys.includes(e.code)) {
        e.preventDefault();
      }
      switch (e.code) {
        case 'ArrowDown':
          if (hoverIndex.value === -1) {
            hoverIndex.value = 0;
            return;
          }
          if (hoverIndex.value < optionsListLength - 1) {
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
            hoverIndex.value = optionsListLength - 1;
            arrowUpOption();
          }
          break;
        case 'Enter':
          if (hoverIndex.value === -1) return;
          if (!multiple.value) {
            setInnerValue(optionsList.value[hoverIndex.value].value, {
              e,
              trigger: 'check',
            });
            setInnerPopupVisible(false, { e });
          } else {
            if (hoverIndex.value === -1) return;
            const optionValue = optionsList.value[hoverIndex.value]?.value;
            if (!optionValue) return;
            const newValue = getNewMultipleValue(innerValue.value, optionValue);
            setInnerValue(newValue.value, { e, trigger: newValue.isCheck ? 'check' : 'uncheck' });
          }
          break;
        case 'Escape':
        case 'Tab':
          setInnerPopupVisible(false, { trigger: 'keydown-esc', e });
          setTInputValue('');
          break;
      }
    };

    const checkValueInvalid = () => {
      // 参数类型检测与修复
      if (!multiple.value && isArray(value.value)) {
        value.value = '';
      }
      if (multiple.value && !isArray(value.value)) {
        value.value = [];
      }
    };

    watch(
      value,
      () => {
        checkValueInvalid();
      },
      {
        immediate: true,
      },
    );
    // 为 eventListener 加单独的 sync watch，以防组件在卸载的时候未能正常清除监听 (https://github.com/Tencent/tdesign-vue/issues/1170)
    watch(
      innerPopupVisible,
      (val) => {
        val && document.addEventListener('keydown', keydownEvent);
        !val && document.removeEventListener('keydown', keydownEvent);
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
        tInputValue.value && setTInputValue('');
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
      getOverlayElm,
      handleCreate,
      handleValueChange: setInnerValue,
      handlerInputChange: setTInputValue,
      handlePopupVisibleChange: setInnerPopupVisible,
    });

    return {
      isFilterable,
      isDisabled,
      isLoading,
      innerOptions,
      placeholderText,
      selectInputRef,
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
    };
  },

  methods: {
    renderSuffixIcon() {
      const {
        isLoading, showArrow, innerPopupVisible, isDisabled,
      } = this;
      if (isLoading) {
        return <t-loading class={[`${name}__right-icon`, `${name}__active-icon`]} size="small" />;
      }
      return showArrow ? (
        <fake-arrow overlayClassName={`${name}__right-icon`} isActive={innerPopupVisible && !isDisabled} />
      ) : null;
    },
  },

  render() {
    const {
      valueDisplayParams,
      placeholderText,
      multiple,
      keys,
      autoWidth,
      bordered,
      readonly,
      displayText,
      clearable,
      isDisabled,
      borderless,
      size,
      isFilterable,
      tInputValue,
      isLoading,
      loadingText,
      tagInputProps,
      tagProps,
      inputProps,
      minCollapsedNum,
      popupProps,
      selectInputProps,
      value,
      innerPopupVisible,
      filter,
      setInnerPopupVisible,
      handleTInputValueChange,
      renderTNode,
      collapsedItemsParams,
      updateScrollTop,
      innerOptions,
      creatable,
      // 虚拟滚动参数
      scroll,
    } = this;

    const prefixIcon = () => renderTNode('prefixIcon');
    const valueDisplay = () => renderTNode('valueDisplay', { params: valueDisplayParams });
    const collapsedItems = () => renderTNode('collapsedItems', { params: collapsedItemsParams });

    const { overlayClassName, ...restPopupProps } = popupProps || {};

    return (
      <div ref="select" class={`${name}__wrap`}>
        <SelectInput
          ref="selectInputRef"
          class={name}
          autoWidth={autoWidth}
          borderless={borderless || !bordered}
          readonly={readonly}
          allowInput={isFilterable}
          multiple={multiple}
          keys={keys}
          value={displayText}
          valueDisplay={valueDisplay}
          clearable={clearable}
          disabled={isDisabled}
          label={prefixIcon}
          suffixIcon={this.renderSuffixIcon}
          placeholder={placeholderText}
          inputValue={tInputValue}
          inputProps={{
            size,
            ...inputProps,
          }}
          tagInputProps={{
            autoWidth: true,
            ...tagInputProps,
          }}
          tagProps={tagProps}
          minCollapsedNum={minCollapsedNum}
          collapsedItems={collapsedItems}
          popupVisible={innerPopupVisible}
          popupProps={{
            overlayClassName: [`${name}__dropdown`, ['narrow-scrollbar'], overlayClassName],
            ...restPopupProps,
          }}
          on={{
            focus: this.handleFocus,
            blur: this.handleBlur,
            enter: this.handleEnter,
            clear: this.handleClear,
            'input-change': handleTInputValueChange,
            'popup-visible-change': setInnerPopupVisible,
            'tag-change': this.handleTagChange,
          }}
          {...selectInputProps}
          updateScrollTop={updateScrollTop}
        >
          <select-panel
            slot="panel"
            scopedSlots={this.$scopedSlots}
            options={innerOptions}
            value={value}
            inputValue={tInputValue}
            multiple={multiple}
            filter={filter}
            filterable={isFilterable}
            size={size}
            empty={this.empty}
            loading={isLoading}
            loadingText={loadingText}
            scroll={scroll}
            panelTopContent={this.panelTopContent}
            panelBottomContent={this.panelBottomContent}
            creatable={creatable}
          />
        </SelectInput>
      </div>
    );
  },
});
