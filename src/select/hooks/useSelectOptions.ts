import {
  ref, Ref, computed, onBeforeUpdate, ComponentInternalInstance, watch,
} from '@vue/composition-api';
import { VNode } from 'vue';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import {
  TdSelectProps, SelectKeysType, TdOptionProps, SelectOptionGroup, SelectValue,
} from '../type';

type UniOption = (TdOptionProps | SelectOptionGroup) & {
  index?: number;
  slots?: () => VNode;
};

export default function useSelectOptions(
  props: TdSelectProps,
  instance: ComponentInternalInstance,
  keys: Ref<SelectKeysType>,
) {
  const options = ref<UniOption[]>([]);

  const getOptions = () => {
    let dynamicIndex = 0;

    // 解析 props 中 options 字段的配置，以此初始化 innerOptions
    const innerOptions: UniOption[] = props.options?.map((option) => {
      const getFormatOption = (option: TdOptionProps) => {
        const { value, label } = keys.value;
        const res = {
          ...option,
          index: dynamicIndex,
          label: get(option, label),
          value: get(option, value),
        };
        dynamicIndex += 1;
        return res;
      };
      if ((option as SelectOptionGroup).group && (option as SelectOptionGroup).children) {
        return {
          ...option,
          children: (option as SelectOptionGroup).children.map((child) => getFormatOption(child)),
        };
      }
      return getFormatOption(option);
    }) || [];

    // 处理 slots 中 t-option 与 t-option-group
    const currentSlots = instance.proxy.$slots.default || [];
    const optionsSlots = currentSlots.filter((item) => item.componentOptions?.tag === 't-option');
    const groupSlots = currentSlots.filter((item) => item.componentOptions?.tag === 't-option-group');
    if (isArray(groupSlots)) {
      groupSlots.forEach((group) => {
        const groupOption = {
          group: (group.componentOptions.propsData as TdOptionProps)?.label,
          ...group.componentOptions.propsData,
          children: [] as TdOptionProps[],
        };

        const res = group.componentOptions.children;
        if (isArray(res)) {
          res.forEach((child) => {
            groupOption.children.push({
              // 单独处理 style 和 class 参数的透传
              class: child.data.staticClass,
              style: child.data.staticStyle,
              // 透传其他常规参数
              ...child.componentOptions.propsData,
              slots: () => child.componentOptions.children,
              index: dynamicIndex,
            } as TdOptionProps);
            dynamicIndex += 1;
          });
        }

        innerOptions.push(groupOption);
      });
    }

    if (isArray(optionsSlots)) {
      optionsSlots.forEach((child) => {
        innerOptions.push({
          // 单独处理 style 和 class 参数的透传
          class: child.data.staticClass,
          style: child.data.staticStyle,
          // 透传其他常规参数
          ...child.componentOptions.propsData,
          slots: () => child.componentOptions.children,
          index: dynamicIndex,
        } as TdOptionProps);
        dynamicIndex += 1;
      });
    }

    options.value = innerOptions;
  };

  const optionsMap = computed(() => {
    const res = new Map<SelectValue, TdOptionProps>();
    optionsList.value.forEach((option: TdOptionProps) => {
      res.set(option.value, option);
    });
    return res;
  });

  const optionsList = computed(() => {
    const res: TdOptionProps[] = [];
    const getOptionsList = (options: TdOptionProps[]) => {
      options.forEach((option) => {
        if ((option as SelectOptionGroup).group) {
          getOptionsList((option as SelectOptionGroup).children);
        } else {
          res.push(option);
        }
      });
    };
    getOptionsList(options.value);
    return res;
  });

  // 首次初始化的时候
  getOptions();
  // 监听 options 参数，变化时重新构造内部 options 数组
  watch(
    () => props.options,
    () => {
      getOptions();
    },
  );
  // 监听组件 slot，当变化时构造内部 options 数组
  onBeforeUpdate(() => {
    getOptions();
  });

  return {
    options,
    optionsMap,
    optionsList,
  };
}
