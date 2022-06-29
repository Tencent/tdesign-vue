import {
  ref, Ref, watch, getCurrentInstance,
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
  const { emit, attrs } = getCurrentInstance();

  const internalValue = ref();
  internalValue.value = defaultValue;

  if (typeof value.value !== 'undefined') {
    // 受控模式 v-model:propName
    internalValue.value = value.value;
  }

  // 监听value变化
  watch(value, (newVal) => {
    internalValue.value = newVal;
  });

  return [
    internalValue,
    (newValue, ...args) => {
      if (attrs[`onUpdate:${propsName}`]) {
        // 受控模式 v-model:propName
        emit?.(`update:${propsName}`, newValue, ...args);
      }

      if (typeof value.value === 'undefined') {
        internalValue.value = newValue;
      }

      emit(eventName, newValue, ...args);
      onChange?.(newValue, ...args);
    },
  ];
}
