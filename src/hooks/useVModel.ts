import { Ref, ref, getCurrentInstance } from '@vue/composition-api';
import kebabCase from 'lodash/kebabCase';

export type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void;

export interface UseVModelParams<T> {
  value: Ref<T>;
  eventName?: string;
  propName?: string;
}

export function useVModel<T, P extends any[]>(
  value: Ref<T>,
  defaultValue: T,
  onChange: ChangeHandler<T, P>,
  eventName = 'change',
  propName = 'value',
  // 除了 value + onChange，还支持其他同含义字段和事件
  alias: UseVModelParams<T>[] = [],
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

  // controlled, other fields, upload.files.etc.
  for (let i = 0, len = alias.length; i < len; i++) {
    const item = alias[i];
    if (Object.prototype.hasOwnProperty.call(vnode.componentOptions.propsData, item.propName)) {
      return [
        item.value,
        (newValue, ...args) => {
          // .sync support
          emit?.(`update:${item.propName}`, newValue, ...args);
          onChange?.(newValue, ...args);
          if (item.eventName && item.eventName !== 'input') {
            emit?.(item.eventName, newValue, ...args);
          }
        },
      ];
    }
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

export default useVModel;
