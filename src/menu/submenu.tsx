import {
  h,
  defineComponent,
  computed,
  inject,
  ref,
  provide,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  watch,
  toRefs,
  nextTick,
  reactive,
} from 'vue';
import { isFunction } from 'lodash-es';
import { State } from '@popperjs/core';
import props from './submenu-props';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import FakeArrow from '../common-components/fake-arrow';
import Ripple from '../utils/ripple';
import { TdMenuInterface, TdSubMenuInterface, TdMenuItem } from './const';
import { getKeepAnimationMixins } from '../config-provider/config-receiver';
import { AnimationType } from '../config-provider/type';
import { usePrefixClass } from '../hooks/useConfig';
import { Popup, PopupPlacement } from '../popup';
import { TNode } from '../common';
import { TdSubmenuProps } from './type';
import useCollapseAnimation from '../hooks/useCollapseAnimation';

const keepAnimationMixins = getKeepAnimationMixins();

export default defineComponent({
  name: 'TSubmenu',
  components: {
    FakeArrow,
  },
  mixins: [keepAnimationMixins],
  directives: {
    ripple: Ripple,
  },
  props: {
    ...props,
    // HeadMenu 的“更多”节点已自行维护高亮，无需重复挂载隐藏菜单树。
    disableVirtualChild: Boolean,
  },
  setup(props) {
    const menu = inject<TdMenuInterface>('TdMenu');
    const {
      theme, activeValues, expandValues, mode, isHead, open,
    } = menu;
    const submenu = inject<TdSubMenuInterface>('TdSubmenu', {});
    const { setSubPopup, closeParentPopup, cancelHideTimer } = submenu;

    const classPrefix = usePrefixClass();

    const isActive = computed(() => activeValues.value.indexOf(props.value) > -1);
    const popupVisible = ref(false);
    const isCursorInPopup = ref(false);

    const rippleColor = computed(() => (theme.value === 'light' ? '#E7E7E7' : '#383838'));
    const isOpen = computed(() => {
      if (mode.value === 'popup') {
        return popupVisible.value;
      }
      return expandValues ? expandValues.value.includes(props.value) : false;
    });
    const menuItems = ref([]);
    const isNested = ref(false); // 是否嵌套

    const popupWrapperRef = ref<HTMLElement>();
    const subPopupRef = ref<HTMLElement>();
    const submenuRef = ref<HTMLElement>();
    const transitionClass = usePrefixClass('slide-down');
    const showTimer = ref<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = ref<ReturnType<typeof setTimeout> | null>(null);

    const clearTimers = () => {
      if (showTimer.value !== null) {
        clearTimeout(showTimer.value);
        showTimer.value = null;
      }
      if (hideTimer.value !== null) {
        clearTimeout(hideTimer.value);
        hideTimer.value = null;
      }
    };

    const classes = computed(() => [
      `${classPrefix.value}-submenu`,
      {
        [`${classPrefix.value}-is-disabled`]: props.disabled,
        [`${classPrefix.value}-is-opened`]: isOpen.value,
      },
    ]);
    const overlayInnerClassName = computed(() => [
      `${classPrefix.value}-menu__popup`,
      `${classPrefix.value}-is-${isHead ? 'horizontal' : 'vertical'}`,
      {
        [`${classPrefix.value}-is-opened`]: popupVisible.value,
      },
    ]);
    const overlayClassName = computed(() => [
      `${classPrefix.value}-menu--${theme.value}`,
      isHead && `${classPrefix.value}-is-head-menu`,
      { [`${classPrefix.value}-menu-is-nested`]: isNested.value },
      (props.popupProps as TdSubmenuProps['popupProps'])?.overlayClassName,
    ]);
    const submenuClass = computed(() => [
      `${classPrefix.value}-menu__item`,
      `${classPrefix.value}-menu__item-spacer`,
      {
        [`${classPrefix.value}-menu__item-spacer--right`]: !isHead || isNested.value,
        [`${classPrefix.value}-is-disabled`]: props.disabled,
        [`${classPrefix.value}-is-opened`]: isOpen.value,
        [`${classPrefix.value}-is-active`]: isActive.value,
      },
    ]);
    const subClass = computed(() => [
      `${classPrefix.value}-menu__sub`,
      {
        [`${classPrefix.value}-is-opened`]: isOpen.value,
      },
    ]);
    const arrowClass = computed(() => [
      {
        [`${classPrefix.value}-fake-arrow--active`]: isOpen.value,
      },
    ]);

    const passSubPopupRefToParent = (val: HTMLElement) => {
      if (isFunction(setSubPopup)) {
        setSubPopup(val);
      }
    };

    // methods
    const handleMouseEnter = () => {
      if (props.disabled) return;

      clearTimers();
      cancelHideTimer?.();

      showTimer.value = setTimeout(() => {
        if (!popupVisible.value) {
          open(props.value);
          // popupVisible设置为TRUE之后打开popup，因此需要在nextTick中确保可以拿到ref值
          nextTick(() => {
            passSubPopupRefToParent(popupWrapperRef.value);
          });
        }
        popupVisible.value = true;
        showTimer.value = null;
      }, 0);
    };

    const targetInPopup = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      const popupElement = getPopupElement();

      return Boolean(
        popupWrapperRef.value?.contains(el)
          || el.closest(`.${classPrefix.value}-menu__popup`) === popupWrapperRef.value
          || popupElement?.contains(el),
      );
    };

    const getPopupElement = () => popupWrapperRef.value?.closest?.(`.${classPrefix.value}-popup`) as HTMLElement;

    /*
     * Popup 渲染在 submenu DOM 外部，mouseleave 可能在光标仍位于 Popup 内时触发 (比如 Monica 插件)。
     * 若 relatedTarget 或当前 hover 状态仍在 Popup 内，则保持展开。
     */
    const shouldKeepPopupOpen = (relatedTarget: EventTarget | null) => targetInPopup(relatedTarget)
      || popupWrapperRef.value?.matches?.(':hover')
      || getPopupElement()?.matches?.(':hover');

    const handleMouseLeave = (e: MouseEvent) => {
      clearTimers();

      hideTimer.value = setTimeout(() => {
        if (isCursorInPopup.value || shouldKeepPopupOpen(e.relatedTarget)) {
          hideTimer.value = null;
          return;
        }
        popupVisible.value = false;
        hideTimer.value = null;
      }, 100);
    };

    const handleMouseLeavePopup = (e: any) => {
      const { toElement, relatedTarget } = e;
      let target = toElement || relatedTarget;

      if (target === subPopupRef.value) return;

      const isSubmenu = (el: Element) => el === submenuRef.value;
      while (target !== null && target !== document && !isSubmenu(target)) {
        target = target.parentNode;
      }

      isCursorInPopup.value = shouldKeepPopupOpen(toElement || relatedTarget);

      if (isCursorInPopup.value) {
        return;
      }

      if (!isSubmenu(target)) {
        clearTimers();
        hideTimer.value = setTimeout(() => {
          popupVisible.value = false;
          hideTimer.value = null;
        }, 100);

        closeParentPopup?.(e);
      }
    };
    const handleEnterPopup = () => {
      isCursorInPopup.value = true;

      if (hideTimer.value !== null) {
        clearTimeout(hideTimer.value);
        hideTimer.value = null;
      }
      cancelHideTimer?.();
    };

    const handleSubmenuItemClick = () => {
      if (props.disabled) return;
      open(props.value);
    };

    watch(popupVisible, (visible) => {
      menu.open(props.value, visible ? 'add' : 'remove');
    });

    // provide
    const { value } = toRefs(props);
    provide<TdSubMenuInterface>(
      'TdSubmenu',
      reactive({
        value,
        addMenuItem: (item: TdMenuItem) => {
          menuItems.value.push(item);
          if (submenu) {
            submenu.addMenuItem(item);
          }
        },
        setSubPopup: (ref: HTMLElement) => {
          subPopupRef.value = ref;
        },
        closeParentPopup: (e: MouseEvent) => {
          clearTimers();
          hideTimer.value = setTimeout(() => {
            popupVisible.value = false;
            hideTimer.value = null;
          }, 100);
          closeParentPopup?.(e);
        },
        cancelHideTimer: () => {
          if (hideTimer.value !== null) {
            clearTimeout(hideTimer.value);
            hideTimer.value = null;
          }
          cancelHideTimer?.();
        },
      }),
    );

    watch(popupWrapperRef, () => {
      // 第一次触发nextTick会取空值，导致subPopupRef拿不到对应的DOM
      passSubPopupRefToParent(popupWrapperRef.value);
    });

    onMounted(() => {
      menu?.vMenu?.add({
        value: props.value,
        parent: submenu?.value,
        vnode: isFunction(props.title) ? [props.title(h)] : props.title,
      });
      const instance = getCurrentInstance().proxy;
      let node = instance.$parent;

      while (node && !/^t(head)?menu/i.test(node.$vnode?.tag)) {
        if (/submenu/i.test(node.$vnode?.tag)) {
          isNested.value = true;
          break;
        }
        node = node?.$parent;
      }
    });

    onBeforeUnmount(() => {
      clearTimers();
      menu?.vMenu?.remove(props.value);
    });

    return {
      theme,
      mode,
      isHead,
      isNested,
      popupVisible,
      classes,
      subClass,
      isOpen,
      transitionClass,
      arrowClass,
      overlayInnerClassName,
      overlayClassName,
      submenuClass,
      rippleColor,
      popupWrapperRef,
      handleEnterPopup,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseLeavePopup,
      handleSubmenuItemClick,
      classPrefix,
      activeValues,
    };
  },
  methods: {
    renderPopup(triggerElement: TNode[]) {
      let placement = 'right-top';
      if (!this.isNested && this.isHead) {
        placement = 'bottom-left';
      }

      // 上下位置变化时,添加 bottom 和 top 类,用于添加 bottom 和 top 伪元素
      const placementChange = (state: State) => {
        const spacerEl = this.$refs.popupWrapperRef as HTMLElement;
        if (!spacerEl) return;

        const prefixClassName = `${this.classPrefix}-menu__spacer`;
        const isBottom = state.placement.startsWith('bottom');
        const isTop = state.placement.startsWith('top');

        spacerEl.classList.toggle(`${prefixClassName}--bottom`, isBottom);
        spacerEl.classList.toggle(`${prefixClassName}--top`, isTop);
      };

      const popupWrapper = (
        <div
          ref="popupWrapperRef"
          class={[
            `${this.classPrefix}-menu__spacer`,
            {
              [`${this.classPrefix}-menu__spacer--left`]: this.isNested || !this.isHead,
            },
          ]}
          onMouseenter={this.handleEnterPopup}
          onMouseleave={this.handleMouseLeavePopup}
        >
          <ul class={`${this.classPrefix}-menu__popup-wrapper`}>{renderContent(this, 'default', 'content')}</ul>
        </div>
      );
      const realPopup = (
        <Popup
          {...((this.popupProps ?? {}) as TdSubmenuProps['popupProps'])}
          overlayInnerClassName={[...this.overlayInnerClassName]}
          overlayClassName={[...this.overlayClassName]}
          visible={this.popupVisible}
          placement={(this.popupProps as TdSubmenuProps['popupProps'])?.placement ?? (placement as PopupPlacement)}
          content={() => popupWrapper}
          on={{ 'placement-change': placementChange }}
        >
          <div ref="submenuRef" class={this.submenuClass}>
            {triggerElement}
          </div>
        </Popup>
      );

      return realPopup;
    },
    renderHeadSubmenu() {
      const icon = renderTNodeJSX(this, 'icon');
      const rippleVal = (this.keepAnimation as Record<AnimationType, boolean>).ripple ? this.rippleColor : false;
      const normalSubmenu = [
        <div v-ripple={rippleVal} class={this.submenuClass} onClick={this.handleSubmenuItemClick}>
          {renderTNodeJSX(this, 'title')}
        </div>,
        <ul style="opacity: 0; width: 0; height: 0; overflow: hidden">{renderContent(this, 'default', 'content')}</ul>,
      ];

      const needRotate = this.mode === 'popup' && this.isNested;

      const triggerElement = [
        icon,
        <span class={[`${this.classPrefix}-menu__content`]}>{renderTNodeJSX(this, 'title', { silent: true })}</span>,
        <FakeArrow
          overlayClassName={/menu/i.test(this.$parent.$options.name) ? this.arrowClass : null}
          overlayStyle={{ transform: `rotate(${needRotate ? -90 : 0}deg)` }}
        />,
      ];
      return this.mode === 'normal' ? normalSubmenu : this.renderPopup(triggerElement);
    },
    renderSubmenu() {
      const hasContent = this.$slots.content || this.$slots.default;
      const icon = renderTNodeJSX(this, 'icon');
      const child = renderContent(this, 'default', 'content');
      let paddingLeft = 44;

      if (/submenu/i.test(this.$parent.$vnode?.tag)) {
        paddingLeft += 16;
      }
      const {
        beforeEnter, enter, afterEnter, beforeLeave, leave, afterLeave,
      } = useCollapseAnimation();

      const needRotate = this.mode === 'popup';
      const rippleVal = (this.keepAnimation as Record<AnimationType, boolean>).ripple ? this.rippleColor : false;

      const normalSubmenu = [
        <div v-ripple={rippleVal} class={this.submenuClass} onClick={this.handleSubmenuItemClick}>
          {icon}
          <span class={[`${this.classPrefix}-menu__content`]}>{renderTNodeJSX(this, 'title')}</span>
          {hasContent && (
            <FakeArrow
              overlayClassName={this.arrowClass}
              overlayStyle={{ transform: `rotate(${needRotate ? -90 : 0}deg)` }}
            />
          )}
        </div>,
        <transition
          name={this.transitionClass}
          onBeforeEnter={beforeEnter}
          onEnter={enter}
          onAfterEnter={afterEnter}
          onBeforeLeave={beforeLeave}
          onLeave={leave}
          onAfterLeave={afterLeave}
        >
          <ul
            v-show={this.isOpen}
            // @ts-ignore
            level={this.level}
            class={this.subClass}
            style={{ '--padding-left': `${paddingLeft}px` }}
          >
            {child}
          </ul>
        </transition>,
      ];
      const triggerElement = [
        icon,
        <span class={[`${this.classPrefix}-menu__content`]}>{renderTNodeJSX(this, 'title', { silent: true })}</span>,
        <FakeArrow
          overlayClassName={/menu/i.test(this.$parent.$options.name) ? this.arrowClass : null}
          overlayStyle={{ transform: `rotate(${needRotate ? -90 : 0}deg)`, 'margin-left': 'auto' }}
        />,
      ];

      return this.mode === 'normal' ? normalSubmenu : this.renderPopup(triggerElement);
    },
  },
  render() {
    let child = null;
    let events = {};
    let virtualChild;
    // popup模式下且存在多层的特殊封装场景中，需要将子节点挂载进行计算高亮
    if (!this.disableVirtualChild && this.activeValues.length < 2) {
      virtualChild = <div style="display:none">{renderContent(this, 'default', 'content')}</div>;
    }

    if (this.mode === 'popup') {
      events = {
        mouseenter: this.handleMouseEnter,
        mouseleave: this.handleMouseLeave,
      };
    }
    if (Object.keys(this.$slots).length > 0) {
      child = this.isHead ? this.renderHeadSubmenu() : this.renderSubmenu();
    }
    return (
      <li class={this.classes} {...{ on: events }}>
        {child}
        {virtualChild}
      </li>
    );
  },
});
