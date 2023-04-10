import {
  SetupContext, computed, ref, toRefs,
} from '@vue/composition-api';
import isObject from 'lodash/isObject';
import Vue from 'vue';
import { TdSelectInputProps, SelectInputKeys } from './type';
import { SelectInputCommonProperties } from './interface';
import { InputValue } from '../input';
import TagInput, { TagInputValue, InputValueChangeContext, TagInputProps } from '../tag-input';
import Loading from '../loading';
import useDefaultValue from '../hooks/useDefaultValue';
import { usePrefixClass } from '../hooks/useConfig';

export interface RenderSelectMultipleParams {
  commonInputProps: SelectInputCommonProperties;
  onInnerClear: (context: { e: MouseEvent }) => void;
  popupVisible: boolean;
}

const DEFAULT_KEYS: SelectInputKeys = {
  label: 'label',
  value: 'value',
  children: 'children',
};

export default function useMultiple(props: TdSelectInputProps, context: SetupContext) {
  const { inputValue } = toRefs(props);
  const classPrefix = usePrefixClass();
  const tagInputRef = ref();
  const [tInputValue, setTInputValue] = useDefaultValue(
    inputValue,
    props.defaultInputValue,
    props.onInputChange,
    'inputValue',
    'input-change',
  );
  const iKeys = computed<SelectInputKeys>(() => ({ ...DEFAULT_KEYS, ...props.keys }));
  const tags = computed<TagInputValue>(() => {
    if (!(props.value instanceof Array)) {
      return isObject(props.value) ? [props.value[iKeys.value.label]] : [props.value];
    }
    return props.value.map((item) => (isObject(item) ? item[iKeys.value.label] : item));
  });

  const tPlaceholder = computed<string>(() => (!tags.value || !tags.value.length ? props.placeholder : ''));

  const onTagInputChange: TagInputProps['onChange'] = (val, ctx) => {
    // 避免触发浮层的显示或隐藏
    if (ctx.trigger === 'tag-remove') {
      ctx.e?.stopPropagation();
    }
    props.onTagChange?.(val, ctx);
    context.emit('tag-change', val, ctx);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderSelectMultiple = (p: RenderSelectMultipleParams, h: Vue.CreateElement) => {
    const tagInputProps = {
      ...p.commonInputProps,
      tagProps: props.tagProps,
      label: props.label,
      autoWidth: props.autoWidth,
      readonly: props.readonly,
      placeholder: tPlaceholder.value,
      minCollapsedNum: props.minCollapsedNum,
      collapsedItems: props.collapsedItems,
      tag: props.tag,
      valueDisplay: props.valueDisplay,
      value: tags.value,
      inputValue: tInputValue.value || '',
      inputProps: {
        readonly: !props.allowInput || props.readonly,
        inputClass: {
          [`${classPrefix.value}-input--focused`]: p.popupVisible,
        },
        ...props.inputProps,
      },
      suffixIcon: !props.disabled && props.loading ? () => <Loading loading size="small" /> : props.suffixIcon,
      ...props.tagInputProps,
    };
    // eslint-disable-next-line
    const { tips, ...slots } = context.slots;
    const newListeners = { ...context.listeners };
    // blur 事件已经在 TagInput 中处理，这里不需要再处理
    delete newListeners.blur;
    return (
      <TagInput
        ref="tagInputRef"
        scopedSlots={slots}
        props={tagInputProps}
        on={{
          'input-change': (val: InputValue, ctx: InputValueChangeContext) => {
            /**
             * 筛选器统一特性：
             * 1. 筛选器按下回车时不清空输入框;
             * 2. SelectInput 的失焦不等于 TagInput。如点击下拉面板时，TagInput 失去焦点，但 SelectInput 依旧保持聚焦，允许继续选择。
             */
            if (ctx.trigger === 'enter' || ctx.trigger === 'blur') return;
            setTInputValue(val, { trigger: ctx.trigger, e: ctx.e });
          },
          ...newListeners,
          change: onTagInputChange,
          clear: p.onInnerClear,
          // [Important Info]: SelectInput.blur is not equal to TagInput, example: click popup panel
          focus: (val: TagInputValue, ctx: { inputValue: InputValue; e: FocusEvent }) => {
            const params = { ...ctx, tagInputValue: val };
            props.onFocus?.(props.value, params);
            context.emit('focus', props.value, params);
          },
          enter: (val: TagInputValue, ctx: { e: KeyboardEvent; inputValue: InputValue }) => {
            const params = { ...ctx, tagInputValue: val };
            props.onEnter?.(props.value, params);
            context.emit('focus', props.value, params);
          },
        }}
      />
    );
  };

  return {
    tags,
    tPlaceholder,
    tagInputRef,
    multipleInputValue: tInputValue,
    renderSelectMultiple,
  };
}
