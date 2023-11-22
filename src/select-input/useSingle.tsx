import {
  SetupContext, ref, computed, toRefs, getCurrentInstance,
} from '@vue/composition-api';

import isObject from 'lodash/isObject';
import pick from 'lodash/pick';
import { SelectInputCommonProperties } from './interface';
import { TdSelectInputProps } from './type';
import Input, { InputProps, StrInputProps } from '../input';
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
  'autofocus',
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

  const isSingleFocus = ref(props.autofocus);
  const inputRef = ref();
  const renderTNode = useTNodeJSX();

  const commonInputProps = computed<SelectInputCommonProperties>(() => pick(props, COMMON_PROPERTIES));

  const onInnerClear = (context: { e: MouseEvent }) => {
    context?.e?.stopPropagation();
    props.onClear?.(context);
    instance.emit('clear', context);
    setInputValue('', { trigger: 'clear' });
  };

  const onInnerInputChange = (value: string, context: { e: InputEvent | MouseEvent }) => {
    if (props.allowInput) {
      setInputValue(value, { ...context, trigger: 'input' });
    }
  };

  const onEnter: StrInputProps['onEnter'] = (val, context) => {
    props.onEnter?.(value.value, { ...context, inputValue: val });
    instance.emit('enter', value.value, { ...context, inputValue: val });
  };

  const onFocus: StrInputProps['onFocus'] = (val, context) => {
    isSingleFocus.value = true;
    props.onFocus?.(value.value, { ...context, inputValue: val });
    instance.emit('focus', value.value, { ...context, tagInputValue: val });
  };

  const onPaste: InputProps['onPaste'] = (context) => {
    props.onPaste?.(context);
    instance.emit('paste', context);
  };

  const onMouseenter: InputProps['onMouseenter'] = (context) => {
    props.onMouseenter?.(context);
    instance.emit('mouseenter', context);
  };

  const onMouseleave: InputProps['onMouseleave'] = (context: { e: MouseEvent }) => {
    props.onMouseleave?.(context);
    instance.emit('mouseenter', context);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderSelectSingle = (h: Vue.CreateElement, popupVisible: boolean) => {
    const singleValueDisplay = renderTNode('valueDisplay');
    const pureValue = getInputValue(value.value, keys.value);
    const displayedValue = popupVisible && props.allowInput ? inputValue.value : pureValue;
    const prefixContent = [renderTNode('label'), singleValueDisplay];
    const inputProps = {
      ...commonInputProps.value,
      value: singleValueDisplay && props.value ? undefined : displayedValue,
      label: () => prefixContent,
      autoWidth: props.autoWidth,
      autofocus: props.autofocus,
      readonly: !props.allowInput,
      placeholder: singleValueDisplay ? '' : props.placeholder,
      suffixIcon: !props.disabled && props.loading ? () => <Loading loading size="small" /> : props.suffixIcon,
      showClearIconOnEmpty: Boolean(!props.disabled && props.clearable && (inputValue.value || displayedValue)),
      inputClass: {
        [`${classPrefix.value}-input--focused`]: popupVisible,
        [`${classPrefix.value}-is-focused`]: popupVisible,
      },
      ...props.inputProps,
    };
    // eslint-disable-next-line
    const { tips, ...slots } = context.slots;
    return (
      <Input
        ref="inputRef"
        props={inputProps}
        scopedSlots={slots}
        onChange={onInnerInputChange}
        onClear={onInnerClear}
        onEnter={onEnter}
        // [Important Info]: SelectInput.blur is not equal to Input, example: click popup panel
        onFocus={onFocus}
        onPaste={onPaste}
        onMouseenter={onMouseenter}
        onMouseleave={onMouseleave}
      />
    );
  };

  return {
    inputRef,
    commonInputProps,
    singleInputValue: inputValue,
    isSingleFocus,
    onInnerClear,
    renderSelectSingle,
  };
}
