import Vue, { VNode } from 'vue';
import debounce from 'lodash/debounce';
import { ChevronLeftIcon, ChevronRightIcon, AddIcon } from 'tdesign-icons-vue';
import { prefix } from '../config';
import TTabPanel from './tab-panel';
import TTabNavItem from './tab-nav-item';
import { emitEvent } from '../utils/event';
import { firstUpperCase } from '../utils/helper';
import { TdTabsProps, TdTabPanelProps } from './type';
import tabProps from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { TabPanelProps } from '.';
import tabBase from '../_common/js/tabs/base';

const {
  calculateCanToLeft, calculateCanToRight, calcScrollLeft, scrollToLeft, scrollToRight, moveActiveTabIntoView,
} = tabBase;

const getActiveTabEl = (navs: Array<VNode>, value: TabPanelProps['value']): HTMLElement => {
  for (let i = 0; i < navs.length; i++) {
    if ((navs[i].componentOptions.propsData as TdTabPanelProps).value === value) {
      return navs[i].componentInstance?.$el as HTMLElement;
    }
  }
  return null;
};

export default Vue.extend({
  name: 'TTabNav',
  components: {
    TTabNavItem,
    ChevronLeftIcon,
    ChevronRightIcon,
    AddIcon,
  },
  props: {
    theme: tabProps.theme,
    panels: {
      type: Array as { new (): Array<InstanceType<typeof TTabPanel>> },
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
      ));
    },
    wrapTransformStyle(): { [key: string]: string } {
      if (['left', 'right'].includes(this.placement.toLowerCase())) return {};
      return {
        transform: `translate(${-this.scrollLeft}px, 0)`,
      };
    },
    dataCanUpdateNavBarStyle(): Array<any> {
      return [this.scrollLeft, this.placement, this.theme, this.navs, this.value];
    },
    dataCanUpdateArrow(): Array<any> {
      return [this.scrollLeft, this.placement, this.navs];
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
      return [
        `${prefix}-tabs__nav-wrap`,
        `${prefix}-is-smooth`,
        { [`${prefix}-is-vertical`]: this.placement === 'left' || this.placement === 'right' },
      ];
    },
    navBarClass(): Array<string> {
      return [`${prefix}-tabs__bar`, `${prefix}-is-${this.placement}`];
    },
    navsContainerStyle(): object {
      return this.addable ? { 'min-height': '48px' } : null;
    },
  },
  watch: {
    dataCanUpdateArrow() {
      this.$nextTick(() => {
        this.adjustArrowDisplay();
      });
    },
    dataCanUpdateNavBarStyle() {
      this.$nextTick(() => {
        this.calculateNavBarStyle();
      });
    },
    value() {
      this.$nextTick(() => {
        this.moveActiveTabIntoView();
      });
    },
    navs() {
      this.$nextTick(() => {
        this.adjustScrollbar();
      });
    },
  },
  methods: {
    getRefs(
      refs: string[] = ['navsContainer', 'navsWrap', 'leftOperations', 'toLeftBtn', 'rightOperations', 'toRightBtn'],
    ) {
      return refs.reduce((ans, key): Record<string, HTMLElement> => {
        // eslint-disable-next-line no-param-reassign
        ans[key] = this.$refs[key] as HTMLElement;
        return ans;
      }, {});
    },
    adjustArrowDisplay() {
      this.canToLeft = calculateCanToLeft(this.getRefs(), this.scrollLeft, this.placement);
      this.canToRight = calculateCanToRight(this.getRefs(), this.scrollLeft, this.placement);
    },
    adjustScrollbar() {
      this.scrollLeft = calcScrollLeft(
        {
          ...this.getRefs(),
        },
        this.scrollLeft,
      );
    },
    calculateNavBarStyle() {
      const getNavBarStyle = () => {
        if (this.theme === 'card') return {};

        const isVertical = ['left', 'right'].includes(this.placement.toLowerCase());
        const [sizePropName, offsetPropName] = isVertical ? ['height', 'top'] : ['width', 'left'];
        let offset = 0;
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
      const onResize = debounce(() => {
        this.adjustScrollbar();
        this.adjustArrowDisplay();
      }, 300);
      window.addEventListener('resize', onResize);
      this.$once('beforeDestroy', () => {
        window.removeEventListener('resize', onResize);
      });
      if (!this.$refs.navsContainer) return;
      if (!(window as Window & { ResizeObserver?: any }).ResizeObserver) return;
      const resizeObserver = new (window as Window & { ResizeObserver?: any }).ResizeObserver(onResize);
      resizeObserver.observe(this.$refs.navsContainer);
      this.$once('beforeDestroy', () => {
        resizeObserver.disconnect();
      });
    },

    handleScrollToLeft() {
      this.scrollLeft = scrollToLeft(this.getRefs(), this.scrollLeft);
    },

    handleScrollToRight() {
      this.scrollLeft = scrollToRight(this.getRefs(), this.scrollLeft);
    },

    moveActiveTabIntoView({ needCheckUpdate } = { needCheckUpdate: true }) {
      if (['left', 'right'].includes(this.placement)) {
        return false;
      }
      const activeTab: HTMLElement = getActiveTabEl(this.navs, this.value);
      if (!activeTab) {
        // 如果没有当前 value 对应的tab，一种情况是真没有；一种情况是在修改value的同时，新增了一个值为该value的tab。后者因为navs的更新在$nextTick之后，所以得等下一个updated才能拿到新的tab
        if (needCheckUpdate) {
          this.$once('hook:updated', () => {
            this.moveActiveTabIntoView({ needCheckUpdate: false });
          });
        }
        return false;
      }
      this.scrollLeft = moveActiveTabIntoView(
        {
          activeTab,
          ...this.getRefs(),
        },
        this.scrollLeft,
      );
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
      return [
        <div ref="leftOperations" class={[`${prefix}-tabs__operations`, `${prefix}-tabs__operations--left`]}>
          <transition name="fade" mode="out-in" appear>
            {this.canToLeft ? (
              <div ref="toLeftBtn" class={this.leftIconClass} onClick={this.handleScrollToLeft}>
                <ChevronLeftIcon />
              </div>
            ) : null}
          </transition>
        </div>,
        <div ref="rightOperations" class={[`${prefix}-tabs__operations`, `${prefix}-tabs__operations--right`]}>
          <transition name="fade" mode="out-in" appear>
            {this.canToRight ? (
              <div ref="toRightBtn" class={this.rightIconClass} onClick={this.handleScrollToRight}>
                <ChevronRightIcon />
              </div>
            ) : null}
          </transition>
          {this.theme === 'card' && this.addable ? (
            <div class={this.addIconClass} onClick={this.handleAddTab}>
              <AddIcon />
            </div>
          ) : null}
        </div>,
      ];
    },
    renderNavs() {
      return (
        <div class={this.navContainerClass}>
          <div class={this.navScrollContainerClass}>
            <div ref="navsWrap" class={this.navsWrapClass} style={this.wrapTransformStyle}>
              {this.renderNavBar()}
              {this.navs}
            </div>
          </div>
        </div>
      );
    },
    renderNavBar() {
      if (this.theme === 'card') return null;
      return <div class={this.navBarClass} style={this.navBarStyle}></div>;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.watchDomChange();
      this.calculateNavBarStyle();
      this.adjustArrowDisplay();
    });
  },
  render() {
    return (
      <div ref="navsContainer" class={[`${prefix}-tabs__nav`]} style={this.navsContainerStyle}>
        {this.renderArrows()}
        {this.renderNavs()}
      </div>
    );
  },
});
