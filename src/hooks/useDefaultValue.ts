import {
  ref, Ref, getCurrentInstance, watch,
} from '@vue/composition-api';

export type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void;

export default function useDefaultValue<T, P extends any[]>(
  value: Ref<T>,
  defaultValue: T,
  onChange: ChangeHandler<T, P>,
  // emit 和 propsName 用于支持 .sync 语法糖。而 eventName 用于支持 @change 类型的事件
  propsName: string,
  eventName: string,
): [Ref<T>, ChangeHandler<T, P>] {
  const { emit } = getCurrentInstance();

  const internalValue = ref();
  internalValue.value = typeof value.value !== 'undefined' ? value.value : defaultValue;

  watch(value, () => {
    if (value.value !== internalValue.value) {
      internalValue.value = value.value;
    }
  });

  return [
    internalValue,
    (newValue, ...args) => {
      emit(`update:${propsName}`, newValue, ...args);
      internalValue.value = newValue;
      emit(eventName, newValue, ...args);
      onChange?.(newValue, ...args);
    },
  ];
}
