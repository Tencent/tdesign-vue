import { defineComponent, computed, inject, ref, provide, onMounted } from '@vue/composition-api';
import { prefix } from '../config';
import props from '@TdTypes/submenu/props';
import TIconChevronDown from '../icon/chevron-down';
import { TdMenuInterface, TdSubMenuInterface, TdMenuItem } from './const';

const name = `${prefix}-submenu`;
export default defineComponent({
  name,
  components: {
    TIconChevronDown,
  },
  props,
  data() {
    return {
      timeout: null,
      active: false,
      isCollapsed: false,
    };
  },
  setup(props, ctx) {
    const { expandedArray, mode, isHead, selectSubMenu, open } = inject<TdMenuInterface>('TdMenu');
    const menuItems = ref([]); // 因composition-api的缺陷，不用reactive， 详见：https://github.com/vuejs/composition-api/issues/637
    // const isActive = computed(() => {
    //   const childIsActive = menuItems.value.some(i => i.value === activeIndexValue.value);
    //   return activeIndexValue.value === props.value || childIsActive;
    // });
    const isOpen = computed(() => expandedArray ? expandedArray.value.includes(props.value) : false);
    const popupVisible = ref(false);
    let mouseInChild = false;
    const classes = computed(() => [
      `${prefix}-submenu`,
      // `${prefix}-menu__item`,
      {
        // [`${prefix}-head-menu__inner`]: mode === 'normal' && isHead,
        [`${prefix}-is-disabled`]: props.disabled,
        [`${prefix}-is-active`]: isOpen.value,
        [`${prefix}-is-opened`]: popupVisible.value || isOpen.value,
      },
    ]);
    const popupClass = computed(() => [
      `${prefix}-menu__popup`,
      { [`${prefix}-is-opened`]: popupVisible.value },
    ]);
    const submenuClass = computed(() => [
      // `${prefix}-menu-submenu`,
      `${prefix}-menu__item`,
      {
        [`${prefix}-is-opened`]: popupVisible.value || isOpen.value,
      },
    ]);
    const subClass = computed(() => [
      `${prefix}-menu__sub`,
      { [`${prefix}-is-opened`]: isOpen.value },
    ]);

    // methods
    const handleMouseenter = () => {
      if (mode.value === 'popup') {
        popupVisible.value = true;
      }
    };
    const handleMouseleave = () => {
      if (mode.value === 'popup') {
        setTimeout(() => {
          !mouseInChild && (popupVisible.value = false);
        }, 200);
      }
    };
    let timeout: number;
    const handlePopup = (flag: boolean) => {
      clearTimeout(timeout);
      // ts-dies
      timeout = window.setTimeout(() => {
        popupVisible.value = flag;
      }, 100);
    };
    const handleHeadmenuItemClick = () => {
      const isOpen = open(props.value);
      selectSubMenu(isOpen ? menuItems.value : []);
    };
    const handlePopupMouse = (flag: boolean) => {
      mouseInChild = flag;
    };
    const handleMouseLeaveSubmenu = () => {
      handlePopupMouse(false);
      handleMouseleave();
    };
    const handleSubmenuItemClick = (e: Event) => {
      e.stopPropagation();
      open(props.value);
    };

    // provide
    provide<TdSubMenuInterface>('TdSubmenu', {
      hasIcon: !!ctx.slots.icon,
      addMenuItem: (item: TdMenuItem) => {
        menuItems.value.push(item);
      },
    });

    onMounted(() => {
      if (isOpen.value) {
        if (selectSubMenu) {
          selectSubMenu(menuItems.value);
        }
      }
    });

    return {
      menuItems,
      mode,
      isHead,
      classes,
      // isActive,
      subClass,
      popupClass,
      submenuClass,
      handleMouseenter,
      handleMouseleave,
      handlePopupMouse,
      handleMouseLeaveSubmenu,
      handlePopup,
      handleSubmenuItemClick,
      handleHeadmenuItemClick,
    };
  },
  methods: {
    renderHeadSubmenu() {
      const normalSubmenu = [
        <div class={this.submenuClass} onClick={this.handleHeadmenuItemClick}>
          {this.$slots.title}
        </div>,
        <ul style="opacity: 0; width: 0; height: 0; overflow: hidden">
        {this.$slots.content || this.$slots.default}
        </ul>,
      ];
      const popupSubmenu = [
        <div class={this.submenuClass}
          onMouseenter={this.handleMouseenter}
          onMouseleave={this.handleMouseleave}
        >
          {this.$slots.title}
          <t-icon-chevron-down class="t-submenu-icon"></t-icon-chevron-down>
        </div>,
        <ul
          class={this.popupClass}
          onMouseenter={() => this.handlePopupMouse(true)}
          onMouseleave={this.handleMouseLeaveSubmenu}
          >
         {this.$slots.content || this.$slots.default}
       </ul>,
      ];
      return this.mode === 'normal' ? normalSubmenu : popupSubmenu;
    },
    renderSubmenu() {
      const hasContent = this.$slots.content || this.$slots.default;
      const normalSubmenu = [
        <div class={[`${prefix}-menu__item`]} onClick={this.handleSubmenuItemClick}>
          {this.$slots.icon}
          <span class={[`${prefix}-menu__content`]}>{this.$slots.title}</span>
          {hasContent && <t-icon-chevron-down class="t-submenu-icon"></t-icon-chevron-down>}
        </div>,
        <ul
          class={this.subClass}
          onMouseenter={() => this.handlePopupMouse(true)}
          onMouseleave={() => this.handlePopupMouse(false)}
        >
          {this.$slots.content || this.$slots.default}
        </ul>,
      ];
      const popupSubmenu = [
        <div class="t-menu__item" onMouseenter={() => this.handlePopup(true)} onMouseleave={() => this.handlePopup(false)}>
          {this.$slots.icon}
          <span class={[`${prefix}-menu__content`]}>{this.$slots.title}</span>
          <t-icon-chevron-down class="t-submenu-icon"></t-icon-chevron-down>
        </div>,
        <ul class={this.popupClass} onMouseenter={() => this.handlePopup(true)} onMouseleave={() => this.handlePopup(false)}>
          {this.$slots.content || this.$slots.default}
        </ul>,
      ];

      return this.mode === 'normal' ? normalSubmenu : popupSubmenu;
    },
  },
  render() {
    let child = null;

    if (Object.keys(this.$slots).length > 0) {
      child = this.isHead ? this.renderHeadSubmenu() : this.renderSubmenu();
    }
    return (
      <li class={this.classes}>
        {child}
      </li>
    );
  },
});

