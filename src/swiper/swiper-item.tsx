import { VNode } from 'vue';
import { getClassPrefixMixins } from '../config-provider/config-receiver';
import mixins from '../utils/mixins';
import props from './props';

const classPrefixMixins = getClassPrefixMixins('swiper');

const CARD_SCALE = 210 / 332; // 缩放比例
const ITEM_WIDTH = 0.415; // 依据设计稿使用t-swiper__card控制每个swiper的宽度为41.5%

const swiperItemProps = {
  index: {
    type: Number,
  },
  currentIndex: {
    type: Number,
  },
  cardScale: {
    type: Number,
    default: CARD_SCALE,
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

export default mixins(classPrefixMixins).extend({
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
        return (
          (wrapWidth * ((translateIndex - this.currentIndex) * (1 - ITEM_WIDTH * this.cardScale) - ITEM_WIDTH + 1)) / 2
        );
      }
      if (translateIndex < this.currentIndex) {
        return (-ITEM_WIDTH * (1 + this.cardScale) * wrapWidth) / 2;
      }
      return ((2 + ITEM_WIDTH * (this.cardScale - 1)) * wrapWidth) / 2;
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
          zIndex: this.active ? 1 : 0,
        };
      }
      if (this.type === 'card') {
        const translateIndex = !this.active && this.swiperItemLength > 2 ? this.disposeIndex : this.index;
        const isActivity = translateIndex === this.currentIndex;
        return {
          transform: `translateX(${this.translateX}px) scale(${isActivity ? 1 : this.cardScale})`,
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
          `${this.classPrefix}-swiper__container__item`,
          {
            [`${this.classPrefix}-swiper__card`]: this.type === 'card',
            [`${this.classPrefix}-is-active`]: this.type === 'card' && this.active,
            [`${this.classPrefix}-swiper__fade`]: this.animation === 'fade',
          },
        ]}
        style={this.itemStyle}
      >
        {this.$scopedSlots.default?.({}) || []}
      </div>
    );
  },
});
