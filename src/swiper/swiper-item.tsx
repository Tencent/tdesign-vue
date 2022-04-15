import Vue, { VNode } from 'vue';
import { prefix } from '../config';
import props from './props';

const swiperItemProps = {
  index: {
    type: Number,
  },
  currentIndex: {
    type: Number,
  },
  isSwitching: {
    type: Boolean,
    default: false,
  },
  getWrapAttribute: {
    type: Function,
  },
  swiperItemLength: {
    type: Number,
    default: 0,
  },
};
const CARD_SCALE = 210 / 332; // 缩放比例
const itemWidth = 0.415; // 依据设计稿使用t-swiper__card控制每个swiper的宽度为41.5%

export default Vue.extend({
  name: 'TSwiperItem',

  props: {
    ...props,
    ...swiperItemProps,
  },

  computed: {
    active(): boolean {
      return this.index === this.currentIndex;
    },
    disposeIndex(): number {
      if (this.type !== 'card') return 0;
      if (this.currentIndex === 0 && this.index === this.swiperItemLength - 1) {
        return -1;
      }
      if (this.currentIndex === this.swiperItemLength - 1 && this.index === 0) {
        return this.swiperItemLength;
      }
      if (this.index < this.currentIndex - 1 && this.currentIndex - this.index >= this.swiperItemLength / 2) {
        return this.swiperItemLength + 1;
      }
      if (this.index > this.currentIndex + 1 && this.index - this.currentIndex >= this.swiperItemLength / 2) {
        return -2;
      }

      return this.index;
    },
    translateX(): number {
      if (this.type !== 'card') return 0;
      const wrapWidth = this.getWrapAttribute('offsetWidth');
      const translateIndex = !this.active && this.swiperItemLength > 2 ? this.disposeIndex : this.index;
      const inStage = Math.abs(translateIndex - this.currentIndex) <= 1;
      if (inStage) {
        return (wrapWidth * ((translateIndex - this.currentIndex) * (1 - itemWidth * CARD_SCALE) - itemWidth + 1)) / 2;
      }
      if (translateIndex < this.currentIndex) {
        return (-itemWidth * (1 + CARD_SCALE) * wrapWidth) / 2;
      }
      return ((2 + itemWidth * (CARD_SCALE - 1)) * wrapWidth) / 2;
    },
    zIndex(): number {
      if (this.type !== 'card') return 0;
      const translateIndex = !this.active && this.swiperItemLength > 2 ? this.disposeIndex : this.index;
      const isActivity = translateIndex === this.currentIndex;
      const inStage = Math.round(Math.abs(translateIndex - this.currentIndex)) <= 1;
      if (isActivity) {
        return 2;
      }
      if (inStage) {
        return 1;
      }
      return 0;
    },
    itemStyle(): any {
      if (this.animation === 'fade') {
        return {
          opacity: this.active ? 1 : 0,
          transition: this.isSwitching ? `opacity ${this.duration / 1000}s` : '',
        };
      }
      if (this.type === 'card') {
        const translateIndex = !this.active && this.swiperItemLength > 2 ? this.disposeIndex : this.index;
        const isActivity = translateIndex === this.currentIndex;
        return {
          transform: `translateX(${this.translateX}px) scale(${isActivity ? 1 : CARD_SCALE})`,
          transition: `transform ${this.duration / 1000}s ease`,
          zIndex: this.zIndex,
        };
      }
      return {};
    },
  },

  render(): VNode {
    return (
      <div
        class={[
          `${prefix}-swiper__container__item`,
          {
            [`${prefix}-swiper__card`]: this.type === 'card',
            [`${prefix}-is-active`]: this.type === 'card' && this.active,
            [`${prefix}-swiper__fade`]: this.animation === 'fade',
          },
        ]}
        style={this.itemStyle}
      >
        {this.$scopedSlots.default?.({}) || []}
      </div>
    );
  },
});
