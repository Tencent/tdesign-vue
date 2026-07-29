/* eslint-disable no-param-reassign */
import {
  defineComponent, inject, provide, ref, onMounted, onUpdated,
} from 'vue';
import { TdMenuInterface } from '../const';
import { usePrefixClass } from '../../hooks/useConfig';

export default defineComponent({
  name: 'PopupOverflowContent',
  props: {
    foldIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props, ctx) {
    const classPrefix = usePrefixClass();
    const wrapperRef = ref<HTMLElement>();
    const menu = inject<TdMenuInterface>('TdMenu');
    const hiddenItems = new WeakSet<HTMLElement>();
    const itemDisplayStates = new WeakMap<HTMLElement, { value: string; priority: string }>();

    const setFoldHidden = (element: HTMLElement, hidden: boolean) => {
      if (hidden) {
        if (!hiddenItems.has(element)) {
          itemDisplayStates.set(element, {
            value: element.style.getPropertyValue('display'),
            priority: element.style.getPropertyPriority('display'),
          });
          hiddenItems.add(element);
        }
        element.style.setProperty('display', 'none', 'important');
        return;
      }
      if (!hiddenItems.has(element)) return;
      const display = itemDisplayStates.get(element);
      if (display?.value) {
        element.style.setProperty('display', display.value, display.priority);
      } else {
        element.style.removeProperty('display');
      }
      hiddenItems.delete(element);
      itemDisplayStates.delete(element);
    };

    // Popup 中的菜单项是原菜单项的副本，不应再次注册到 HeadMenu 的 VMenu。
    provide<TdMenuInterface>('TdMenu', {
      ...menu,
      vMenu: null,
    });

    const hideBeforeFoldIndex = () => {
      if (!wrapperRef.value) return;
      const menuItemClass = `${classPrefix.value}-menu__item`;
      const submenuClass = `${classPrefix.value}-submenu`;
      const items: HTMLElement[] = [];

      const collect = (parent: HTMLElement, depth: number) => {
        if (depth > 3) return;
        Array.from(parent.children).forEach((element) => {
          if (!(element instanceof HTMLElement)) return;
          if (element.classList.contains(menuItemClass) || element.classList.contains(submenuClass)) {
            items.push(element);
          } else if (getComputedStyle(element).display !== 'none') {
            collect(element, depth + 1);
          }
        });
      };

      collect(wrapperRef.value, 0);
      items.forEach((element, index) => {
        setFoldHidden(element, index < props.foldIndex);
      });
    };

    onMounted(hideBeforeFoldIndex);
    onUpdated(hideBeforeFoldIndex);

    return {
      wrapperRef,
      content: () => ctx.slots.default?.(),
    };
  },
  render() {
    return <div ref="wrapperRef">{this.content()}</div>;
  },
});
