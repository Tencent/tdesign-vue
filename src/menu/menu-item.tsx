import { defineComponent, computed, inject, onMounted } from '@vue/composition-api';
import { prefix } from '../config';
import props from '@TdTypes/menu-item/props';
import { TdMenuInterface, TdSubMenuInterface } from './const';
const name = `${prefix}-menu-item`;

export default defineComponent({
  name,
  props: { ...props },
  setup(props, ctx) {
    const menu = inject<TdMenuInterface>('TdMenu');
    const submenu = inject<TdSubMenuInterface>('TdSubmenu', null);
    const active = computed(() => menu.activeIndexValue.value === props.value);
    const classes = computed(() => [
      `${prefix}-menu__item`,
      {
        [`${prefix}-is-active`]: active.value,
        [`${prefix}-is-disabled`]: props.disabled,
        [`${prefix}-menu__item--plain`]: !ctx.slots.icon,
        [`${prefix}-submenu__item`]: !!submenu && !menu.isHead,
        [`${prefix}-submenu__item--icon`]: submenu && submenu.hasIcon,
      },
    ]);
    // methods
    const handleClick = () => {
      if (props.disabled) return;
      menu.select(props.value);

      if (props.href) {
        window.open(props.href, props.target);
      } else if (props.to) {
        const router = props.router || (ctx.root as Record<string, any>).$router;
        const methods: string = props.replace ? 'replace' : 'push';
        router[methods](props.to);
      }
    };

    // lifetimes
    onMounted(() => {
      if (submenu) {
        submenu.addMenuItem({
          value: props.value,
          label: ctx.slots.default(),
        });
      }
    });

    return {
      menu,
      active,
      classes,
      handleClick,
    };
  },
  render() {
    return (
      <li class={this.classes} onClick={this.handleClick}>
        {this.$slots.icon}
        <span class={[`${prefix}-menu__content`]}>{this.$slots.default}</span>
      </li>
    );
  },
});

