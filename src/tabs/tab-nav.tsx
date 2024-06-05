import debounce from 'lodash/debounce';
import {
  ChevronLeftIcon as TdChevronLeftIcon,
  ChevronRightIcon as TdChevronRightIcon,
  AddIcon as TdAddIcon,
} from 'tdesign-icons-vue';
import type { ComponentPublicInstance } from 'vue';
import TTabPanel from './tab-panel';
import TTabNavItem from './tab-nav-item';
import { emitEvent } from '../utils/event';
import { firstUpperCase } from '../utils/helper';
import tabProps from './props';
import { renderTNodeJSX } from '../utils/render-tnode';
import { getClassPrefixMixins, getGlobalIconMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';
import { Styles } from '../common';
import {
  calcMaxOffset, calcValidOffset, calculateOffset, calcPrevOrNextOffset,
} from '../_common/js/tabs/base';

import type { TdTabsProps } from './type';

const classPrefixMixins = getClassPrefixMixins('tab__nav');

export default mixins(classPrefixMixins, getGlobalIconMixins()).extend({
  name: 'TTabNav',
  components: {
    TTabNavItem,
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
      maxScrollLeft: 0,
      navBarStyle: {},
    };
  },
  computed: {
    navs(): Array<Record<string, any>> {
      return this.panels.map((panel, index) => ({
        ref: `tabItem${index}`,
        key: panel.value,
        theme: this.theme,
        size: this.size,
        placement: this.placement,
        active: panel.value === this.value,
        disabled: this.disabled || panel.disabled,
        removable: panel.removable,
        value: panel.value,
        panel,
      }));
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
    iconBaseClass(): { [key: string]: boolean } {
      return {
        [`${this.classPrefix}-tabs__btn`]: true,
        [`${this.classPrefix}-size-m`]: this.size === 'medium',
        [`${this.classPrefix}-size-l`]: this.size === 'large',
      };
    },
    leftIconClass(): { [key: string]: boolean } {
      return {
        [`${this.classPrefix}-tabs__btn--left`]: true,
        ...this.iconBaseClass,
      };
    },
    rightIconClass(): { [key: string]: boolean } {
      return {
        [`${this.classPrefix}-tabs__btn--right`]: true,
        ...this.iconBaseClass,
      };
    },
    addIconClass(): { [key: string]: boolean } {
      return {
        [`${this.classPrefix}-tabs__add-btn`]: true,
        ...this.iconBaseClass,
      };
    },
    navContainerClass(): { [key: string]: boolean } {
      return {
        [`${this.classPrefix}-tabs__nav-container`]: true,
        [`${this.classPrefix}-tabs__nav--card`]: this.theme === 'card',
        [`${this.classPrefix}-is-${this.placement}`]: true,
        [`${this.classPrefix}-is-addable`]: this.theme === 'card' && this.addable,
      };
    },
    navScrollContainerClass(): { [key: string]: boolean } {
      return {
        [`${this.classPrefix}-tabs__nav-scroll`]: true,
        [`${this.classPrefix}-is-scrollable`]: this.canToLeft || this.canToRight,
      };
    },
    navsWrapClass(): Array<string | { [key: string]: boolean }> {
      return [
        `${this.classPrefix}-tabs__nav-wrap`,
        `${this.classPrefix}-is-smooth`,
        { [`${this.classPrefix}-is-vertical`]: this.placement === 'left' || this.placement === 'right' },
      ];
    },
    navBarClass(): Array<string> {
      return [`${this.classPrefix}-tabs__bar`, `${this.classPrefix}-is-${this.placement}`];
    },
    navsContainerStyle(): Styles {
      return this.addable ? { 'min-height': '48px' } : null;
    },
    activeElement(): HTMLElement {
      const activeIndx = this.navs.findIndex((nav) => nav.active);
      if (activeIndx > -1) {
        // @ts-ignore
        return (this.$refs[`tabItem${activeIndx}`] as unknown as ComponentPublicInstance)?.$el;
      }
      return null;
    },
    canToLeft(): boolean {
      return this.scrollLeft > 1;
    },
    canToRight(): boolean {
      return this.scrollLeft < this.maxScrollLeft - 1;
    },
  },
  watch: {
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
        this.getMaxScrollLeft();
        this.moveActiveTabIntoView();
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
        const { activeElement } = this;
        if (!activeElement) return {};

        const [sizePropName, offsetPropName] = getPropName();
        let i = 0;
        for (; i < this.navs.length; i++) {
          if (this.navs[i].active) {
            break;
          }
          offset
            += (this.$refs[`tabItem${i}`] as unknown as ComponentPublicInstance)?.$el?.[
              `client${firstUpperCase(sizePropName)}`
            ] || 0;
        }

        return {
          [offsetPropName]: `${offset}px`,
          [sizePropName]: `${activeElement?.[`client${firstUpperCase(sizePropName)}`] || 0}px`,
        };
      };
      this.navBarStyle = getNavBarStyle();
    },

    watchDomChange() {
      const onResize = debounce(() => {
        this.getMaxScrollLeft();
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

    setOffset(offset: number) {
      this.scrollLeft = calcValidOffset(offset, this.maxScrollLeft);
    },

    getMaxScrollLeft() {
      this.maxScrollLeft = calcMaxOffset({
        navsWrap: this.$refs.navsWrap as HTMLElement,
        navsContainer: this.$refs.navsContainer as HTMLElement,
        rightOperations: this.$refs.rightOperationsZone as HTMLElement,
        toRightBtn: this.$refs.rightIcon as HTMLElement,
      });
    },

    handleScroll(action: 'next' | 'prev') {
      const offset = calcPrevOrNextOffset(
        {
          navsContainer: this.$refs.navsContainer as HTMLElement,
          activeTab: this.activeElement,
        },
        this.scrollLeft,
        action,
      );

      this.setOffset(offset);
    },

    handleWheel(e: WheelEvent) {
      if (!this.canToLeft && !this.canToRight) return;

      e.preventDefault();
      const { deltaX, deltaY } = e;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        this.setOffset(this.scrollLeft + deltaX);
      } else {
        this.setOffset(this.scrollLeft + deltaY);
      }
    },

    moveActiveTabIntoView() {
      if (['left', 'right'].includes(this.placement.toLowerCase())) return;

      this.setOffset(
        calculateOffset(
          {
            activeTab: this.activeElement,
            navsContainer: this.$refs.navsContainer as HTMLElement,
            leftOperations: this.$refs.leftOperationsZone as HTMLElement,
            rightOperations: this.$refs.rightOperationsZone as HTMLElement,
          },
          this.scrollLeft,
          'auto',
        ),
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
    renderPanelContent() {
      return this.navs.map((panel, index) => (
        <TTabNavItem
          ref={`tabItem${index}`}
          index={index}
          key={panel.value}
          theme={panel.theme}
          size={panel.size}
          placement={panel.placement}
          active={panel.active}
          disabled={panel.disabled}
          removable={panel.removable}
          value={panel.value}
          label={renderTNodeJSX(panel.panel, 'label', `选项卡${index + 1}`)}
          onClick={(e: MouseEvent) => this.tabClick(e, panel.panel)}
          onRemove={this.removeBtnClick}
        ></TTabNavItem>
      ));
    },
    renderArrows() {
      const { ChevronLeftIcon, ChevronRightIcon, AddIcon } = this.useGlobalIcon({
        ChevronLeftIcon: TdChevronLeftIcon,
        ChevronRightIcon: TdChevronRightIcon,
        AddIcon: TdAddIcon,
      });
      return [
        <div
          ref="leftOperationsZone"
          class={[`${this.classPrefix}-tabs__operations`, `${this.classPrefix}-tabs__operations--left`]}
        >
          <transition name="fade" mode="out-in" appear>
            {this.canToLeft ? (
              <div ref="leftIcon" class={this.leftIconClass} onClick={() => this.handleScroll('prev')}>
                <ChevronLeftIcon />
              </div>
            ) : null}
          </transition>
        </div>,
        <div
          ref="rightOperationsZone"
          class={[`${this.classPrefix}-tabs__operations`, `${this.classPrefix}-tabs__operations--right`]}
        >
          <transition name="fade" mode="out-in" appear>
            {this.canToRight ? (
              <div ref="rightIcon" class={this.rightIconClass} onClick={() => this.handleScroll('next')}>
                <ChevronRightIcon />
              </div>
            ) : null}
          </transition>
          {this.addable ? (
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
          <div class={this.navScrollContainerClass} onWheel={this.handleWheel}>
            <div ref="navsWrap" class={this.navsWrapClass} style={this.wrapTransformStyle}>
              {this.renderNavBar()}
              {this.renderPanelContent()}
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
      this.getMaxScrollLeft();
    });
    setTimeout(() => {
      this.moveActiveTabIntoView();
    });
  },
  render() {
    return (
      <div ref="navsContainer" class={[`${this.classPrefix}-tabs__nav`]} style={this.navsContainerStyle}>
        {this.renderArrows()}
        {this.renderNavs()}
      </div>
    );
  },
});
