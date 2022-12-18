/**
 * Select 内部 option 处理
 * 将 slot 方式传入的 <t-option /> 元素与 prop 方式传入的 options 参数进行统一收编处理，便于数据管理和筛选
 *
 * 因为 Vue2 没有很好的方案监听 `未实际渲染的 Slots`，这里折中方案如下：
 * 在 slot 数组首层（若存在 group 分组，其子项作为一个整体考虑）的每个元素对象实例上，进行特殊标记的方式，来区别 slot 是否已经在内部 options 登记
 * 每次 beforeUpdate 之前，遍历 Select 实例 slot 数组首层，若存在未被标记的元素，则重新构造内部 option 数组
 */

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

// slot 是否已经被记录的标记字段名称
const markName = '_t_has_recorded';

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

    // props 中 options 参数优先级高于 slots
    if (props.options === undefined) {
      // 处理 slots 中 t-option 与 t-option-group
      const currentSlots = instance.proxy.$slots.default || [];
      // eslint-disable-next-line no-param-reassign
      currentSlots.forEach((v) => (v.data[markName] = true));
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

  // 组件初始化，构造内部 options 数组
  getOptions();
  // 监听 options 参数，变化时重新构造内部 options 数组
  watch(
    () => props.options,
    () => {
      getOptions();
    },
  );
  // 当组件 slot 变化时，重新构造内部 options 数组
  onBeforeUpdate(() => {
    if (instance.proxy.$slots.default?.some((v) => v.data[markName] !== true)) {
      getOptions();
    }
  });

  return {
    options,
    optionsMap,
    optionsList,
  };
}
