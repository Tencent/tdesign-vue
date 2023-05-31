import {
  defineComponent,
  computed,
  inject,
  ref,
  provide,
  onMounted,
  getCurrentInstance,
  watch,
  toRefs,
  nextTick,
  reactive,
} from '@vue/composition-api';
import isFunction from 'lodash/isFunction';
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
  props,
  setup(props) {
    const menu = inject<TdMenuInterface>('TdMenu');
    const {
      theme, activeValues, expandValues, mode, isHead, open,
    } = menu;
    const submenu = inject<TdSubMenuInterface>('TdSubmenu', {});
    const { setSubPopup, closeParentPopup } = submenu;

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

    const classes = computed(() => [
      `${classPrefix.value}-submenu`,
      {
        [`${classPrefix.value}-is-disabled`]: props.disabled,
        [`${classPrefix.value}-is-opened`]: isOpen.value,
      },
    ]);
    const popupClass = computed(() => [
      `${classPrefix.value}-menu__popup`,
      `${classPrefix.value}-is-${isHead ? 'horizontal' : 'vertical'}`,
      {
        [`${classPrefix.value}-is-opened`]: popupVisible.value,
      },
    ]);
    const submenuClass = computed(() => [
      `${classPrefix.value}-menu__item`,
      `${classPrefix.value}-menu__item-spacer`,
      `${classPrefix.value}-menu__item-spacer--${isHead && !isNested.value ? 'bottom' : 'right'}`,
      {
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
      setTimeout(() => {
        if (!popupVisible.value) {
          open(props.value);
          // popupVisible设置为TRUE之后打开popup，因此需要在nextTick中确保可以拿到ref值
          nextTick(() => {
            passSubPopupRefToParent(popupWrapperRef.value);
          });
        }
        popupVisible.value = true;
      }, 0);
    };

    const targetInPopup = (el: HTMLElement) => el?.classList.contains(`${classPrefix.value}-menu__popup`);
    const loopInPopup = (el: HTMLElement): boolean => {
      if (!el) return false;
      return targetInPopup(el) || loopInPopup(el.parentElement);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      setTimeout(() => {
        const inPopup = targetInPopup(e.relatedTarget as HTMLElement);

        if (isCursorInPopup.value || inPopup) return;
        popupVisible.value = false;
      }, 0);
    };

    const handleMouseLeavePopup = (e: any) => {
      const { toElement, relatedTarget } = e;
      let target = toElement || relatedTarget;

      if (target === subPopupRef.value) return;

      const isSubmenu = (el: Element) => el === submenuRef.value;
      while (target !== null && target !== document && !isSubmenu(target)) {
        target = target.parentNode;
      }

      isCursorInPopup.value = false;

      if (!isSubmenu(target)) {
        popupVisible.value = false;
      }

      closeParentPopup?.(e);
    };
    const handleEnterPopup = () => {
      isCursorInPopup.value = true;
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
          const related = e.relatedTarget as HTMLElement;
          if (loopInPopup(related)) return;
          handleMouseLeavePopup(e);
        },
      }),
    );

    watch(popupWrapperRef, () => {
      // 第一次触发nextTick会取空值，导致subPopupRef拿不到对应的DOM
      passSubPopupRefToParent(popupWrapperRef.value);
    });

    onMounted(() => {
      menu?.vMenu?.add({ value: props.value, parent: submenu?.value });
      const instance = getCurrentInstance();
      let node = instance.parent;

      while (node && isHead) {
        if (/submenu/i.test(node.vnode?.tag)) {
          isNested.value = true;
          break;
        }
        node = node?.parent;
      }
    });

    return {
      theme,
      mode,
      isHead,
      isNested,
      popupVisible,
      classes,
      subClass,
      arrowClass,
      popupClass,
      submenuClass,
      rippleColor,
      popupWrapperRef,
      handleEnterPopup,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseLeavePopup,
      handleSubmenuItemClick,
      classPrefix,
    };
  },
  methods: {
    renderPopup(triggerElement: TNode[]) {
      let placement = 'right-top';
      if (!this.isNested && this.isHead) {
        placement = 'bottom-left';
      }
      const overlayInnerStyle = this.isNested && this.isHead ? { marginLeft: '0px' } : { "margin-top': ": '12px' };

      const popupWrapper = (
        <div
          ref="popupWrapperRef"
          class={[
            `${this.classPrefix}-menu__spacer`,
            `${this.classPrefix}-menu__spacer--${!this.isNested && this.isHead ? 'top' : 'left'}`,
          ]}
          onMouseenter={this.handleEnterPopup}
          onMouseleave={this.handleMouseLeavePopup}
        >
          <ul class={`${this.classPrefix}-menu__popup-wrapper`}>{renderContent(this, 'default', 'content')}</ul>
        </div>
      );
      const realPopup = (
        <Popup
          overlayInnerClassName={[...this.popupClass]}
          overlayClassName={`${this.classPrefix}-menu--${this.theme}`}
          visible={this.popupVisible}
          placement={placement as PopupPlacement}
          overlayInnerStyle={overlayInnerStyle}
          content={() => popupWrapper}
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

      const needRotate = this.mode === 'popup';
      const rippleVal = (this.keepAnimation as Record<AnimationType, boolean>).ripple ? this.rippleColor : false;

      const normalSubmenu = [
        <div v-ripple={rippleVal} class={this.submenuClass} onClick={this.handleSubmenuItemClick}>
          {icon}
          <span class={[`${this.classPrefix}-menu__content`]}>{renderTNodeJSX(this, 'title')}</span>
          {hasContent && (
            <fake-arrow
              overlayClassName={this.arrowClass}
              overlayStyle={{ transform: `rotate(${needRotate ? -90 : 0}deg)` }}
            />
          )}
        </div>,
        <ul level={this.level} class={this.subClass} style={{ '--padding-left': `${paddingLeft}px` }}>
          {child}
        </ul>,
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
      </li>
    );
  },
});
