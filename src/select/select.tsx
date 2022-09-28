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
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import useDefaultValue from '../hooks/useDefaultValue';
import useVModel from '../hooks/useVModel';
import { useTNodeJSX } from '../hooks/tnode';
import { useConfig, usePrefixClass } from '../config-provider/useConfig';
import {
  TdSelectProps, SelectValue, TdOptionProps, SelectOptionGroup,
} from './type';
import props from './props';
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
import { off, on } from '../utils/dom';
import Option from './option';
import SelectPanel from './select-panel';
import { getSingleContent, getMultipleContent, getNewMultipleValue } from './util';
import useSelectOptions from './hooks/useSelectOptions';
import { SelectPanelInstance } from './instance';

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
  setup(props: TdSelectProps, context: SetupContext) {
    const { t, global } = useConfig('select');
    const renderTNode = useTNodeJSX();
    const instance = getCurrentInstance();
    const selectInputRef = ref<HTMLElement>(null);
    const selectPanelRef = ref<SelectPanelInstance>();
    const popupOpenTime = ref(250);
    const formDisabled = ref();
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
    }));
    const { options: innerOptions, optionsMap, optionsList } = useSelectOptions(props, instance, keys);

    const [value, setValue] = useVModel(valueProps, props.defaultValue, props.onChange, 'change');
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
        const { value: valueOfKeys, label: labelOfKeys } = keys.value;

        // 若为多选情况，将历史 value 加入 option 待取列表，兼容远程搜索改变 options 数组后旧选项无法找到的问题
        const oldValueMap = new Map<SelectValue, TdOptionProps>();
        if (multiple.value) {
          (value.value as TdOptionProps[]).forEach((option) => {
            oldValueMap.set(option[valueOfKeys], option);
          });
        }

        const getOption = (val: SelectValue) => {
          const option = optionsMap.value.get(val) || oldValueMap.get(val);
          return {
            [valueOfKeys]: get(option, valueOfKeys),
            [labelOfKeys]: get(option, labelOfKeys),
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
      () => ((!multiple.value
          && innerPopupVisible.value
          && ((valueType.value === 'object' && value.value[keys.value.label])
            || getSingleContent(innerValue.value, optionsList.value)))
          || placeholder.value)
        ?? t(global.value.placeholder),
    );

    const displayText = computed(() => {
      if (multiple.value) {
        if (valueType.value === 'object') {
          return (value.value as SelectValue[]).map((v) => v[keys.value.label]);
        }
        return getMultipleContent(innerValue.value as SelectValue[], optionsList.value);
      }
      if (valueType.value === 'object' && value.value[keys.value.label]) {
        return value.value[keys.value.label];
      }
      return getSingleContent(innerValue.value, optionsList.value);
    });

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
      // 只有多选情况下需要帮用户清除一次输入框内容，单选场景选中后 popup 消失，携带内容清除的作用
      multiple.value && setTInputValue('');
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
      // 当支持创建的时候，按下 enter 键，若 hoverIndex 大于 0，则视为选择列表中筛选出的已有项目，只有当 hoverIndex 为 -1(未选中)/0(创建条目) 的时候，才视为触发 create 回调
      creatable.value && hoverIndex.value < 1 && handleCreate();
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
      const displayOptions: (TdOptionProps & { isCreated?: boolean })[] = [];

      const getCurrentOptionsList = (options: TdOptionProps[]) => {
        options.forEach((option) => {
          if ((option as SelectOptionGroup).group) {
            getCurrentOptionsList((option as SelectOptionGroup).children);
          } else {
            displayOptions.push(option);
          }
        });
      };
      getCurrentOptionsList(selectPanelRef.value?.getDisplayOptions());

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
      };
      if (displayOptionsLength === 0) return;
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
          if (hoverIndex.value === -1) return;
          if (displayOptions[hoverIndex.value].isCreated && multiple.value) {
            handleCreate();
          }
          if (!multiple.value) {
            setInnerValue((displayOptions[hoverIndex.value] as TdOptionProps).value, {
              e,
              trigger: 'check',
            });
            setInnerPopupVisible(false, { e });
          } else {
            if (hoverIndex.value === -1) return;
            const optionValue = (displayOptions[hoverIndex.value] as TdOptionProps)?.value;
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
  },

  render() {
    const { renderTNode } = this;

    const prefixIcon = () => renderTNode('prefixIcon');
    const valueDisplay = () => renderTNode('valueDisplay', { params: this.valueDisplayParams });
    const collapsedItems = () => renderTNode('collapsedItems', { params: this.collapsedItemsParams });

    const { overlayClassName, ...restPopupProps } = this.popupProps || {};

    return (
      <div ref="select" class={`${this.componentName}__wrap`}>
        <SelectInput
          ref="selectInputRef"
          class={this.componentName}
          autoWidth={this.autoWidth}
          borderless={this.borderless || !this.bordered}
          readonly={this.readonly}
          allowInput={this.isFilterable}
          multiple={this.multiple}
          keys={this.keys}
          status={this.status}
          tips={this.tips}
          value={this.displayText}
          valueDisplay={valueDisplay}
          clearable={this.clearable}
          disabled={this.isDisabled}
          label={prefixIcon}
          suffixIcon={this.renderSuffixIcon}
          placeholder={this.placeholderText}
          inputValue={this.tInputValue}
          inputProps={{
            size: this.size,
            ...this.inputProps,
          }}
          tagInputProps={{
            autoWidth: true,
            ...this.tagInputProps,
          }}
          tagProps={this.tagProps}
          minCollapsedNum={this.minCollapsedNum}
          collapsedItems={collapsedItems}
          popupVisible={this.innerPopupVisible}
          popupProps={{
            overlayClassName: [`${this.componentName}__dropdown`, overlayClassName],
            ...restPopupProps,
          }}
          on={{
            focus: this.handleFocus,
            blur: this.handleBlur,
            enter: this.handleEnter,
            clear: this.handleClear,
            'input-change': this.handleTInputValueChange,
            'popup-visible-change': this.setInnerPopupVisible,
            'tag-change': this.handleTagChange,
          }}
          {...this.selectInputProps}
          updateScrollTop={this.updateScrollTop}
        >
          <select-panel
            ref="selectPanelRef"
            slot="panel"
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
        </SelectInput>
      </div>
    );
  },
});
