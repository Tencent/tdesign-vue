import { Ref, ref, getCurrentInstance } from '@vue/composition-api';
import kebabCase from 'lodash/kebabCase';

export type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void;

export default function useVModel<T, P extends any[]>(
  value: Ref<T>,
  defaultValue: T,
  onChange: ChangeHandler<T, P>,
  // eventName 不是 input 时，需要单独传入 eventName 用于事件输出
  eventName?: string,
  propName = 'value',
): [Ref<T>, ChangeHandler<T, P>] {
  const { emit, vnode } = getCurrentInstance();
  const internalValue = ref<T>();
  internalValue.value = defaultValue;

  const isControlled = Object.prototype.hasOwnProperty.call(vnode.componentOptions.propsData, propName)
    || Object.prototype.hasOwnProperty.call(vnode.componentOptions.propsData, kebabCase(propName));
  // 受控模式
  if (isControlled) {
    return [
      value,
      (newValue, ...args) => {
        // input 事件为 v-model 语法糖
        emit?.('input', newValue, ...args);
        onChange?.(newValue, ...args);
        if (eventName && eventName !== 'input') {
          emit?.(eventName, newValue, ...args);
        }
      },
    ];
  }

  // 非受控模式
  return [
    internalValue,
    (newValue, ...args) => {
      internalValue.value = newValue;
      onChange?.(newValue, ...args);
      if (eventName && eventName !== 'input') {
        emit?.(eventName, newValue, ...args);
      }
    },
  ];
}
