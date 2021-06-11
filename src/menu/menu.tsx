import { defineComponent, ref, computed, provide, watchEffect, watch } from '@vue/composition-api';
import { prefix } from '../config';
import props from '@TdTypes/menu/props';
import { MenuValue } from '@TdTypes/menu/TdMenuProps';
import { TdMenuInterface } from './const';
const name = `${prefix}-menu`;

export default defineComponent({
  name,
  props: { ...props },
  setup(props, ctx) {
    const mode = ref(props.expandType);
    const menuClass = computed(() => [
      `${prefix}-default-menu`,
      `${prefix}-menu-mode__${mode.value}`,
      `${prefix}-menu--${props.theme}`,
      {
        [`${prefix}-is-collapsed`]: props.collapsed,
      },
    ]);
    const innerClasses = computed(() => [
      `${prefix}-menu`,
      { [`${prefix}-menu--scroll`]: mode.value !== 'popup' },
    ]);
    const { width } = props;
    const expandWidth = typeof width === 'number' ? `${width}px` : width;
    const styles = computed(() => ({
      height: '100%',
      width: props.collapsed ? '64px' : expandWidth,
    }));
    const activeIndexValue = ref(props.value);
    const expandedArray = ref(props.expanded || []);

    watchEffect(() => {
      mode.value = props.collapsed ? 'popup' : 'normal';
      // if (typeof props.onCollapsed === 'function') {
      //   props.onCollapsed({ props.collapsed });
      // }
      // ctx.emit('collapsed', props.collapsed);

      // collapsed只能通过props传入，好像这个事件没有意义。todo
    });

    provide<TdMenuInterface>('TdMenu', {
      activeIndexValue,
      expandedArray,
      mode,
      isHead: false,
      select: (val: MenuValue) => {
        activeIndexValue.value = val;
        if (typeof props.onChange === 'function') {
          props.onChange(val);
        }
        ctx.emit('change', val);
      },
      open: (val: MenuValue) => {
        const index = expandedArray.value.indexOf(val);
        if (props.expandMutex) {
          expandedArray.value.splice(0, 1);
          if (index === -1) {
            expandedArray.value.push(val);
            return true;
          }
        } else {
          if (index > -1) {
            expandedArray.value.splice(index, 1);
            return true;
          }
          expandedArray.value.push(val);
          return false;
        }
      },
    });

    // watch
    watch(
      () => props.expanded,
      (value) => {
        expandedArray.value = value;
      },
    );
    watch(
      () => props.value,
      (value) => {
        activeIndexValue.value = value;
      },
    );

    const openedNames = computed(() => props.expanded ? [...props.expanded] : []);

    return {
      styles,
      menuClass,
      innerClasses,
      openedNames,
      expandedArray,
    };
  },
  // methods: {
  //   updateActiveName() {
  //     if (this.currentActive === undefined) {
  //       this.currentActive = -1;
  //     }
  //     const active = this.currentActive;
  //     this.$emit('change', active);
  //     this.onChange && this.onChange(active);
  //     this.broadcast(`${prefix}-submenu`, 'change-active-name', false);
  //     this.broadcast(`${prefix}-menu-item`, 'change-active-name', active);
  //   },
  //   changeCollapsed(collapsed) {
  //     this.currentMode = collapsed ? 'popup' : 'normal';
  //     this.broadcast(`${prefix}-submenu`, 'change-collapsed', collapsed);
  //   },
  //   updateOpenKeys(name) {
  //     const names = [...this.openedNames];
  //     const index = names.indexOf(name);
  //     const submenuName = `${prefix}-submenu`;
  //     if (this.expandMutex) {
  //       findComponentsDownward(this, submenuName).forEach((item) => {
  //         const temp = item;
  //         temp.isOpen = false;
  //       });
  //     }
  //     if (index >= 0) {
  //       let currentSubmenu = null;
  //       findComponentsDownward(this, submenuName).forEach((item) => {
  //         const temp = item;
  //         if (item.value === name) {
  //           currentSubmenu = item;
  //           temp.isOpen = false;
  //         }
  //       });
  //       findComponentsUpward(currentSubmenu, submenuName).forEach((item) => {
  //         const temp = item;
  //         temp.isOpen = true;
  //       });
  //       findComponentsDownward(currentSubmenu, submenuName).forEach((item) => {
  //         const temp = item;
  //         temp.isOpen = false;
  //       });
  //     } else {
  //       if (this.expandMutex) {
  //         let currentSubmenu = null;
  //         findComponentsDownward(this, submenuName).forEach((item) => {
  //           const temp = item;
  //           if (item.value === name) {
  //             currentSubmenu = item;
  //             temp.isOpen = true;
  //           }
  //         });
  //         findComponentsUpward(currentSubmenu, submenuName).forEach((item) => {
  //           const temp = item;
  //           temp.isOpen = true;
  //         });
  //       } else {
  //         findComponentsDownward(this, submenuName).forEach((item) => {
  //           if (item.value === name) {
  //             const temp = item;
  //             temp.isOpen = true;
  //           }
  //         });
  //       }
  //     }
  //     const openedNames = findComponentsDownward(this, submenuName).filter(item => item.isOpen)
  //       .map(item => item.value);
  //     this.openedNames = [...openedNames];
  //     this.$emit('expand', openedNames);
  //     this.onExpand && this.onExpand(openedNames);
  //   },
  //   updateOpened() {
  //     const submenuName = `${prefix}-submenu`;
  //     const items = findComponentsDownward(this, submenuName);

  //     if (items.length) {
  //       items.forEach((item) => {
  //         const temp = item;
  //         temp.isOpen = this.openedNames.indexOf(item.value) !== -1;
  //       });
  //     }
  //   },
  // },
  render() {
    return (
      <div class={this.menuClass} style={this.styles}>
        <div class="t-default-menu__inner">
          {
            this.$slots.logo && (<div class="t-menu__logo">{this.$slots.logo}</div>)
          }
          <ul class={this.innerClasses}>
            {this.$slots.default}
          </ul>
          {
            this.$slots.options && (<div class="t-menu__options">{this.$slots.options}</div>)
          }
        </div>
      </div>
    );
  },
});
