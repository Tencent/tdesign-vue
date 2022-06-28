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
  // 非受控模式, defaultValue 只消费一次
  internalValue.value = defaultValue;

  if (typeof value.value !== 'undefined') {
    // v-model 受控模式，同步 value 的初值
    internalValue.value = value.value;
  }

  // 监听 value 的变化
  watch(value, (newVal) => {
    internalValue.value = newVal;
  });

  return [
    internalValue,
    (newValue, ...args) => {
      // input 事件为 v-model 语法糖
      emit?.('input', newValue, ...args);
      if (typeof value.value === 'undefined') {
        internalValue.value = newValue;
      }
      onChange?.(newValue, ...args);
      if (eventName && eventName !== 'input') {
        emit?.(eventName, newValue, ...args);
      }
    },
  ];
}
