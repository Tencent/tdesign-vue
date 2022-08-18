import {
  Ref, ref, getCurrentInstance, watch,
} from '@vue/composition-api';

export type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void;

export default function useVModel<T, P extends any[]>(
  value: Ref<T>,
  defaultValue: T,
  onChange: ChangeHandler<T, P>,
  // eventName 不是 input 时，需要单独传入 eventName 用于事件输出
  eventName?: string,
): [Ref<T>, ChangeHandler<T, P>] {
  const { emit } = getCurrentInstance();

  const internalValue = ref<T>();
  internalValue.value = typeof value.value !== 'undefined' ? value.value : defaultValue;

  watch(value, () => {
    if (value.value !== internalValue.value) {
      internalValue.value = value.value;
    }
  });

  return [
    internalValue,
    (newValue, ...args) => {
      internalValue.value = newValue;
      // input 事件为 v-model 语法糖
      emit?.('input', newValue, ...args);
      onChange?.(newValue, ...args);
      if (eventName && eventName !== 'input') {
        emit?.(eventName, newValue, ...args);
      }
    },
  ];
}
