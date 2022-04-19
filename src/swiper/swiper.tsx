import Vue, { VNode, VueConstructor, VNodeComponentOptions } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from 'tdesign-icons-vue';
import kebabCase from 'lodash/kebabCase';
import props from './props';
import { prefix } from '../config';
import { TdSwiperProps, SwiperNavigation, SwiperChangeSource } from './type';
import TSwiperItem from './swiper-item';
import { isVNode } from '../hooks/render-tnode';
import { emitEvent } from '../utils/event';

export interface SwiperVue extends Vue {
  swiperTimer: number;
  swiperSwitchingTimer: number;
}

const defaultNavigation: SwiperNavigation = {
  placement: 'inside',
  showSlideBtn: 'always',
  size: 'medium',
  type: 'bars',
};

export default (Vue as VueConstructor<SwiperVue>).extend({
  name: 'TSwiper',

  components: {
    TSwiperItem,
  },

  ...{ swiperTimer: 0, swiperSwitchingTimer: 0 },

  props: { ...props },

  data() {
    return {
      currentIndex: 0,
      isHovering: false,
      isSwitching: false,
      swiperItemList: [] as Array<VNodeComponentOptions>,
      showArrow: false,
    };
  },

  computed: {
    swiperItemLength(): number {
      return this.swiperItemList.length;
    },
    navigationConfig(): SwiperNavigation {
      return {
        ...defaultNavigation,
        ...(isVNode(this.navigation as VNode) ? {} : this.navigation),
      };
    },
    isEnd(): boolean {
      if (this.type === 'card') {
        return !this.loop && this.currentIndex + 1 >= this.swiperItemLength;
      }
      return !this.loop && this.currentIndex + 2 >= this.swiperItemLength;
    },
    propsToUpdateSetTimer(): Array<any> {
      return [this.autoplay, this.currentIndex, this.duration, this.interval];
    },
    swiperWrapClass(): any {
      return {
        [`${prefix}-swiper__wrap`]: true,
        [`${prefix}-swiper--inside`]: this.navigationConfig.placement === 'inside',
        [`${prefix}-swiper--outside`]: this.navigationConfig.placement === 'outside',
        [`${prefix}-swiper--vertical`]: this.direction === 'vertical',
        [`${prefix}-swiper--large`]: this.navigationConfig.size === 'large',
        [`${prefix}-swiper--small`]: this.navigationConfig.size === 'small',
      };
    },
    containerStyle(): any {
      const offsetHeight = this.height ? `${this.height}px` : `${this.getWrapAttribute('offsetHeight')}px`;
      if (this.type === 'card' || this.animation === 'fade') {
        return {
          height: offsetHeight,
        };
      }
      if (this.animation === 'slide') {
        if (this.direction === 'vertical') {
          return {
            height: offsetHeight,
            transform: `translate3d(0, -${this.currentIndex * 100}%, 0px)`,
            transition: this.isSwitching ? `transform ${this.duration / 1000}s ease` : '',
          };
        }
        return {
          msTransform: `translate3d(-${this.currentIndex * 100}%, 0px, 0px)`,
          WebkitTransform: `translate3d(-${this.currentIndex * 100}%, 0px, 0px)`,
          transform: `translate3d(-${this.currentIndex * 100}%, 0px, 0px)`,
          transition: this.isSwitching ? `transform ${this.duration / 1000}s ease` : '',
        };
      }
      return {};
    },
    swiperItems(): Array<VNode> {
      return this.swiperItemList.map((swiperItem: VNodeComponentOptions, index) => (
        <TSwiperItem
          index={index}
          currentIndex={this.currentIndex}
          isSwitching={this.isSwitching}
          getWrapAttribute={this.getWrapAttribute}
          swiperItemLength={this.swiperItemLength}
          props={{ ...this.$props, ...swiperItem.propsData }}
        >
          {swiperItem.children}
        </TSwiperItem>
      ));
    },
  },

  watch: {
    propsToUpdateSetTimer() {
      this.setTimer();
    },
    isSwitching() {
      if (this.isSwitching) {
        if (this.swiperSwitchingTimer) clearTimeout(this.swiperSwitchingTimer);
        this.swiperSwitchingTimer = setTimeout(() => {
          this.isSwitching = false;
          this.swiperSwitchingTimer = 0;
          if (this.isEnd) {
            this.clearTimer();
          }
        }, this.duration + 50) as unknown as number;
      }
    },
    current() {
      this.swiperTo(this.current, { source: 'autoplay' });
    },
  },

  mounted() {
    this.updateSwiperItems();
    this.setTimer();
    this.showArrow = this.navigationConfig.showSlideBtn === 'always';
  },

  updated() {
    this.$nextTick(() => {
      this.updateSwiperItems();
    });
  },

  methods: {
    updateSwiperItems() {
      const originalChildren = this.$scopedSlots.default?.({}) || [];
      const swiperItemList = originalChildren
        .map((swiper: VNode) => swiper.componentOptions)
        .filter((swiper) => kebabCase(swiper?.tag).endsWith(`${prefix}-swiper-item`));
      const isUnchange = swiperItemList.length === this.swiperItemList.length
        && this.swiperItemList.every((swiperItem, index) => swiperItem === swiperItemList[index]);
      if (isUnchange) return;
      this.swiperItemList = swiperItemList;
    },
    setTimer() {
      if (this.autoplay && this.interval > 0) {
        this.clearTimer();
        this.swiperTimer = setTimeout(
          () => {
            this.swiperTo(this.currentIndex + 1, { source: 'autoplay' });
          },
          this.currentIndex === 0 ? this.interval - (this.duration + 50) : this.interval, // 当 index 为 0 的时候，表明刚从克隆的最后一项跳转过来，已经经历了duration + 50 的间隔时间，减去即可
        ) as unknown as number;
      }
    },
    clearTimer() {
      if (this.swiperTimer) {
        clearTimeout(this.swiperTimer);
        this.swiperTimer = 0;
      }
    },
    onMouseEnter() {
      this.isHovering = true;
      if (this.stopOnHover) {
        this.clearTimer();
      }
      if (this.navigationConfig.showSlideBtn === 'hover') {
        this.showArrow = true;
      }
    },
    onMouseLeave() {
      this.isHovering = false;
      if (!this.isEnd) {
        this.setTimer();
      }
      if (this.navigationConfig.showSlideBtn === 'hover') {
        this.showArrow = false;
      }
    },
    onMouseEnterNavigationItem(i: number) {
      this.swiperTo(i, { source: 'hover' });
    },
    onClickNavigationItem(i: number) {
      this.swiperTo(i, { source: 'click' });
    },
    swiperTo(index: number, context: { source: SwiperChangeSource }) {
      const targetIndex = index % this.swiperItemLength;
      emitEvent<Parameters<TdSwiperProps['onChange']>>(this, 'change', targetIndex, context);
      this.isSwitching = true;
      this.currentIndex = targetIndex;
    },
    goNext(context: { source: SwiperChangeSource }) {
      if (this.isSwitching) return;
      if (this.type === 'card') {
        return this.swiperTo(this.currentIndex + 1 >= this.swiperItemLength ? 0 : this.currentIndex + 1, context);
      }
      return this.swiperTo(this.currentIndex + 1, context);
    },
    goPrevious(context: { source: SwiperChangeSource }) {
      if (this.isSwitching) return;
      if (this.currentIndex - 1 < 0) {
        return this.swiperTo(this.swiperItemLength - 1, context);
      }
      return this.swiperTo(this.currentIndex - 1, context);
    },
    getWrapAttribute(attr: string) {
      return (this.$refs.swiperWrap as Element)?.parentNode?.[attr];
    },
    renderPagination() {
      const fractionIndex = this.currentIndex + 1 > this.swiperItemLength ? 1 : this.currentIndex + 1;
      return (
        <div class={`${prefix}-swiper__arrow`}>
          <div class={`${prefix}-swiper__arrow-left`} onClick={() => this.goPrevious({ source: 'click' })}>
            <ChevronLeftIcon />
          </div>
          <div class={`${prefix}-swiper__navigation-text-fraction`}>
            {fractionIndex}/{this.swiperItemLength}
          </div>
          <div class={`${prefix}-swiper__arrow-right`} onClick={() => this.goNext({ source: 'click' })}>
            <ChevronRightIcon />
          </div>
        </div>
      );
    },
    renderArrow() {
      if (!this.showArrow) return null;
      return (
        <div class={[`${prefix}-swiper__arrow`, `${prefix}-swiper__arrow--default`]}>
          <div class={`${prefix}-swiper__arrow-left`} onClick={() => this.goPrevious({ source: 'click' })}>
            <ChevronLeftIcon />
          </div>
          <div class={`${prefix}-swiper__arrow-right`} onClick={() => this.goNext({ source: 'click' })}>
            <ChevronRightIcon />
          </div>
        </div>
      );
    },
    renderNavigation() {
      if (isVNode(this.navigation as VNode)) return this.navigation;
      if (this.navigationConfig.type === 'fraction') {
        return (
          <div class={[`${prefix}-swiper__navigation`, `${prefix}-swiper__navigation--fraction`]}>
            {this.renderPagination()}
          </div>
        );
      }

      return (
        <ul
          class={[
            `${prefix}-swiper__navigation`,
            {
              [`${prefix}-swiper__navigation-bars`]: this.navigationConfig.type === 'bars',
            },
          ]}
        >
          {this.swiperItemList.map((_, i: number) => (
            <li
              key={i}
              class={[
                `${prefix}-swiper__navigation-item`,
                {
                  [`${prefix}-is-active`]: i === this.currentIndex,
                },
              ]}
              onMouseenter={() => this.onMouseEnterNavigationItem(i)}
              onClick={() => this.onClickNavigationItem(i)}
            >
              <span></span>
            </li>
          ))}
        </ul>
      );
    },
    renderSwiperItems() {
      return this.swiperItems;
    },
  },

  render() {
    return (
      <div
        class={[`${prefix}-swiper`]}
        onMouseenter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        ref="swiperWrap"
      >
        <div class={this.swiperWrapClass}>
          <div
            class={[
              `${prefix}-swiper__content`,
              {
                [`${prefix}-swiper-fade`]: this.animation === 'fade',
                [`${prefix}-swiper-card`]: this.type === 'card',
              },
            ]}
          >
            <div class={`${prefix}-swiper__container`} style={this.containerStyle}>
              {this.renderSwiperItems()}
            </div>
          </div>
          {this.renderNavigation()}
          {this.renderArrow()}
        </div>
      </div>
    );
  },
});
