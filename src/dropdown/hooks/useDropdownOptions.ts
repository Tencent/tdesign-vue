import { Slots, SetupContext } from 'vue';
import { computed } from '@vue/composition-api';

import { DropdownOption, TdDropdownProps } from '../type';

export default function useDropdownOptions(props: TdDropdownProps, slots: Slots) {
  const getChildComponentSlots = (item: any) => {
    const children = item?.componentOptions?.children || item?.children;
    return children ? (Array.isArray(children) ? children : [children]) : [];
  };

  const getOptionItem = (item: any) => {
    const { value, content, children, divider, disabled, ...otherProps } = item?.componentOptions?.propsData || {};
    const onClick = item?.componentOptions?.listeners?.click;
    return {
      value,
      content,
      ...otherProps,
      disabled,
      divider,
      onClick,
    };
  };

  const getOptionsFromSlots = (slots: Slots) => {
    const dropdownItems = slots?.default ? (Array.isArray(slots.default) ? slots.default : [slots.default]) : [];
    const options: Array<DropdownOption> = [];

    dropdownItems?.forEach((item) => {
      if (item?.componentOptions?.tag === 'TDropdownItem' || item?.componentOptions?.tag === 't-dropdown-item') {
        const option = getOptionItem(item);
        const childOptions = getOptionsFromSlots({ default: getChildComponentSlots(item) });
        if (childOptions.length > 0) {
          option.children = childOptions;
        }
        options.push(option);
      } else if (
        item?.componentOptions?.tag === 'TDropdownMenu'
        || item?.componentOptions?.tag === 't-dropdown-menu'
      ) {
        options.push(...getOptionsFromSlots({ default: getChildComponentSlots(item) }));
      }
    });

    return options;
  };

  const options = computed(() => {
    if (props.options && props.options.length > 0) return props.options;

    return getOptionsFromSlots(slots);
  });

  return options;
}
