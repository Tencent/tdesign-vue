import {
  SetupContext, ref, watch, computed, toRefs, getCurrentInstance,
} from '@vue/composition-api';

// utils
import isObject from 'lodash/isObject';
import pick from 'lodash/pick';
import { SelectInputCommonProperties } from './interface';
import { TdSelectInputProps } from './type';

// components
import Input, { InputValue } from '../input';
import Loading from '../loading';

// hooks
import { useTNodeJSX } from '../hooks/tnode';

// single 和 multiple 共有特性
const COMMON_PROPERTIES = [
  'status',
  'clearable',
  'disabled',
  'label',
  'placeholder',
  'readonly',
  'suffix',
  'suffixIcon',
  'onPaste',
  'onEnter',
  'onMouseenter',
  'onMouseleave',
];

const DEFAULT_KEYS = {
  label: 'label',
  value: 'value',
};

function getInputValue(value: TdSelectInputProps['value'], keys: TdSelectInputProps['keys']) {
  const iKeys = keys || DEFAULT_KEYS;
  return isObject(value) ? value[iKeys.label] : value;
}

export default function useSingle(props: TdSelectInputProps, context: SetupContext) {
  const instance = getCurrentInstance();

  const { value, keys } = toRefs(props);
  const inputRef = ref();
  const inputValue = ref<string | number>('');
  const renderTNode = useTNodeJSX();

  const commonInputProps = computed<SelectInputCommonProperties>(() => pick(props, COMMON_PROPERTIES));

  const onInnerClear = (context: { e: MouseEvent }) => {
    context?.e?.stopPropagation();
    props.onClear?.(context);
    instance.emit('clear', context);
    inputValue.value = '';
  };

  const onInnerInputChange = (value: InputValue, context: { e: InputEvent | MouseEvent }) => {
    if (props.allowInput) {
      inputValue.value = value;
      props.onInputChange?.(value, { ...context, trigger: 'input' });
      instance.emit('input-change', value, { ...context, trigger: 'input' });
    }
  };

  watch(
    [value],
    () => {
      inputValue.value = getInputValue(value.value, keys.value);
    },
    { immediate: true },
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderSelectSingle = (h: Vue.CreateElement) => {
    const singleValueDisplay = renderTNode('valueDisplay');
    const prefixContent = [singleValueDisplay, renderTNode('label')];
    const inputProps = {
      ...commonInputProps.value,
      ...props.inputProps,
      value: singleValueDisplay ? undefined : inputValue.value,
      label: prefixContent.length ? () => prefixContent : undefined,
      autoWidth: props.autoWidth,
      showClearIconOnEmpty: !props.autoWidth,
      readonly: !props.allowInput,
      placeholder: singleValueDisplay ? '' : props.placeholder,
      suffixIcon: !props.disabled && props.loading ? () => <Loading loading size="small" /> : props.suffixIcon,
    };

    return (
      <Input
        ref="inputRef"
        props={inputProps}
        scopedSlots={context.slots}
        onChange={onInnerInputChange}
        onClear={onInnerClear}
        onBlur={(val: InputValue, context: { e: MouseEvent }) => {
          props.onBlur?.(value, { ...context, inputValue: val });
          inputValue.value = getInputValue(value.value, keys.value);
          instance.emit('blur', props.value, { ...context, inputValue: val });
        }}
        onFocus={(val: InputValue, context: { e: MouseEvent }) => {
          props.onFocus?.(value, { ...context, inputValue: val });
          instance.emit('focus', props.value, { ...context, tagInputValue: val });
        }}
      />
    );
  };

  return {
    inputRef,
    commonInputProps,
    onInnerClear,
    renderSelectSingle,
  };
}
