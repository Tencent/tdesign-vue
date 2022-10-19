import { CreateElement } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import { defineComponent, h } from '@vue/composition-api';
import { ChevronRightIcon as TdChevronRightIcon, ChevronLeftIcon as TdChevronLeftIcon } from 'tdesign-icons-vue';
import isFunction from 'lodash/isFunction';

import DropdownItem from './dropdown-item';
import { DropdownOption } from './type';
import DropdownProps from './props';
import TDivider from '../divider';
import { usePrefixClass } from '../hooks/useConfig';
import { useGlobalIcon } from '../hooks/useGlobalIcon';

export default defineComponent({
  name: 'TDropdownMenu',
  props: { ...DropdownProps },
  setup(props, { emit }) {
    const dropdownClass = usePrefixClass('dropdown');
    const dropdownMenuClass = usePrefixClass('dropdown__menu');

    const handleItemClick = (
      optionItem: { disabled: boolean; children: unknown },
      options: { data: DropdownOption; context: { e: MouseEvent } },
    ) => {
      if (optionItem.disabled || optionItem.children) return;
      const { data, context } = options;
      data?.onClick?.(data, context);

      props.onClick?.(data, context);
      emit('click', data, context);
    };

    return {
      dropdownClass,
      dropdownMenuClass,
      handleItemClick,
    };
  },
  methods: {
    renderOptionContent(content: string | ((h: CreateElement) => ScopedSlotReturnValue)) {
      if (isFunction(content)) {
        return content(h);
      }
      return content;
    },
    // 处理options渲染的场景
    renderOptions(data: Array<DropdownOption>) {
      const { ChevronRightIcon, ChevronLeftIcon } = useGlobalIcon({
        ChevronRightIcon: TdChevronRightIcon,
        ChevronLeftIcon: TdChevronLeftIcon,
      });
      const arr: Array<unknown> = [];
      let renderContent;
      data.forEach?.((menu, idx) => {
        const optionItem = { ...(menu as DropdownOption) };

        if (optionItem.children) {
          optionItem.children = this.renderOptions(optionItem.children);
          renderContent = (
            <div key={idx}>
              <DropdownItem
                class={[`${this.dropdownClass}__item`, `${this.dropdownClass}__item--suffix`, optionItem.class]}
                {...{
                  props: {
                    value: optionItem.value,
                    theme: optionItem.theme,
                    active: optionItem.active,
                    prefixIcon: optionItem.prefixIcon,
                    disabled: optionItem.disabled,
                    minColumnWidth: this.minColumnWidth,
                    maxColumnWidth: this.maxColumnWidth,
                    isSubmenu: true,
                  },
                }}
              >
                {this.direction === 'right' ? (
                  <div class={`${this.dropdownClass}__item-content`}>
                    <span class={`${this.dropdownClass}__item-text`}>
                      {this.renderOptionContent(optionItem.content)}
                    </span>
                    <ChevronRightIcon class={`${this.dropdownClass}__item-direction`} size="16" />
                  </div>
                ) : (
                  <div class={`${this.dropdownClass}__item-content`}>
                    <ChevronLeftIcon class={`${this.dropdownClass}__item-direction`} size="16" />
                    <span class={`${this.dropdownClass}__item-text`}>
                      {this.renderOptionContent(optionItem.content)}
                    </span>
                  </div>
                )}
                <div
                  class={[
                    `${this.dropdownClass}__submenu`,
                    {
                      [`${this.dropdownClass}__submenu--disabled`]: optionItem.disabled,
                      [`${this.dropdownClass}__submenu--${this.direction}`]: this.direction,
                    },
                  ]}
                  style={{
                    top: `${idx * 30}px`,
                  }}
                >
                  <ul>{optionItem.children}</ul>
                </div>
              </DropdownItem>
              {optionItem.divider ? <TDivider /> : null}
            </div>
          );
        } else {
          renderContent = (
            <div key={idx}>
              <DropdownItem
                class={[`${this.dropdownClass}__item`, optionItem.class]}
                {...{
                  props: {
                    value: optionItem.value,
                    theme: optionItem.theme,
                    active: optionItem.active,
                    prefixIcon: optionItem.prefixIcon,
                    disabled: optionItem.disabled,
                    minColumnWidth: this.minColumnWidth,
                    maxColumnWidth: this.maxColumnWidth,
                    onClick: (value: string | number | { [key: string]: any }, context: { e: MouseEvent }) => this.handleItemClick(
                      { disabled: optionItem.disabled, children: optionItem.children },
                      { data: optionItem, context },
                    ),
                  },
                }}
              >
                <span class={`${this.dropdownClass}__item-text`}>{this.renderOptionContent(optionItem.content)}</span>
              </DropdownItem>
              {optionItem.divider ? <TDivider /> : null}
            </div>
          );
        }
        arr.push(renderContent);
      });
      return arr;
    },
  },
  render() {
    return (
      <div
        class={[this.dropdownMenuClass, `${this.dropdownMenuClass}--${this.direction}`]}
        style={{
          maxHeight: `${this.maxHeight}px`,
        }}
      >
        {this.renderOptions(this.options)}
      </div>
    );
  },
});
