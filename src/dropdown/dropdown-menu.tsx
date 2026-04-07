import { ScopedSlotReturnValue } from 'vue/types/vnode';
import {
  CreateElement, defineComponent, h, ref, onMounted, reactive, set, computed,
} from 'vue';
import { ChevronRightIcon as TdChevronRightIcon } from 'tdesign-icons-vue';
import { isFunction } from 'lodash-es';

import DropdownItem from './dropdown-item';

import { DropdownOption } from './type';
import DropdownProps from './props';
import TDivider from '../divider';
import { usePrefixClass } from '../hooks/useConfig';
import { useGlobalIcon } from '../hooks/useGlobalIcon';
import { useTNodeJSX } from '../hooks/tnode';

export default defineComponent({
  name: 'TDropdownMenu',
  props: { ...DropdownProps },
  setup(props, { emit, slots }) {
    const dropdownClass = usePrefixClass('dropdown');
    const dropdownMenuClass = usePrefixClass('dropdown__menu');
    const renderTNodeJSX = useTNodeJSX();
    const menuRef = ref<HTMLElement>();
    const isOverMaxHeight = ref(false);
    const scrollTopMap = reactive({});
    const panelTopContentHeight = ref(0);
    const validPanelTopContent = computed(() => !!slots['panel-top-content']);

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
        requestAnimationFrame(() => {
          if (validPanelTopContent.value) {
            const panelTopHeight = parseInt(getComputedStyle(menuRef.value.childNodes?.[0] as HTMLElement)?.height, 10) || 0;
            panelTopContentHeight.value = panelTopHeight;
          }
        });
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
      renderTNodeJSX,
      validPanelTopContent,
      panelTopContentHeight,
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
      const { ChevronRightIcon } = useGlobalIcon({
        ChevronRightIcon: TdChevronRightIcon,
      });
      const arr: Array<unknown> = [];
      let renderContent;
      data.forEach?.((menu, idx) => {
        const optionItem = { ...(menu as DropdownOption) };
        const onViewIdx = idx - Math.ceil(this.scrollTopMap[deep] / 30);
        const renderIdx = onViewIdx >= 0 ? onViewIdx : idx;
        // 只有第一层子节点需要加上 panelTopContent 的高度
        const shouldCalcPanelTopContent = this.validPanelTopContent && deep > 0;

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
                <div class={`${this.dropdownClass}__item-content`}>
                  <span class={`${this.dropdownClass}__item-text`}>{this.renderOptionContent(optionItem.content)}</span>
                  <ChevronRightIcon class={`${this.dropdownClass}__item-direction`} size="16" />
                </div>
                <div
                  class={[
                    `${this.dropdownClass}__submenu-wrapper`,
                    {
                      [`${this.dropdownClass}__submenu-wrapper--${this.direction}`]: this.direction,
                    },
                  ]}
                  style={{
                    position: 'absolute',
                    top: `${
                      renderIdx * 30 + (shouldCalcPanelTopContent ? 0 : (this.panelTopContentHeight as number))
                    }px`,
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
    const panelTopContent = this.renderTNodeJSX('panelTopContent')?.[0];
    const panelBottomContent = this.renderTNodeJSX('panelBottomContent')?.[0];

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
        {panelTopContent ? <div className={`${this.dropdownClass}__top-content`}>{panelTopContent}</div> : null}
        {this.renderOptions(this.options, 0)}
        {panelBottomContent ? (
          <div className={`${this.dropdownClass}__bottom-content`}>{panelBottomContent}</div>
        ) : null}
      </div>
    );
  },
});
