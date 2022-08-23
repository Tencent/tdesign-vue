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
        emit(`update:${propsName}`, newValue, ...args);
      } else {
        // 非受控模式
        internalValue.value = newValue;
      }
      emit(eventName, newValue, ...args);
      onChange?.(newValue, ...args);
    },
  ];
}
