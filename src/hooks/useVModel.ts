import { Ref, ref, getCurrentInstance } from '@vue/composition-api';

export type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void;

export default function useVModel<T, P extends any[]>(
  value: Ref<T>,
  modelValue: Ref<T>,
  defaultValue: T,
  onChange: ChangeHandler<T, P>,
  eventName?: string,
): [Ref<T>, ChangeHandler<T, P>] {
  const { emit } = getCurrentInstance();

  const internalValue = ref<T>();
  internalValue.value = defaultValue;

  // 受控模式:modelValue
  if (typeof modelValue.value !== 'undefined') {
    return [
      modelValue,
      (newValue, ...args) => {
        emit?.('input', newValue, ...args);
        onChange?.(newValue, ...args);
        emit?.(eventName, newValue, ...args);
      },
    ];
  }

  // 受控模式
  if (typeof value.value !== 'undefined') {
    return [value, onChange || (() => {})];
  }

  // 非受控模式
  return [
    internalValue,
    (newValue, ...args) => {
      internalValue.value = newValue;
      onChange?.(newValue, ...args);
      emit?.(eventName, newValue, ...args);
    },
  ];
}
