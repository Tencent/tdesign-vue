import {
  SetupContext, computed, ref, toRefs, getCurrentInstance,
} from '@vue/composition-api';
import isObject from 'lodash/isObject';
import Vue from 'vue';
import { TdSelectInputProps, SelectInputChangeContext, SelectInputKeys } from './type';
import { SelectInputCommonProperties } from './interface';
import { InputValue } from '../input';
import TagInput, { TagInputValue, InputValueChangeContext } from '../tag-input';
import Loading from '../loading';
import useDefaultValue from '../hooks/useDefaultValue';
import { usePrefixClass } from '../config-provider';

export interface RenderSelectMultipleParams {
  commonInputProps: SelectInputCommonProperties;
  onInnerClear: (context: { e: MouseEvent }) => void;
  popupVisible: boolean;
}

const DEFAULT_KEYS = {
  label: 'label',
  key: 'key',
  children: 'children',
};

export default function useMultiple(props: TdSelectInputProps, context: SetupContext) {
  const { inputValue } = toRefs(props);
  const classPrefix = usePrefixClass();
  const instance = getCurrentInstance();
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

  const onTagInputChange = (val: TagInputValue, context: SelectInputChangeContext) => {
    // 避免触发浮层的显示或隐藏
    if (context.trigger === 'tag-remove') {
      context.e?.stopPropagation();
    }
    props.onTagChange?.(val, context);
    instance.emit('tag-change', val, context);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderSelectMultiple = (p: RenderSelectMultipleParams, h: Vue.CreateElement) => {
    const tagInputProps = {
      ...props.tagInputProps,
      ...p.commonInputProps,
      tagProps: props.tagProps,
      readonly: !props.allowInput,
      label: props.label,
      autoWidth: props.autoWidth,
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
      },
      suffixIcon: !props.disabled && props.loading ? () => <Loading loading size="small" /> : props.suffixIcon,
    };

    return (
      <TagInput
        ref="tagInputRef"
        scopedSlots={context.slots}
        props={tagInputProps}
        on={{
          'input-change': (val: InputValue, context: InputValueChangeContext) => {
            // 筛选器统一特性：筛选器按下回车时不清空输入框
            if (context?.trigger === 'enter') return;
            setTInputValue(val, { trigger: context.trigger, e: context.e });
          },
        }}
        onChange={onTagInputChange}
        onClear={(context: { e: MouseEvent }) => {
          context.e.stopPropagation();
          p.onInnerClear;
        }}
        onBlur={(val: TagInputValue, context: { inputValue: InputValue; e: FocusEvent }) => {
          // 筛选器统一特性：失去焦点时，清空输入内容
          setTInputValue('', { ...context, trigger: 'blur' });
          instance.emit('blur', props.value, { ...context, tagInputValue: val });
        }}
        onFocus={(val: TagInputValue, context: { inputValue: InputValue; e: FocusEvent }) => {
          props.onFocus?.(props.value, { ...context, tagInputValue: val });
          instance.emit('focus', props.value, { ...context, tagInputValue: val });
        }}
      />
    );
  };

  return {
    tags,
    tPlaceholder,
    tagInputRef,
    renderSelectMultiple,
  };
}
