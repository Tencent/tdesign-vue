import Vue, { VNode } from 'vue';
import { emitEvent } from '../utils/event';
import { prefix } from '../config';
import props from './props';
import { SwiperChangeSource, TdSwiperProps } from '.';

const name = `${prefix}-swiper`;

export default Vue.extend({
  name: 'TSwiper',
  props: { ...props },
  data() {
    return {
      // 是否可见，关闭后置为false
      visible: true,
      // 轮播序列
      index: 0,
      // 自动轮播定时器handler
      timeoutHandler: null,
    };
  },
  computed: {
    items(): VNode[] {
      return (this.$slots.default || []).filter((child) => {
        const node = child as VNode;
        return node.componentOptions && node.componentOptions.tag === `${prefix}-swiper-item`;
      });
    },
  },
  watch: {
    interval: {
      handler() {
        this.swiperTo(this.index, ''); // 重置定时器
      },
      immediate: true,
    },
  },
  render(): VNode {
    const swiperClass = [
      `${name}`,
      {
        [`${prefix}-is-hidden`]: !this.visible,
      },
    ];
    return (
      <div class={swiperClass} onMouseenter={this.clearTimer} onMouseleave={this.setTimer}>
        {this.renderContent()}
        {this.renderTrigger()}
      </div>
    );
  },
  methods: {
    renderContent(): VNode {
      let wrapperStyles = {};
      if (this.direction === 'vertical') {
        wrapperStyles = {
          height: `${this.items.length * 100}%`,
          transform: `translate(0,${(-this.index * 100) / this.items.length}%)`,
          transition: `transform ${this.duration / 1000}s`,
        };
      } else {
        wrapperStyles = {
          width: `${this.items.length * 100}%`,
          transform: `translate(${(-this.index * 100) / this.items.length}%,0)`,
          transition: `transform ${this.duration / 1000}s`,
        };
      }
      return (
        <div class={`${name}__content`}>
          <div class={`${name}__swiper-wrap--${this.direction}`} style={wrapperStyles}>
            {this.items}
          </div>
        </div>
      );
    },

    renderTrigger(): VNode {
      const index = this.index % this.items.length;
      return (
        <ul class="t-swiper__trigger-wrap">
          {this.items.map((_: VNode, i: number) => (
            <li class={i === index ? 't-swiper__trigger--active' : ''} onclick={() => this.swiperTo(i, 'touch')}></li>
          ))}
        </ul>
      );
    },

    swiperToNext(source: SwiperChangeSource) {
      const number = this.index + 1;
      this.swiperTo(number, source);
      if (source) {
        emitEvent<Parameters<TdSwiperProps['onChange']>>(this, 'change', number, { source });
      }
    },

    swiperTo(index: number, source: SwiperChangeSource) {
      const findIndex = this.items.length === 0 ? 0 : index % this.items.length;
      if (this.timeoutHandler) {
        this.clearTimer();
      }
      this.index = findIndex;
      if (this.interval > 0) {
        this.timeoutHandler = setTimeout(() => {
          this.swiperToNext(source);
        }, this.interval);
      }
    },

    setTimer() {
      if (this.interval > 0) {
        this.timeoutHandler = Number(
          setTimeout(() => {
            this.clearTimer();
            this.swiperToNext('autoplay');
          }, this.interval),
        );
      }
    },

    clearTimer() {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    },
  },
});
