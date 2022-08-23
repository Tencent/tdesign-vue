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
  internalValue.value = defaultValue;

  // 受控模式 v-model
  if (typeof value.value !== 'undefined') {
    internalValue.value = value.value;
  }

  // 受控模式 v-model 监听 value 变化
  watch(value, (newVal) => {
    internalValue.value = newVal;
  });

  return [
    internalValue,
    (newValue, ...args) => {
      if (typeof value.value !== 'undefined') {
        // 受控模式
        emit?.('input', newValue, ...args);
      } else {
        // 非受控模式
        internalValue.value = newValue;
      }
      if (eventName && eventName !== 'input') {
        emit?.(eventName, newValue, ...args);
      }
      onChange?.(newValue, ...args);
    },
  ];
}
