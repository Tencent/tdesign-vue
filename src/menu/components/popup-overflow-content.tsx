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
          } else {
            collect(element, depth + 1);
          }
        });
      };

      collect(wrapperRef.value, 0);
      items.forEach((element, index) => {
        element.style.display = index < props.foldIndex ? 'none' : '';
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
