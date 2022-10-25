import { VNode } from 'vue';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-vue';
import mixins from '../utils/mixins';
import { TdTabsProps } from './type';
import { emitEvent } from '../utils/event';
import ripple from '../utils/ripple';
import tabProps from './props';
import tabPanelProps from './tab-panel-props';
import { getKeepAnimationMixins, getClassPrefixMixins, getGlobalIconMixins } from '../config-provider/config-receiver';

const classPrefixMixins = getClassPrefixMixins('tab-nav__item');

const keepAnimationMixins = getKeepAnimationMixins();

export default mixins(keepAnimationMixins, classPrefixMixins, getGlobalIconMixins()).extend({
  name: 'TTabNavItem',

  directives: { ripple },

  props: {
    index: Number,
    active: {
      type: Boolean,
    },
    theme: tabProps.theme,
    size: tabProps.size,
    placement: tabProps.placement,
    label: {
      type: null,
    },
    disabled: tabPanelProps.disabled,
    removable: tabPanelProps.removable,
    value: tabPanelProps.value,
  },
  computed: {
    navItemClass(): {} {
      return {
        [`${this.classPrefix}-tabs__nav-item`]: true,
        [`${this.classPrefix}-tabs__nav--card`]: this.theme === 'card',
        [`${this.classPrefix}-is-disabled`]: this.disabled,
        [`${this.classPrefix}-is-active`]: this.active,
        [`${this.classPrefix}-is-left`]: this.placement === 'left',
        [`${this.classPrefix}-is-right`]: this.placement === 'right',
        [`${this.classPrefix}-size-m`]: this.size === 'medium',
        [`${this.classPrefix}-size-l`]: this.size === 'large',
      };
    },
  },
  methods: {
    removeBtnClick(e: MouseEvent): void {
      e.stopPropagation();
      emitEvent<Parameters<TdTabsProps['onRemove']>>(this, 'remove', { e, value: this.value, index: this.index });
    },
    onClickNav(e: MouseEvent) {
      if (this.disabled) return;
      e.stopPropagation();
      emitEvent<Parameters<(e: MouseEvent) => void>>(this, 'click', e);
    },
    renderCardItem(): VNode {
      const { CloseIcon } = this.useGlobalIcon({ CloseIcon: TdCloseIcon });

      return (
        <div class={this.navItemClass} onClick={this.onClickNav} v-ripple={this.keepAnimation.ripple}>
          <span class={`${this.classPrefix}-tabs__nav-item-text-wrapper`}>{this.label}</span>
          {this.removable && !this.disabled ? (
            <CloseIcon class="remove-btn" nativeOnClick={this.removeBtnClick} />
          ) : null}
        </div>
      );
    },
    renderNormalItem(): VNode {
      const { CloseIcon } = this.useGlobalIcon({ CloseIcon: TdCloseIcon });

      return (
        <div class={this.navItemClass} onClick={this.onClickNav}>
          <div
            class={[
              `${this.classPrefix}-tabs__nav-item-wrapper`,
              {
                [`${this.classPrefix}-is-disabled`]: this.disabled,
                [`${this.classPrefix}-is-active`]: this.active,
              },
            ]}
            v-ripple={this.keepAnimation.ripple}
          >
            <span class={`${this.classPrefix}-tabs__nav-item-text-wrapper`}>{this.label}</span>
          </div>
          {this.removable && !this.disabled ? (
            <CloseIcon class="remove-btn" nativeOnClick={this.removeBtnClick} />
          ) : null}
        </div>
      );
    },
  },
  render(): VNode {
    return this.theme === 'card' ? this.renderCardItem() : this.renderNormalItem();
  },
});
