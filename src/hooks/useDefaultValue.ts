import { ref, Ref, getCurrentInstance } from '@vue/composition-api';

export type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void;

export default function useDefaultValue<T, P extends any[]>(
  value: Ref<T>,
  defaultValue: T,
  onChange: ChangeHandler<T, P>,
  propsName: string,
  eventName: string,
): [Ref<T>, ChangeHandler<T, P>] {
  const { emit } = getCurrentInstance();
  const internalValue = ref();
  internalValue.value = defaultValue;

  // 受控模式
  if (typeof value.value !== 'undefined') {
    return [
      value,
      (newValue, ...args) => {
        onChange?.(newValue, ...args);
        propsName && emit?.(`update:${propsName}`, newValue, ...args);
        eventName && emit?.(eventName, newValue, ...args);
      },
    ];
  }

  // 非受控模式
  return [
    internalValue,
    (newValue, ...args) => {
      internalValue.value = newValue;
      onChange?.(newValue, ...args);
      eventName && emit?.(eventName, newValue, ...args);
    },
  ];
}
