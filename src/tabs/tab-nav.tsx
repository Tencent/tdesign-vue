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
import BaseTab from './baseTab';

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
      baseEntity: null,
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
        this.baseEntity.adjustArrowDisplay();
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
        this.baseEntity.adjustScrollbar();
      });
    },
  },
  methods: {
    calculateNavBarStyle() {
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
      const onResize = debounce(() => {
        this.baseEntity.adjustScrollbar();
        this.baseEntity.adjustArrowDisplay();
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
      this.baseEntity.scrollToLeft();
    },

    handleScrollToRight() {
      this.baseEntity.scrollToRight();
    },

    moveActiveTabIntoView({ needCheckUpdate } = { needCheckUpdate: true }) {
      const { baseEntity } = this;
      if (['left', 'right'].includes(this.placement)) {
        return false;
      }
      const activeTabEl: HTMLElement = getActiveTabEl(this.navs, this.value);
      if (!activeTabEl) {
        // 如果没有当前 value 对应的tab，一种情况是真没有；一种情况是在修改value的同时，新增了一个值为该value的tab。后者因为navs的更新在$nextTick之后，所以得等下一个updated才能拿到新的tab
        if (needCheckUpdate) {
          this.$once('hook:updated', () => {
            this.moveActiveTabIntoView({ needCheckUpdate: false });
          });
        }
        return false;
      }
      return baseEntity.shouldMoveToLeftSide(activeTabEl) || baseEntity.shouldMoveToRightSide(activeTabEl);
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
        <div ref="leftOperationsZone" class={[`${prefix}-tabs__operations`, `${prefix}-tabs__operations--left`]}>
          <transition name="fade" mode="out-in" appear>
            {this.canToLeft ? (
              <div ref="leftIcon" class={this.leftIconClass} onClick={this.handleScrollToLeft}>
                <ChevronLeftIcon />
              </div>
            ) : null}
          </transition>
        </div>,
        <div ref="rightOperationsZone" class={[`${prefix}-tabs__operations`, `${prefix}-tabs__operations--right`]}>
          <transition name="fade" mode="out-in" appear>
            {this.canToRight ? (
              <div ref="rightIcon" class={this.rightIconClass} onClick={this.handleScrollToRight}>
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
    this.baseEntity = new BaseTab({
      getState: (prop: string) => this[prop],
      getElement: (refName: string) => this.$refs[refName] as HTMLElement,
      setState: (key: string, value: any) => (this[key] = value),
    });
    this.$nextTick(() => {
      this.watchDomChange();
      this.calculateNavBarStyle();
      this.baseEntity.adjustArrowDisplay();
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
