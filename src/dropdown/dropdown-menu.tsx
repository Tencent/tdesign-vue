import { CreateElement } from 'vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';
import {
  defineComponent, h, ref, onMounted, reactive, set,
} from '@vue/composition-api';
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
    const menuRef = ref<HTMLElement>();
    const isOverMaxHeight = ref(false);
    const scrollTopMap = reactive({});
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

    const handleScroll = (e: MouseEvent, deep: number) => {
      const { scrollTop } = e.target as HTMLElement;
      set(scrollTopMap, deep, scrollTop);
    };
    onMounted(() => {
      if (menuRef.value) {
        const menuHeight = parseInt(window?.getComputedStyle(menuRef.value).height, 10);
        if (menuHeight >= props.maxHeight) isOverMaxHeight.value = true;
      }
    });

    return {
      dropdownClass,
      dropdownMenuClass,
      handleItemClick,
      menuRef,
      isOverMaxHeight,
      handleScroll,
      scrollTopMap,
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
    renderOptions(data: Array<DropdownOption>, deep: number) {
      const { ChevronRightIcon, ChevronLeftIcon } = useGlobalIcon({
        ChevronRightIcon: TdChevronRightIcon,
        ChevronLeftIcon: TdChevronLeftIcon,
      });
      const arr: Array<unknown> = [];
      let renderContent;
      data.forEach?.((menu, idx) => {
        const optionItem = { ...(menu as DropdownOption) };
        const onViewIdx = idx - Math.ceil(this.scrollTopMap[deep] / 30);
        const renderIdx = onViewIdx >= 0 ? onViewIdx : idx;

        if (optionItem.children) {
          optionItem.children = this.renderOptions(optionItem.children, deep + 1);
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
                    `${this.dropdownClass}__submenu-wrapper`,
                    {
                      [`${this.dropdownClass}__submenu-wrapper--${this.direction}`]: this.direction,
                    },
                  ]}
                  style={{
                    position: 'absolute',
                    top: `${renderIdx * 30}px`,
                  }}
                >
                  <div
                    class={[
                      `${this.dropdownClass}__submenu`,
                      {
                        [`${this.dropdownClass}__submenu--disabled`]: optionItem.disabled,
                      },
                    ]}
                    style={{
                      position: 'static',
                      maxHeight: `${this.maxHeight}px`,
                    }}
                    onScroll={(e: MouseEvent) => this.handleScroll(e, deep + 1)}
                  >
                    <ul>{optionItem.children}</ul>
                  </div>
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
        class={[
          this.dropdownMenuClass,
          `${this.dropdownMenuClass}--${this.direction}`,
          {
            [`${this.dropdownMenuClass}--overflow`]: this.isOverMaxHeight,
          },
        ]}
        style={{
          maxHeight: `${this.maxHeight}px`,
        }}
        ref="menuRef"
        onScroll={(e: MouseEvent) => this.handleScroll(e, 0)}
      >
        {this.renderOptions(this.options, 0)}
      </div>
    );
  },
});
