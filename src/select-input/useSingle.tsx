import {
  SetupContext, ref, computed, toRefs, getCurrentInstance,
} from '@vue/composition-api';

import isObject from 'lodash/isObject';
import pick from 'lodash/pick';
import { SelectInputCommonProperties } from './interface';
import { TdSelectInputProps } from './type';

import Input, { InputValue } from '../input';
import Loading from '../loading';

import { useTNodeJSX } from '../hooks/tnode';
import { usePrefixClass } from '../hooks/useConfig';
import useDefaultValue from '../hooks/useDefaultValue';

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

  const { value, keys, inputValue: propsInputValue } = toRefs(props);
  const classPrefix = usePrefixClass();

  const [inputValue, setInputValue] = useDefaultValue(
    propsInputValue,
    props.defaultInputValue ?? '',
    props.onInputChange,
    'inputValue',
    'input-change',
  );

  const inputRef = ref();
  const renderTNode = useTNodeJSX();

  const commonInputProps = computed<SelectInputCommonProperties>(() => pick(props, COMMON_PROPERTIES));

  const onInnerClear = (context: { e: MouseEvent }) => {
    context?.e?.stopPropagation();
    props.onClear?.(context);
    instance.emit('clear', context);
    setInputValue('', { trigger: 'clear' });
  };

  const onInnerInputChange = (value: InputValue, context: { e: InputEvent | MouseEvent }) => {
    if (props.allowInput) {
      setInputValue(value, { ...context, trigger: 'input' });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderSelectSingle = (h: Vue.CreateElement, popupVisible: boolean) => {
    const singleValueDisplay = renderTNode('valueDisplay');
    const displayedValue = popupVisible && props.allowInput ? inputValue.value : getInputValue(value.value, keys.value);
    const prefixContent = [singleValueDisplay, renderTNode('label')];
    const inputProps = {
      ...commonInputProps.value,
      value: singleValueDisplay ? undefined : displayedValue,
      label: prefixContent.length ? () => prefixContent : undefined,
      autoWidth: props.autoWidth,
      readonly: !props.allowInput,
      placeholder: singleValueDisplay ? '' : props.placeholder,
      suffixIcon: !props.disabled && props.loading ? () => <Loading loading size="small" /> : props.suffixIcon,
      showClearIconOnEmpty: Boolean(props.clearable && (inputValue.value || displayedValue)),
      inputClass: {
        [`${classPrefix.value}-input--focused`]: popupVisible,
        [`${classPrefix.value}-is-focused`]: popupVisible,
      },
      ...props.inputProps,
    };

    return (
      <Input
        ref="inputRef"
        props={inputProps}
        scopedSlots={context.slots}
        onChange={onInnerInputChange}
        onClear={onInnerClear}
        onBlur={(val: InputValue, context: { e: MouseEvent }) => {
          props.onBlur?.(value.value, { ...context, inputValue: val });
          instance.emit('blur', value.value, { ...context, inputValue: val });
        }}
        onEnter={(val: InputValue, context: { e: KeyboardEvent }) => {
          props.onEnter?.(value.value, { ...context, inputValue: val });
          instance.emit('enter', value.value, { ...context, inputValue: val });
        }}
        onFocus={(val: InputValue, context: { e: MouseEvent }) => {
          props.onFocus?.(value.value, { ...context, inputValue: val });
          instance.emit('focus', value.value, { ...context, tagInputValue: val });
          !popupVisible && setInputValue(getInputValue(value.value, keys.value), { ...context, trigger: 'input' }); // 聚焦时拿到value
        }}
        onPaste={(context: { e: ClipboardEvent; pasteValue: string }) => {
          props.onPaste?.(context);
          instance.emit('paste', context);
        }}
        onMouseenter={(context: { e: MouseEvent }) => {
          props.onMouseenter?.(context);
          instance.emit('mouseenter', context);
        }}
        onMouseleave={(context: { e: MouseEvent }) => {
          props.onMouseleave?.(context);
          instance.emit('mouseenter', context);
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
