import Vue, { VueConstructor } from 'vue';
import isFunction from 'lodash/isFunction';
import { prefix } from '../config';
import { on, off, getScrollContainer } from '../utils/dom';
import affixProps from './props';
import { ScrollContainerElement } from '../common';

const name = `${prefix}-affix`;
export interface Affix extends Vue {
  scrollContainer: ScrollContainerElement;
  ticking: boolean;
  placeholderEL: HTMLElement;
  $refs: {
    affixWrapRef: HTMLElement;
    affixRef: HTMLElement;
  };
}

export default (Vue as VueConstructor<Affix>).extend({
  name: 'TAffix',
  props: {
    ...affixProps,
  },
  watch: {
    offsetTop() {
      this.handleScroll();
    },
    offsetBottom() {
      this.handleScroll();
    },
    zIndex() {
      this.handleScroll();
    },
  },
  methods: {
    handleScroll() {
      const { scrollContainer, offsetTop, offsetBottom } = this;
      const { affixWrapRef, affixRef } = this.$refs;
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          // top = 节点到页面顶部的距离，包含 scroll 中的高度
          const {
            top: wrapToTop,
            width: wrapWidth,
            height: wrapHeight,
          } = affixWrapRef.getBoundingClientRect() ?? { top: 0, width: 0, height: 0 };

          let containerTop = 0; // containerTop = 容器到页面顶部的距离
          if (scrollContainer instanceof HTMLElement) {
            containerTop = scrollContainer.getBoundingClientRect().top;
          }

          let fixedTop: number | false;
          const calcTop = wrapToTop - containerTop; // 节点顶部到 container 顶部的距离

          const containerHeight = scrollContainer[scrollContainer instanceof Window ? 'innerHeight' : 'clientHeight'] - wrapHeight;
          const calcBottom = containerTop + containerHeight - offsetBottom; // 计算 bottom 相对应的 top 值

          if (offsetTop !== undefined && calcTop <= offsetTop) {
            // top 的触发
            fixedTop = containerTop + offsetTop;
          } else if (offsetBottom !== undefined && wrapToTop >= calcBottom) {
            // bottom 的触发
            fixedTop = calcBottom;
          } else {
            fixedTop = false;
          }

          if (affixRef) {
            const affixed = fixedTop !== false;
            const placeholderStatus = affixWrapRef.contains(this.placeholderEL);

            if (affixed) {
              affixRef.className = name;
              affixRef.style.top = `${fixedTop}px`;
              affixRef.style.width = `${wrapWidth}px`;
              affixRef.style.height = `${wrapHeight}px`;

              if (this.zIndex) {
                affixRef.style.zIndex = `${this.zIndex}`;
              }

              // 插入占位节点
              if (!placeholderStatus) {
                this.placeholderEL.style.width = `${wrapWidth}px`;
                this.placeholderEL.style.height = `${wrapHeight}px`;
                affixWrapRef.appendChild(this.placeholderEL);
              }
            } else {
              affixRef.removeAttribute('class');
              affixRef.removeAttribute('style');

              // 删除占位节点
              placeholderStatus && this.placeholderEL.remove();
            }

            this.$emit('fixedChange', affixed, { top: fixedTop });
            if (isFunction(this.onFixedChange)) this.onFixedChange(affixed, { top: Number(fixedTop) });
          }

          this.ticking = false;
        });
        this.ticking = true;
      }
    },
  },
  mounted() {
    this.placeholderEL = document.createElement('div');
    this.$nextTick(() => {
      this.scrollContainer = getScrollContainer(this.container);
      this.handleScroll();
      on(this.scrollContainer, 'scroll', this.handleScroll);
      on(window, 'resize', this.handleScroll);
    });
  },
  destroyed() {
    if (!this.scrollContainer) return;
    off(this.scrollContainer, 'scroll', this.handleScroll);
    off(window, 'resize', this.handleScroll);
  },
  render() {
    return (
      <div ref="affixWrapRef">
        <div ref="affixRef">{this.$slots.default}</div>
      </div>
    );
  },
});
