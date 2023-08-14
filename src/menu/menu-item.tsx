/* eslint-disable no-nested-ternary */
import {
  defineComponent, computed, inject, onMounted,
} from '@vue/composition-api';
import props from './menu-item-props';
import { TdMenuInterface, TdSubMenuInterface } from './const';
import ripple from '../utils/ripple';
import { renderContent, renderTNodeJSX } from '../utils/render-tnode';
import { getKeepAnimationMixins } from '../config-provider/config-receiver';
import { AnimationType } from '../config-provider/type';
import { usePrefixClass } from '../hooks/useConfig';
import Tooltip from '../tooltip';

const keepAnimationMixins = getKeepAnimationMixins();

export default defineComponent({
  name: 'TMenuItem',
  mixins: [keepAnimationMixins],
  props: { ...props },
  directives: { ripple },
  setup(props, ctx) {
    const menu = inject<TdMenuInterface>('TdMenu');
    const submenu = inject<TdSubMenuInterface>('TdSubmenu', null);
    const active = computed(() => menu.activeValue.value === props.value);
    const collapsed = computed(() => menu.collapsed?.value);
    const classPrefix = usePrefixClass();

    const classes = computed(() => [
      `${classPrefix.value}-menu__item`,
      {
        [`${classPrefix.value}-is-active`]: active.value,
        [`${classPrefix.value}-is-disabled`]: props.disabled,
        [`${classPrefix.value}-menu__item--plain`]: !ctx.slots.icon && !props.icon,
        [`${classPrefix.value}-submenu__item`]: !!submenu && !menu.isHead,
      },
    ]);
    // methods
    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      if (props.disabled) return;
      menu.select(props.value);
      ctx.emit('click', { e, value: props.value });
      props.onClick?.({ e, value: props.value });

      if (props.to || (props.routerLink && props.href)) {
        const router = props.router || (ctx.root as Record<string, any>).$router;
        const methods: string = props.replace ? 'replace' : 'push';
        router[methods](props.to || props.href).catch((err: Error) => {
          // vue-router 3.1.0+ push/replace cause NavigationDuplicated error
          // https://github.com/vuejs/vue-router/issues/2872
          // 当前path和目标path相同时，会抛出NavigationDuplicated的错误
          if (
            err.name !== 'NavigationDuplicated'
            && !err.message.includes('Avoided redundant navigation to current location')
          ) {
            throw err;
          }
        });
      }
    };

    // lifetimes
    onMounted(() => {
      menu?.vMenu?.add({
        value: props.value,
        parent: submenu?.value,
        vnode: ctx.slots.default && ctx.slots.default(),
      });
    });

    return {
      menu,
      active,
      collapsed,
      classes,
      handleClick,
      classPrefix,
    };
  },
  render() {
    const router = this.router || this.$router;

    const liContent = (
      <li
        v-ripple={(this.keepAnimation as Record<AnimationType, boolean>).ripple}
        class={this.classes}
        onClick={this.handleClick}
      >
        {renderTNodeJSX(this, 'icon')}
        {this.routerLink ? (
          <a
            href={this.href ? this.href : this.to ? (router as any)?.resolve(this.to).href : ''}
            target={this.target}
            class={`${this.classPrefix}-menu__item-link`}
            onClick={(e: MouseEvent) => e.preventDefault()}
          >
            <span class={`${this.classPrefix}-menu__content`}>{renderContent(this, 'default', 'content')}</span>
          </a>
        ) : this.href ? (
          <a
            href={this.href}
            target={this.target}
            class={`${this.classPrefix}-menu__item-link`}
            onClick={(e: MouseEvent) => this.disabled && e.preventDefault()}
          >
            <span class={`${this.classPrefix}-menu__content`}>{renderContent(this, 'default', 'content')}</span>
          </a>
        ) : (
          <span class={`${this.classPrefix}-menu__content`}>{renderContent(this, 'default', 'content')}</span>
        )}
      </li>
    );

    // 菜单收起，且只有本身为一级菜单才需要显示 tooltip
    if (this.collapsed && /tmenu/i.test(this.$parent.$vnode?.tag)) {
      return (
        <Tooltip content={() => renderContent(this, 'default', 'content')} placement="right">
          {liContent}
        </Tooltip>
      );
    }
    return liContent;
  },
});
