import { defineComponent, computed, provide, ref, reactive, watch } from '@vue/composition-api';
import { prefix } from '../config';
import props from '@TdTypes/head-menu/props';
import { MenuValue } from '@TdTypes/menu/TdMenuProps';
import { TdMenuInterface, TdMenuItem } from './const';
import { Tabs, TabPanel } from '../tabs';
const name = `${prefix}-head-menu`;

export default defineComponent({
  name,
  props,
  components: { Tabs, TabPanel },
  setup(props, ctx) {
    const activeIndexValue = ref(props.defaultValue || props.value || '');
    const expandedArray = ref(props.defaultExpanded || props.expanded || []);
    const menuClass = computed(() => [
      't-menu',
      't-head-menu',
      `${prefix}-menu-mode__${props.expandType}`,
      `${prefix}-menu--${props.theme}`,
    ]);
    const openedNames = computed(() => props.expanded);
    const mode = ref(props.expandType);
    const submenu = reactive([]);

    provide<TdMenuInterface>('TdMenu', {
      mode,
      isHead: true,
      expandedArray,
      activeIndexValue,
      select: (val: MenuValue) => {
        activeIndexValue.value = val;
        if (typeof props.onChange === 'function') {
          props.onChange(val);
        }
        ctx.emit('change', val);
      },
      selectSubMenu: (menuItems: TdMenuItem[]) => {
        submenu.length = 0;
        submenu.push(...menuItems);
      },
      open: (val: MenuValue) => {
        const index = expandedArray.value.indexOf(val);
        expandedArray.value.splice(0, 1);
        if (index === -1) {
          expandedArray.value.push(val);
          return true;
        }
        return false;
      },
    });

    // methods
    const handleTabChange = (val: MenuValue) => {
      activeIndexValue.value = val;
    };

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

    return {
      mode,
      menuClass,
      openedNames,
      expandedArray,
      activeIndexValue,
      submenu,
      handleTabChange,
    };
  },
  methods: {
    // updateOpenKeys(name) {
    //   const names = [...this.openedNames];
    //   const index = names.indexOf(name);
    //   const submenuName = `${prefix}-submenu`;
    //   if (this.expandMutex) {
    //     findComponentsDownward(this, submenuName).forEach((item) => {
    //       const temp = item;
    //       temp.isOpen = false;
    //     });
    //   }
    //   if (index >= 0) {
    //     let currentSubmenu = null;
    //     findComponentsDownward(this, submenuName).forEach((item) => {
    //       const temp = item;
    //       if (item.value === name) {
    //         currentSubmenu = item;
    //         temp.isOpen = false;
    //       }
    //     });
    //     findComponentsUpward(currentSubmenu, submenuName).forEach((item) => {
    //       const temp = item;
    //       temp.isOpen = true;
    //     });
    //     findComponentsDownward(currentSubmenu, submenuName).forEach((item) => {
    //       const temp = item;
    //       temp.isOpen = false;
    //     });
    //   } else {
    //     if (this.expandMutex) {
    //       let currentSubmenu = null;
    //       findComponentsDownward(this, submenuName).forEach((item) => {
    //         const temp = item;
    //         if (temp.value === name) {
    //           currentSubmenu = item;
    //           temp.isOpen = true;
    //         }
    //       });
    //       findComponentsUpward(currentSubmenu, submenuName).forEach((item) => {
    //         const temp = item;
    //         temp.isOpen = true;
    //       });
    //     } else {
    //       findComponentsDownward(this, submenuName).forEach((item) => {
    //         const temp = item;
    //         if (item.value === name) temp.isOpen = true;
    //       });
    //     }
    //   }
    //   const openedNames = findComponentsDownward(this, submenuName).filter(item => item.isOpen)
    //     .map(item => item.value);
    //   this.openedNames = [...openedNames];
    //   this.$emit('expand', openedNames);
    //   this.onExpand && this.onExpand(openedNames);
    // },
    renderNormalSubmenu() {
      if (this.submenu.length === 0) return null;
      return (
        <ul class={[`${prefix}-head-menu__submenu`, `${prefix}-submenu`]}>
          {
            <t-tabs value={this.activeIndexValue} onChange={this.handleTabChange}>
              { this.submenu.map(item => (
                <t-tab-panel value={item.value} label={item.label[0].text} />
              ))}
            </t-tabs>
          }
        </ul>
      );
    },
  },
  render() {
    return (
      <div class={this.menuClass}>
        <div class="t-head-menu__inner">
          <div class="t-menu__logo">
            {this.$slots.logo}
          </div>
          <ul class="t-menu">
            {this.$slots.default}
          </ul>
          <div class="t-menu__options">
            {this.$slots.options}
          </div>
        </div>
        {this.mode === 'normal' && this.renderNormalSubmenu()}
      </div>
    );
  },
});
