import Vue, {
  VNode, VueConstructor,
} from 'vue';
import debounce from 'lodash/debounce';
import {
  ChevronLeftIcon as TIconChevronLeft,
  ChevronRightIcon as TIconChevronRight,
  CloseIcon as TIconClose,
  AddIcon as TIconAdd,
} from '@tencent/tdesign-icons-vue';
import { prefix } from '../config';
import TTabPanel from './tab-panel';
import TTabNavItem from './tab-nav-item';
import { emitEvent } from '../utils/event';
import { firstUpperCase } from '../utils/helper';
import { TdTabsProps } from './type';
import tabProps from './props';
import { renderTNodeJSX } from '../utils/render-tnode';

interface TabNavVue extends Vue {
  resizeObserver: any;
}

export default (Vue as VueConstructor<TabNavVue>).extend({
  name: 'TTabNav',
  components: {
    TTabNavItem,
    TIconChevronLeft,
    TIconChevronRight,
    TIconClose,
    TIconAdd,
  },
  ...({ resizeObserver: null }),
  props: {
    theme: tabProps.theme,
    panels: {
      type: Array as { new(): Array<InstanceType<typeof TTabPanel>> },
      default: (): Array<InstanceType<typeof TTabPanel>> => [] as Array<InstanceType<typeof TTabPanel>>,
    },
    value: tabProps.value,
    placement: tabProps.placement,
    size: tabProps.size,
    disabled: tabProps.disabled,
    addable: tabProps.addable,
  },
  data() {
    return {
      scrollLeft: 0,
      canToLeft: false,
      canToRight: false,
      navBarStyle: {},
    };
  },
  computed: {
    navs(): Array<VNode> {
      return this.panels.map((panel, index) => (
        <TTabNavItem
          ref={`tabItem${index}`}
          key={panel.value}
          index={index}
          theme={this.theme}
          size={this.size}
          placement={this.placement}
          label={renderTNodeJSX(panel, 'label', `选项卡${index + 1}`)}
          active={panel.value === this.value}
          disabled={this.disabled || panel.disabled}
          removable={panel.removable}
          value={panel.value}
          onClick={(e: MouseEvent) => this.tabClick(e, panel)}
          onRemove={this.removeBtnClick}
        ></TTabNavItem>
      ) as VNode);
    },
    wrapTransformStyle(): { [key: string]: string } {
      if (['left', 'right'].includes(this.placement.toLowerCase())) return {};
      return {
        transform: `translate3d(${-this.scrollLeft}px, 0, 0)`,
      };
    },
    dataCanUpdateNavBarStyle(): Array<any> {
      return [this.scrollLeft, this.placement, this.theme, this.navs, this.value];
    },
    dataCanUpdateArrow(): Array<any> {
      return [this.scrollLeft, this.placement];
    },
    iconBaseClass(): { [key: string]: boolean } {
      return {
        [`${prefix}-tabs__btn`]: true,
        [`${prefix}-size-m`]: this.size === 'medium',
        [`${prefix}-size-l`]: this.size === 'large',
      };
    },
    leftIconClass(): { [key: string]: boolean } {
      return {
        [`${prefix}-tabs__btn--left`]: true,
        ...this.iconBaseClass,
      };
    },
    rightIconClass(): { [key: string]: boolean } {
      return {
        [`${prefix}-tabs__btn--right`]: true,
        ...this.iconBaseClass,
      };
    },
    addIconClass(): { [key: string]: boolean } {
      return {
        [`${prefix}-tabs__add-btn`]: true,
        ...this.iconBaseClass,
      };
    },
    navContainerClass(): { [key: string]: boolean } {
      return {
        [`${prefix}-tabs__nav-container`]: true,
        [`${prefix}-tabs__nav--card`]: this.theme === 'card',
        [`${prefix}-is-${this.placement}`]: true,
        [`${prefix}-is-addable`]: this.theme === 'card' && this.addable,
      };
    },
    navScrollContainerClass(): { [key: string]: boolean } {
      return {
        [`${prefix}-tabs__nav-scroll`]: true,
        [`${prefix}-is-scrollable`]: this.canToLeft || this.canToRight,
      };
    },
    navsWrapClass(): Array<string | { [key: string]: boolean }> {
      return [`${prefix}-tabs__nav-wrap`, `${prefix}-is-smooth`, { [`${prefix}-is-vertical`]: this.placement === 'left' || this.placement === 'right' }];
    },
    navBarClass(): Array<string> {
      return [`${prefix}-tabs__bar`, `${prefix}-is-${this.placement}`];
    },
  },
  watch: {
    dataCanUpdateArrow() {
      this.caculateCanShowArrow();
    },
    dataCanUpdateNavBarStyle() {
      this.$nextTick(() => {
        this.caculateNavBarStyle();
      });
    },
  },
  methods: {
    caculateCanShowArrow() {
      this.caculateCanToLeft();
      this.caculateCanToRight();
    },
    caculateCanToLeft() {
      if (['left', 'right'].includes(this.placement.toLowerCase())) {
        this.canToLeft = false;
      }
      const container = this.$refs.navsContainer as Element;
      const wrap = this.$refs.navsWrap as Element;
      if (!wrap || !container) {
        this.canToLeft = false;
      }
      this.canToLeft = wrap.scrollWidth > container.clientWidth && this.scrollLeft > 0;
    },
    caculateCanToRight() {
      if (['left', 'right'].includes(this.placement.toLowerCase())) {
        this.canToRight = false;
      }
      const container = this.$refs.navsContainer as Element;
      const wrap = this.$refs.navsWrap as Element;
      if (!wrap || !container) {
        this.canToRight = false;
      }
      this.canToRight = wrap.scrollWidth > container.clientWidth && this.scrollLeft + container.clientWidth < wrap.scrollWidth;
    },
    caculateNavBarStyle() {
      const getNavBarStyle = () => {
        if (this.theme === 'card') return {};
        const getPropName = () => {
          if (['left', 'right'].includes(this.placement.toLowerCase())) {
            return ['height', 'top'];
          }
          return ['width', 'left'];
        };
        let offset = 0;
        const [sizePropName, offsetPropName] = getPropName();
        let i = 0;
        for (; i < this.navs.length; i++) {
          if ((this.navs[i].componentInstance as InstanceType<typeof TTabPanel>)?.value === this.value) {
            break;
          }
          offset += this.navs[i].componentInstance?.$el?.[`client${firstUpperCase(sizePropName)}`] || 0;
        }
        if (!this.navs[i]) return {};
        return {
          [offsetPropName]: `${offset}px`,
          [sizePropName]: `${this.navs[i].componentInstance?.$el?.[`client${firstUpperCase(sizePropName)}`] || 0}px`,
        };
      };
      this.navBarStyle = getNavBarStyle();
    },
    watchDomChange() {
      if (!this.$refs.navsContainer) return;
      if (!(window as Window & { ResizeObserver?: any }).ResizeObserver) return;
      this.resizeObserver = new (window as Window & { ResizeObserver?: any }).ResizeObserver(() => {
        this.resetScrollPosition();
      });
      this.resizeObserver.observe(this.$refs.navsContainer);
    },
    cancelWatchDomChange() {
      if (!this.resizeObserver) return;
      this.resizeObserver.disconnect();
    },
    resetScrollPosition: debounce(function (this: any) {
      this.caculateCanShowArrow();
    }, 300),
    handleScrollToLeft() {
      const container = this.$refs.navsContainer as Element;
      this.scrollLeft = Math.max(0, this.scrollLeft - container.clientWidth);
    },
    handleScrollToRight() {
      const container = this.$refs.navsContainer as Element;
      const wrap = this.$refs.navsWrap as Element;
      this.scrollLeft = Math.min(this.scrollLeft + container.clientWidth, wrap.scrollWidth - container.clientWidth);
    },
    handleAddTab(e: MouseEvent) {
      emitEvent<Parameters<TdTabsProps['onAdd']>>(this, 'add', { e });
    },
    tabClick(event: MouseEvent, nav: Partial<InstanceType<typeof TTabPanel>>) {
      const { value, disabled } = nav;
      if (disabled || this.value === value) {
        return false;
      }
      emitEvent<Parameters<TdTabsProps['onChange']>>(this, 'change', value);
    },
    removeBtnClick({ e, value, index }: Parameters<TdTabsProps['onRemove']>[0]) {
      emitEvent<Parameters<TdTabsProps['onRemove']>>(this, 'remove', { e, value, index });
    },
    renderArrows() {
      return ([
        <div class={[`${prefix}-tabs__operations`, `${prefix}-tabs__operations--left`]}>
          <transition name="fade" mode="out-in" appear>
            {
              this.canToLeft
                ? <div
                  class={this.leftIconClass}
                  onClick={this.handleScrollToLeft}
                >
                  <TIconChevronLeft />
                </div>
                : null
            }
          </transition>
        </div>,
        <div class={[`${prefix}-tabs__operations`, `${prefix}-tabs__operations--right`]}>
          <transition name="fade" mode="out-in" appear>
            {
              this.canToRight
                ? <div
                  class={this.rightIconClass}
                  onClick={this.handleScrollToRight}
                >
                  <TIconChevronRight></TIconChevronRight>
                </div>
                : null
            }
          </transition>
          {
            this.theme === 'card' && this.addable
              ? <div
                class={this.addIconClass}
                onClick={this.handleAddTab}
              >
                <TIconAdd></TIconAdd>
              </div>
              : null
          }
        </div>,
      ]);
    },
    renderNavs() {
      return (
        <div
          class={this.navContainerClass}
        >
          <div
            class={this.navScrollContainerClass}
          >
            <div
              ref="navsWrap"
              class={this.navsWrapClass}
              style={this.wrapTransformStyle}>
              {this.renderNavBar()}
              {this.navs}
            </div>
          </div>
        </div>
      );
    },
    renderNavBar() {
      if (this.theme === 'card') return null;
      return (
        <div class={this.navBarClass} style={this.navBarStyle}></div>
      );
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.watchDomChange();
      this.caculateNavBarStyle();
      this.caculateCanShowArrow();
    });
  },
  beforeDestroy() {
    this.cancelWatchDomChange();
  },
  render() {
    return (
      <div ref="navsContainer" class={[`${prefix}-tabs__nav`]}>
        {this.renderArrows()}
        {this.renderNavs()}
      </div>
    );
  },
});
