import { VNode } from 'vue';
import { CloseIcon } from 'tdesign-icons-vue';
import mixins from '../utils/mixins';
import { prefix } from '../config';
import { TdTabsProps } from './type';
import { emitEvent } from '../utils/event';
import ripple from '../utils/ripple';
import tabProps from './props';
import tabPanelProps from './tab-panel-props';
import { getKeepAnimationMixins } from '../config-provider/config-receiver';

const keepAnimationMixins = getKeepAnimationMixins();

export default mixins(keepAnimationMixins).extend({
  name: 'TTabNavItem',
  components: {
    CloseIcon,
  },

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
        [`${prefix}-tabs__nav-item`]: true,
        [`${prefix}-tabs__nav--card`]: this.theme === 'card',
        [`${prefix}-is-disabled`]: this.disabled,
        [`${prefix}-is-active`]: this.active,
        [`${prefix}-is-left`]: this.placement === 'left',
        [`${prefix}-is-right`]: this.placement === 'right',
        [`${prefix}-size-m`]: this.size === 'medium',
        [`${prefix}-size-l`]: this.size === 'large',
      };
    },
  },
  methods: {
    removeBtnClick(e: MouseEvent): void {
      e.stopPropagation();
      emitEvent<Parameters<TdTabsProps['onRemove']>>(this, 'remove', { e, value: this.value, index: this.index });
    },
    onClickNav({ e }: { e: MouseEvent }) {
      if (this.disabled) return;
      emitEvent<Parameters<(e: MouseEvent) => void>>(this, 'click', e);
    },
    renderCardItem(): VNode {
      return (
        <div class={this.navItemClass} onClick={this.onClickNav} v-ripple={this.keepAnimation.ripple}>
          <span class={`${prefix}-tabs__nav-item-text-wrapper`}>{this.label}</span>
          {this.removable && !this.disabled ? (
            <CloseIcon class="remove-btn" nativeOnClick={this.removeBtnClick} />
          ) : null}
        </div>
      );
    },
    renderNormalItem(): VNode {
      return (
        <div class={this.navItemClass} onClick={this.onClickNav}>
          <div
            class={[
              `${prefix}-tabs__nav-item-wrapper`,
              {
                [`${prefix}-is-disabled`]: this.disabled,
                [`${prefix}-is-active`]: this.active,
              },
            ]}
            v-ripple={this.keepAnimation.ripple}
          >
            <span class={`${prefix}-tabs__nav-item-text-wrapper`}>{this.label}</span>
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
